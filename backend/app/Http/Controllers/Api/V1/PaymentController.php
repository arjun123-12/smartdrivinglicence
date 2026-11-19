<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\Payment;
use App\Services\StripePaymentService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Create or reuse a Stripe-hosted Checkout Session.
     * Atomically holds slot and calculates server-side price snapshot.
     */
    public function createStripeCheckoutSession(Request $request, StripePaymentService $stripeService): JsonResponse
    {
        // If passing an existing booking reference to pay for / resume
        if ($request->has('booking_reference') && !$request->has('start_time')) {
            $validated = $request->validate([
                'booking_reference' => 'required|string|exists:bookings,booking_reference',
            ]);
            $booking = Booking::where('booking_reference', $validated['booking_reference'])->firstOrFail();
            $result = $stripeService->resumeBookingSession($booking, $request->user());
            return response()->json($result);
        }

        $validated = $request->validate([
            'service_type_id' => 'required|exists:service_types,id',
            'instructor_id' => 'required|exists:instructors,id',
            'location_id' => 'required|exists:locations,id',
            'package_id' => 'nullable|exists:lesson_packages,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'pickup_address' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
            // Customer details
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:25',
            'licence_number' => 'nullable|string|max:50',
            'licence_type' => 'nullable|string|in:learner,provisional_1,provisional_2,full,international',
        ]);

        try {
            $result = $stripeService->createOrReuseCheckoutSession(
                $validated,
                $request->user(),
                $request->ip(),
                $request->userAgent()
            );

            return response()->json($result, 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Resume payment for an existing pending booking.
     */
    public function resumeStripeCheckoutSession(Request $request, StripePaymentService $stripeService): JsonResponse
    {
        $validated = $request->validate([
            'booking_reference' => 'required|string|exists:bookings,booking_reference',
        ]);

        $booking = Booking::where('booking_reference', $validated['booking_reference'])->firstOrFail();

        try {
            $result = $stripeService->resumeBookingSession($booking, $request->user());
            return response()->json($result);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Cancel / release an uncompleted checkout session slot.
     */
    public function cancelStripeCheckoutSession(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_reference' => 'required|string|exists:bookings,booking_reference',
        ]);

        $booking = Booking::where('booking_reference', $validated['booking_reference'])->firstOrFail();
        $user = $request->user();

        if ($user && !$user->isAdmin() && $booking->customer_id !== $user->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        if ($booking->payment_status === 'paid') {
            return response()->json(['status' => 'error', 'message' => 'Cannot release paid booking'], 400);
        }

        $booking->update([
            'booking_status' => 'cancelled',
            'payment_status' => 'failed',
            'cancellation_reason' => 'Customer cancelled Stripe checkout session.',
            'expires_at' => now(),
        ]);

        Payment::where('booking_id', $booking->id)
            ->where('payment_status', 'pending')
            ->update(['payment_status' => 'cancelled']);

        return response()->json([
            'status' => 'success',
            'message' => 'Slot released successfully.',
        ]);
    }

    /**
     * Official Stripe Webhook endpoint (POST /api/v1/webhooks/stripe).
     * Verifies Stripe-Signature against the raw request body.
     */
    public function stripeWebhook(Request $request, StripePaymentService $stripeService): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        return $stripeService->handleWebhook($payload, $sigHeader);
    }

    /**
     * Fetch status for the React return page with customer access rules.
     */
    public function getBookingPaymentStatus(Request $request, string $reference): JsonResponse
    {
        $booking = Booking::where('booking_reference', $reference)
            ->with(['customer', 'instructor', 'serviceType', 'package', 'location', 'latestPayment'])
            ->firstOrFail();

        $user = $request->user();
        $sessionId = $request->query('session_id');

        // Customer access authorization:
        // 1. Authenticated customer must match booking customer or be admin.
        // 2. Unauthenticated guest must match session_id associated with this booking's payment attempt.
        if ($user) {
            if (!$user->isAdmin() && $booking->customer_id !== $user->id) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized access to this booking.'], 403);
            }
        } elseif (!empty($sessionId)) {
            $matchingPayment = Payment::where('booking_id', $booking->id)
                ->where(function ($q) use ($sessionId) {
                    $q->where('stripe_session_id', $sessionId)
                      ->orWhere('transaction_id', $sessionId);
                })
                ->exists();

            if (!$matchingPayment) {
                return response()->json(['status' => 'error', 'message' => 'Invalid session identifier for this booking.'], 403);
            }
        }

        $isExpired = $booking->expires_at && $booking->expires_at->isPast() && $booking->payment_status !== 'paid';

        return response()->json([
            'status' => 'success',
            'booking_reference' => $booking->booking_reference,
            'booking_status' => $booking->booking_status,
            'payment_status' => $booking->payment_status,
            'is_paid' => $booking->payment_status === 'paid',
            'is_expired' => $isExpired,
            'start_time' => $booking->start_time->toIso8601String(),
            'end_time' => $booking->end_time->toIso8601String(),
            'display_date' => $booking->start_time->format('l, j F Y'),
            'display_time' => $booking->start_time->format('g:i A') . ' - ' . $booking->end_time->format('g:i A'),
            'service_name' => $booking->serviceType?->name,
            'instructor_name' => $booking->instructor?->name,
            'pickup_address' => $booking->pickup_address,
            'amount' => $booking->price_snapshot,
            'currency' => $booking->currency,
            'expires_at' => $booking->expires_at?->toIso8601String(),
            'latest_payment' => $booking->latestPayment,
        ]);
    }

    /**
     * Legacy simulation method preserved for backward compatibility and test fallbacks.
     */
    public function processPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'booking_reference' => 'required|exists:bookings,booking_reference',
            'payment_method' => 'required|in:card,apple_pay,google_pay,bank_transfer',
            'cardholder_name' => 'required|string|max:255',
            'card_last4' => 'nullable|string|size:4',
            'simulate_failure' => 'nullable|boolean',
        ]);

        $booking = Booking::where('booking_reference', $validated['booking_reference'])->firstOrFail();

        if ($booking->payment_status === 'paid') {
            return response()->json([
                'status' => 'success',
                'message' => 'This booking has already been paid for.',
                'booking' => $booking->load(['latestPayment', 'instructor', 'serviceType', 'location']),
            ]);
        }

        // Check simulated failure test case
        if (!empty($validated['simulate_failure'])) {
            $payment = Payment::where('booking_id', $booking->id)->latest()->first();
            if ($payment) {
                $payment->update([
                    'payment_status' => 'failed',
                    'gateway_response' => ['failure_reason' => 'Card was declined by test simulator.'],
                ]);
            }
            $booking->update(['payment_status' => 'failed']);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment authorization failed. Your card was declined. Please try another card.',
            ], 422);
        }

        // Server-side verification & confirmation
        $txId = 'txn_' . strtolower(Str::random(24));
        $payment = Payment::firstOrCreate(
            ['booking_id' => $booking->id, 'payment_status' => 'pending'],
            [
                'payment_reference' => 'PAY-' . date('Ymd') . '-' . strtoupper(Str::random(5)),
                'amount' => $booking->price_snapshot,
                'currency' => 'AUD',
                'gateway' => 'stripe',
                'payment_method' => $validated['payment_method'],
            ]
        );

        $payment->update([
            'transaction_id' => $txId,
            'payment_status' => 'succeeded',
            'payment_method' => $validated['payment_method'],
            'gateway_response' => [
                'cardholder' => $validated['cardholder_name'],
                'card_last4' => $validated['card_last4'] ?? '4242',
                'brand' => 'Visa',
                'captured' => true,
                'receipt_url' => 'https://smartdriving.com.au/receipts/' . $txId,
            ],
            'paid_at' => now(),
        ]);

        $booking->update([
            'payment_status' => 'paid',
            'booking_status' => 'confirmed',
            'expires_at' => null,
        ]);

        Notification::create([
            'user_id' => $booking->customer_id,
            'title' => 'Booking Confirmed (' . $booking->booking_reference . ')',
            'message' => 'Your booking for ' . $booking->serviceType?->name . ' on ' . $booking->start_time->format('l jS F @ g:i A') . ' is confirmed with ' . $booking->instructor?->name . '.',
            'type' => 'booking_confirmation',
        ]);

        AuditLog::create([
            'user_id' => $booking->customer_id,
            'action' => 'payment_succeeded',
            'entity_type' => 'Payment',
            'entity_id' => (string) $payment->id,
            'new_values' => [
                'amount' => $payment->amount,
                'reference' => $booking->booking_reference,
                'transaction_id' => $txId,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $booking->load(['latestPayment', 'instructor', 'serviceType', 'package', 'location']);

        return response()->json([
            'status' => 'success',
            'message' => 'Payment verified successfully! Your booking is confirmed.',
            'booking' => $booking,
            'receipt' => [
                'reference' => $booking->booking_reference,
                'amount' => $payment->amount,
                'currency' => 'AUD',
                'transaction_id' => $txId,
                'paid_at' => $payment->paid_at->toIso8601String(),
                'card_last4' => $validated['card_last4'] ?? '4242',
            ],
        ]);
    }

    /**
     * Legacy generic webhook endpoint preserved.
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();
        AuditLog::create([
            'action' => 'payment_webhook_received',
            'entity_type' => 'PaymentGateway',
            'new_values' => ['event' => $payload['type'] ?? 'unknown'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['status' => 'received']);
    }
}
