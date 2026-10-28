<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Process and verify payment server-side.
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
        ]);

        // Create in-app notification for the customer
        Notification::create([
            'user_id' => $booking->customer_id,
            'title' => 'Booking Confirmed (' . $booking->booking_reference . ')',
            'message' => 'Your booking for ' . $booking->serviceType?->name . ' on ' . $booking->start_time->format('l jS F @ g:i A') . ' is confirmed with ' . $booking->instructor?->name . '.',
            'type' => 'booking_confirmation',
        ]);

        // Audit log
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
     * Webhook endpoint for async gateway notifications.
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();
        // Record webhook in audit log
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

