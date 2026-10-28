<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Payment;
use App\Models\Refund;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminPaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Payment::with(['booking.customer', 'booking.serviceType', 'refunds']);

        if ($request->filled('status')) {
            $query->where('payment_status', $request->input('status'));
        }

        $payments = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $payments,
        ]);
    }

    public function refund(Request $request, int $id): JsonResponse
    {
        $payment = Payment::with('booking')->findOrFail($id);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1|max:' . $payment->amount,
            'reason' => 'required|string|max:255',
        ]);

        $refundRef = 'REF-' . date('Ymd') . '-' . strtoupper(Str::random(5));

        $refund = Refund::create([
            'payment_id' => $payment->id,
            'booking_id' => $payment->booking_id,
            'refund_reference' => $refundRef,
            'amount' => $validated['amount'],
            'currency' => $payment->currency,
            'reason' => $validated['reason'],
            'refund_status' => 'processed',
            'gateway_refund_id' => 're_' . strtolower(Str::random(24)),
            'processed_at' => now(),
            'processed_by' => $request->user()->id,
        ]);

        if ((float) $validated['amount'] >= (float) $payment->amount) {
            $payment->update(['payment_status' => 'refunded']);
            $payment->booking?->update(['payment_status' => 'refunded', 'booking_status' => 'cancelled']);
        } else {
            $payment->update(['payment_status' => 'partially_refunded']);
        }

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'admin_processed_refund',
            'entity_type' => 'Refund',
            'entity_id' => (string) $refund->id,
            'new_values' => ['amount' => $validated['amount'], 'reason' => $validated['reason']],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Refund processed successfully.',
            'data' => $refund,
        ]);
    }
}

