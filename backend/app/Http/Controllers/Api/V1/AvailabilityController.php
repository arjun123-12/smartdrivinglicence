<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AvailabilityException;
use App\Models\Booking;
use App\Models\Instructor;
use App\Models\InstructorAvailability;
use App\Models\Location;
use App\Models\ServiceType;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    /**
     * Search available time slots dynamically from MySQL data.
     */
    public function searchSlots(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_type_id' => 'required|exists:service_types,id',
            'location_id' => 'required|exists:locations,id',
            'date' => 'required|date|after_or_equal:today',
            'instructor_id' => 'nullable|exists:instructors,id',
            'transmission' => 'nullable|in:auto,manual,both',
        ]);

        $service = ServiceType::findOrFail($validated['service_type_id']);
        $location = Location::findOrFail($validated['location_id']);
        $targetDate = Carbon::parse($validated['date'])->startOfDay();
        $dayOfWeek = $targetDate->dayOfWeek; // 0 (Sun) to 6 (Sat)
        $durationMinutes = $service->default_duration_minutes ?? 60;

        // Query eligible instructors
        $instructorQuery = Instructor::where('is_active', true)
            ->whereHas('locations', function ($q) use ($location) {
                $q->where('locations.id', $location->id);
            });

        if ($service->is_test) {
            $instructorQuery->where('is_examiner', true);
        }

        if (!empty($validated['instructor_id'])) {
            $instructorQuery->where('id', $validated['instructor_id']);
        }

        if (!empty($validated['transmission'])) {
            $trans = $validated['transmission'];
            $instructorQuery->where(function ($q) use ($trans) {
                $q->where('car_transmission', $trans)
                  ->orWhere('car_transmission', 'both');
            });
        }

        $instructors = $instructorQuery->get();

        $leadHours = (int) Setting::get('booking_lead_time_hours', 12);
        $minimumStartTime = Carbon::now('Australia/Adelaide')->addHours($leadHours);

        $availableSlots = [];

        foreach ($instructors as $instructor) {
            // Check day-of-week schedule
            $schedules = InstructorAvailability::where('instructor_id', $instructor->id)
                ->where('day_of_week', $dayOfWeek)
                ->where('is_active', true)
                ->get();

            if ($schedules->isEmpty()) {
                continue;
            }

            // Check full-day or partial exception for this date
            $exceptions = AvailabilityException::where('instructor_id', $instructor->id)
                ->whereDate('date', $targetDate)
                ->where('is_unavailable', true)
                ->get();

            // Full day off
            $isFullDayOff = $exceptions->contains(function ($ex) {
                return empty($ex->start_time) && empty($ex->end_time);
            });
            if ($isFullDayOff) {
                continue;
            }

            // Get existing bookings for this instructor on this date
            $existingBookings = Booking::where('instructor_id', $instructor->id)
                ->whereDate('start_time', $targetDate)
                ->whereIn('booking_status', ['confirmed', 'pending', 'in_progress'])
                ->get(['id', 'start_time', 'end_time']);

            foreach ($schedules as $sched) {
                $schedStart = Carbon::parse($targetDate->toDateString() . ' ' . $sched->start_time, 'Australia/Adelaide');
                $schedEnd = Carbon::parse($targetDate->toDateString() . ' ' . $sched->end_time, 'Australia/Adelaide');

                $slotCursor = $schedStart->copy();

                // Slot steps (allow buffer for travel / briefing: 15 mins buffer)
                $stepMinutes = $durationMinutes + 15;

                while ($slotCursor->copy()->addMinutes($durationMinutes)->lte($schedEnd)) {
                    $slotStart = $slotCursor->copy();
                    $slotEnd = $slotStart->copy()->addMinutes($durationMinutes);

                    // Skip past slots or slots within lead time
                    if ($slotStart->lt($minimumStartTime)) {
                        $slotCursor->addMinutes(30);
                        continue;
                    }

                    // Check overlap with existing bookings
                    $hasBookingOverlap = $existingBookings->contains(function ($b) use ($slotStart, $slotEnd) {
                        $bStart = Carbon::parse($b->start_time, 'Australia/Adelaide');
                        $bEnd = Carbon::parse($b->end_time, 'Australia/Adelaide');
                        return $slotStart->lt($bEnd) && $slotEnd->gt($bStart);
                    });

                    // Check overlap with partial exceptions
                    $hasExceptionOverlap = $exceptions->contains(function ($ex) use ($targetDate, $slotStart, $slotEnd) {
                        if (empty($ex->start_time) || empty($ex->end_time)) {
                            return true;
                        }
                        $exStart = Carbon::parse($targetDate->toDateString() . ' ' . $ex->start_time, 'Australia/Adelaide');
                        $exEnd = Carbon::parse($targetDate->toDateString() . ' ' . $ex->end_time, 'Australia/Adelaide');
                        return $slotStart->lt($exEnd) && $slotEnd->gt($exStart);
                    });

                    if (!$hasBookingOverlap && !$hasExceptionOverlap) {
                        // Calculate price for this instructor & service
                        $price = $service->is_test 
                            ? (float) ($instructor->vort_test_rate > 0 ? $instructor->vort_test_rate : $service->default_price)
                            : (float) ($instructor->base_hourly_rate * ($durationMinutes / 60));

                        $availableSlots[] = [
                            'instructor_id' => $instructor->id,
                            'instructor_name' => $instructor->name,
                            'instructor_image' => $instructor->profile_image,
                            'car_model' => $instructor->car_model,
                            'car_transmission' => $instructor->car_transmission,
                            'is_examiner' => (bool) $instructor->is_examiner,
                            'location_id' => $location->id,
                            'location_name' => $location->name,
                            'service_type_id' => $service->id,
                            'service_name' => $service->name,
                            'date' => $targetDate->toDateString(),
                            'start_time' => $slotStart->format('Y-m-d H:i:s'),
                            'end_time' => $slotEnd->format('Y-m-d H:i:s'),
                            'display_time' => $slotStart->format('g:i A'),
                            'display_end' => $slotEnd->format('g:i A'),
                            'duration_minutes' => $durationMinutes,
                            'price' => number_format($price, 2, '.', ''),
                            'currency' => 'AUD',
                        ];
                    }

                    // Advance cursor by 30 mins to offer practical starting slots
                    $slotCursor->addMinutes(30);
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'count' => count($availableSlots),
            'slots' => $availableSlots,
        ]);
    }
}

