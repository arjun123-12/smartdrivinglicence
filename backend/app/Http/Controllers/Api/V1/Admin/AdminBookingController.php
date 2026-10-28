<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminBookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Booking::with(['customer', 'instructor', 'serviceType', 'package', 'location', 'latestPayment']);

        if ($request->filled('status')) {
            $query->where('booking_status', $request->input('status'));
        }

        if ($request->filled('instructor_id')) {
            $query->where('instructor_id', $request->input('instructor_id'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('booking_reference', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $bookings = $query->orderBy('start_time', 'desc')->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $bookings,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $booking = Booking::with(['customer.customerProfile', 'instructor', 'serviceType', 'package', 'location', 'items', 'payments.refunds'])
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $booking,
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'booking_status' => 'required|in:pending,confirmed,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
            'cancellation_reason' => 'nullable|string',
        ]);

        $oldStatus = $booking->booking_status;
        $booking->booking_status = $validated['booking_status'];
        if ($validated['booking_status'] === 'cancelled' && empty($booking->cancelled_at)) {
            $booking->cancelled_at = now();
            $booking->cancellation_reason = $validated['cancellation_reason'] ?? 'Cancelled by administrator.';
        }
        if (!empty($validated['notes'])) {
            $booking->notes = $validated['notes'];
        }
        $booking->save();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'admin_updated_booking_status',
            'entity_type' => 'Booking',
            'entity_id' => (string) $booking->id,
            'old_values' => ['status' => $oldStatus],
            'new_values' => ['status' => $booking->booking_status],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking status updated successfully.',
            'booking' => $booking->load(['latestPayment', 'customer']),
        ]);
    }

    public function reschedule(Request $request, int $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'instructor_id' => 'nullable|exists:instructors,id',
        ]);

        $startTime = Carbon::parse($validated['start_time']);
        $endTime = Carbon::parse($validated['end_time']);
        $instructorId = $validated['instructor_id'] ?? $booking->instructor_id;

        DB::transaction(function () use ($booking, $instructorId, $startTime, $endTime) {
            // Check conflicts
            $conflict = Booking::where('instructor_id', $instructorId)
                ->where('id', '!=', $booking->id)
                ->whereIn('booking_status', ['confirmed', 'pending', 'in_progress'])
                ->where(function ($q) use ($startTime, $endTime) {
                    $q->where('start_time', '<', $endTime)
                      ->where('end_time', '>', $startTime);
                })
                ->lockForUpdate()
                ->first();

            if ($conflict) {
                abort(422, 'Cannot reschedule: selected slot conflicts with another booking.');
            }

            $booking->update([
                'instructor_id' => $instructorId,
                'start_time' => $startTime,
                'end_time' => $endTime,
            ]);
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Booking rescheduled successfully.',
            'booking' => $booking->load(['instructor', 'customer']),
        ]);
    }
}

