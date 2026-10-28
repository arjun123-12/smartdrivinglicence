<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\CustomerProfile;
use App\Models\Instructor;
use App\Models\LessonPackage;
use App\Models\Location;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\ServiceType;
use App\Models\Setting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Calculate price and itemized breakdown.
     */
    public function calculatePrice(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_type_id' => 'required|exists:service_types,id',
            'instructor_id' => 'required|exists:instructors,id',
            'package_id' => 'nullable|exists:lesson_packages,id',
        ]);

        $service = ServiceType::findOrFail($validated['service_type_id']);
        $instructor = Instructor::findOrFail($validated['instructor_id']);
        $package = !empty($validated['package_id']) ? LessonPackage::find($validated['package_id']) : null;

        $items = [];
        $total = 0.0;

        if ($package) {
            $total = (float) $package->current_price;
            $items[] = [
                'type' => 'package',
                'description' => $package->name . ' (' . $package->lesson_hours . ' Hours)',
                'quantity' => 1,
                'unit_price' => $package->current_price,
                'total_price' => $package->current_price,
            ];
        } else {
            $hours = ($service->default_duration_minutes ?? 60) / 60;
            $unitPrice = $service->is_test 
                ? (float) ($instructor->vort_test_rate > 0 ? $instructor->vort_test_rate : $service->default_price)
                : (float) ($instructor->base_hourly_rate * $hours);

            $total = $unitPrice;
            $items[] = [
                'type' => 'service',
                'description' => $service->name . ' with ' . $instructor->name,
                'quantity' => 1,
                'unit_price' => number_format($unitPrice, 2, '.', ''),
                'total_price' => number_format($unitPrice, 2, '.', ''),
            ];
        }

        return response()->json([
            'status' => 'success',
            'currency' => 'AUD',
            'total_amount' => number_format($total, 2, '.', ''),
            'items' => $items,
        ]);
    }

    /**
     * Create a booking with atomic double-booking prevention.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_type_id' => 'required|exists:service_types,id',
            'instructor_id' => 'required|exists:instructors,id',
            'location_id' => 'required|exists:locations,id',
            'package_id' => 'nullable|exists:lesson_packages,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'pickup_address' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
            // Customer details (for guest or update)
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:25',
            'licence_number' => 'nullable|string|max:50',
            'licence_type' => 'nullable|string|in:learner,provisional_1,provisional_2,full,international',
        ]);

        $startTime = Carbon::parse($validated['start_time'], 'Australia/Adelaide');
        $endTime = Carbon::parse($validated['end_time'], 'Australia/Adelaide');

        // Execute in database transaction with row locking
        $booking = DB::transaction(function () use ($request, $validated, $startTime, $endTime) {
            // 1. Double booking lock & verification
            $conflictingBooking = Booking::where('instructor_id', $validated['instructor_id'])
                ->whereIn('booking_status', ['confirmed', 'pending', 'in_progress'])
                ->where(function ($query) use ($startTime, $endTime) {
                    $query->where(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<', $endTime)
                          ->where('end_time', '>', $startTime);
                    });
                })
                ->lockForUpdate()
                ->first();

            if ($conflictingBooking) {
                abort(422, 'The selected appointment slot has just been reserved by another customer. Please choose another time slot.');
            }

            // 2. Resolve customer user
            $user = $request->user();
            if (!$user) {
                // Find or create customer
                $user = User::firstOrCreate(
                    ['email' => $validated['customer_email']],
                    [
                        'name' => $validated['customer_name'],
                        'phone' => $validated['customer_phone'],
                        'password' => Hash::make(Str::random(16)),
                        'role' => 'customer',
                        'is_active' => true,
                    ]
                );

                CustomerProfile::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'licence_number' => $validated['licence_number'] ?? null,
                        'licence_type' => $validated['licence_type'] ?? 'learner',
                        'licence_state' => 'SA',
                        'address' => $validated['pickup_address'],
                    ]
                );
            }

            // 3. Compute price snapshot
            $service = ServiceType::findOrFail($validated['service_type_id']);
            $instructor = Instructor::findOrFail($validated['instructor_id']);
            $package = !empty($validated['package_id']) ? LessonPackage::find($validated['package_id']) : null;

            if ($package) {
                $finalPrice = (float) $package->current_price;
                $itemDesc = $package->name . ' (' . $package->lesson_hours . ' Hours)';
                $itemType = 'package';
            } else {
                $durationHours = $startTime->diffInMinutes($endTime) / 60;
                $finalPrice = $service->is_test 
                    ? (float) ($instructor->vort_test_rate > 0 ? $instructor->vort_test_rate : $service->default_price)
                    : (float) ($instructor->base_hourly_rate * $durationHours);
                $itemDesc = $service->name . ' (' . round($durationHours, 1) . ' hrs)';
                $itemType = 'lesson';
            }

            // 4. Generate reference & record booking
            $reference = 'SMD-' . date('Ymd') . '-' . strtoupper(Str::random(4));

            $booking = Booking::create([
                'booking_reference' => $reference,
                'customer_id' => $user->id,
                'instructor_id' => $instructor->id,
                'service_type_id' => $service->id,
                'package_id' => $package?->id,
                'location_id' => $validated['location_id'],
                'start_time' => $startTime,
                'end_time' => $endTime,
                'timezone' => 'Australia/Adelaide',
                'booking_status' => 'pending',
                'price_snapshot' => $finalPrice,
                'currency' => 'AUD',
                'payment_status' => 'pending',
                'pickup_address' => $validated['pickup_address'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // 5. Booking items
            BookingItem::create([
                'booking_id' => $booking->id,
                'item_type' => $itemType,
                'description' => $itemDesc,
                'quantity' => 1,
                'unit_price' => $finalPrice,
                'total_price' => $finalPrice,
            ]);

            // 6. Payment record in pending state
            $paymentRef = 'PAY-' . date('Ymd') . '-' . strtoupper(Str::random(5));
            Payment::create([
                'booking_id' => $booking->id,
                'payment_reference' => $paymentRef,
                'gateway' => 'stripe_simulation',
                'amount' => $finalPrice,
                'currency' => 'AUD',
                'payment_status' => 'pending',
                'payment_method' => 'card',
            ]);

            // 7. Audit log
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'booking_created',
                'entity_type' => 'Booking',
                'entity_id' => (string) $booking->id,
                'new_values' => [
                    'reference' => $reference,
                    'amount' => $finalPrice,
                    'instructor' => $instructor->name,
                    'service' => $service->name,
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return $booking;
        });

        $booking->load(['customer', 'instructor', 'serviceType', 'package', 'location', 'latestPayment']);

        return response()->json([
            'status' => 'success',
            'message' => 'Slot held successfully. Proceed to payment.',
            'booking' => $booking,
        ], 201);
    }

    /**
     * Show booking details by reference.
     */
    public function show(string $reference): JsonResponse
    {
        $booking = Booking::where('booking_reference', $reference)
            ->with(['customer', 'instructor', 'serviceType', 'package', 'location', 'items', 'payments'])
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'booking' => $booking,
        ]);
    }

    /**
     * Customer bookings list.
     */
    public function customerBookings(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Booking::where('customer_id', $user->id)
            ->with(['instructor', 'serviceType', 'package', 'location', 'latestPayment']);

        if ($request->input('tab') === 'upcoming') {
            $query->where('start_time', '>=', now())
                  ->whereIn('booking_status', ['confirmed', 'pending']);
        } elseif ($request->input('tab') === 'past') {
            $query->where(function ($q) {
                $q->where('start_time', '<', now())
                  ->orWhereIn('booking_status', ['completed', 'cancelled']);
            });
        }

        $bookings = $query->orderBy('start_time', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $bookings,
        ]);
    }

    /**
     * Cancel booking.
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $booking = Booking::findOrFail($id);

        if (!$user->isAdmin() && $booking->customer_id !== $user->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $booking->update([
            'booking_status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $validated['reason'],
        ]);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'booking_cancelled',
            'entity_type' => 'Booking',
            'entity_id' => (string) $booking->id,
            'new_values' => ['reason' => $validated['reason']],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking has been cancelled.',
            'booking' => $booking,
        ]);
    }
}

