<?php

namespace App\Services;

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
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripePaymentService
{
    protected ?StripeClient $stripe = null;
    protected ?string $secretKey;
    protected ?string $webhookSecret;

    public function __construct()
    {
        $this->secretKey = config('services.stripe.secret') ?: env('STRIPE_SECRET');
        $this->webhookSecret = config('services.stripe.webhook_secret') ?: env('STRIPE_WEBHOOK_SECRET');

        if (!empty($this->secretKey)) {
            $this->stripe = new StripeClient($this->secretKey);
        }
    }

    /**
     * Get initialized StripeClient or throw clear exception.
     */
    public function getClient(): StripeClient
    {
        if (!$this->stripe) {
            throw new Exception('Stripe secret key is not configured. Please set STRIPE_SECRET in your backend/.env with your Stripe Sandbox key (sk_test_...).');
        }

        return $this->stripe;
    }

    /**
     * Atomically hold slot, create/reuse pending booking, and create/reuse Stripe Checkout Session.
     */
    public function createOrReuseCheckoutSession(array $validated, ?User $authenticatedUser = null, ?string $clientIp = null, ?string $userAgent = null): array
    {
        $client = $this->getClient();

        $startTime = Carbon::parse($validated['start_time'], 'Australia/Adelaide');
        $endTime = Carbon::parse($validated['end_time'], 'Australia/Adelaide');

        // Check if reusing an existing pending booking passed by reference
        if (!empty($validated['booking_reference'])) {
            $existingBooking = Booking::where('booking_reference', $validated['booking_reference'])->firstOrFail();
            return $this->resumeBookingSession($existingBooking, $authenticatedUser);
        }

        // 1. Transaction to atomically reserve slot and calculate server-side price
        $booking = DB::transaction(function () use ($validated, $startTime, $endTime, $authenticatedUser, $clientIp, $userAgent) {
            // Check double-booking conflicts (active or unexpired pending holds)
            $conflictingBooking = Booking::where('instructor_id', $validated['instructor_id'])
                ->where(function ($q) {
                    $q->whereIn('booking_status', ['confirmed', 'in_progress'])
                      ->orWhere(function ($pendingQ) {
                          $pendingQ->where('booking_status', 'pending')
                                   ->where(function ($expQ) {
                                       $expQ->whereNull('expires_at')
                                            ->orWhere('expires_at', '>', Carbon::now('Australia/Adelaide'));
                                   });
                      });
                })
                ->where(function ($query) use ($startTime, $endTime) {
                    $query->where('start_time', '<', $endTime)
                          ->where('end_time', '>', $startTime);
                })
                ->lockForUpdate()
                ->first();

            if ($conflictingBooking) {
                abort(422, 'The selected appointment slot has just been reserved by another customer. Please choose another time slot.');
            }

            // Resolve customer user
            $user = $authenticatedUser;
            if (!$user) {
                $user = User::firstOrCreate(
                    ['email' => $validated['customer_email']],
                    [
                        'name' => $validated['customer_name'],
                        'phone' => $validated['customer_phone'] ?? null,
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
                        'address' => $validated['pickup_address'] ?? null,
                    ]
                );
            }

            // Calculate price strictly from server-side database models
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

            // Reference and booking creation (default 30 min hold before Stripe session response)
            $reference = 'SMD-' . date('Ymd') . '-' . strtoupper(Str::random(4));
            $initialExpiry = Carbon::now('Australia/Adelaide')->addMinutes(30);

            $newBooking = Booking::create([
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
                'expires_at' => $initialExpiry,
                'pickup_address' => $validated['pickup_address'] ?? 'Customer Address',
                'notes' => $validated['notes'] ?? null,
            ]);

            BookingItem::create([
                'booking_id' => $newBooking->id,
                'item_type' => $itemType,
                'description' => $itemDesc,
                'quantity' => 1,
                'unit_price' => $finalPrice,
                'total_price' => $finalPrice,
            ]);

            return $newBooking;
        });

        // 2. Create Stripe Checkout Session with error handling so no slot remains stranded
        try {
            $paymentRef = 'PAY-' . date('Ymd') . '-' . strtoupper(Str::random(5));
            $idempotencyKey = 'stripe_checkout_' . $booking->id . '_' . $booking->booking_reference;

            $frontendUrl = rtrim(config('app.frontend_url') ?: env('FRONTEND_URL', 'http://localhost:5173'), '/');
            $successUrl = "{$frontendUrl}/booking/confirmed?session_id={CHECKOUT_SESSION_ID}&reference={$booking->booking_reference}";
            $cancelUrl = "{$frontendUrl}/booking/cancelled?session_id={CHECKOUT_SESSION_ID}&reference={$booking->booking_reference}";

            $amountInCents = (int) round($booking->price_snapshot * 100);
            $serviceName = $booking->serviceType?->name ?? 'Driving Lesson';
            $instructorName = $booking->instructor?->name ?? 'Accredited Instructor';
            $sessionExpiresAt = Carbon::now('Australia/Adelaide')->addMinutes(30)->timestamp;

            $session = $client->checkout->sessions->create([
                'mode' => 'payment',
                'client_reference_id' => $booking->booking_reference,
                'customer_email' => $booking->customer?->email,
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => 'aud',
                            'product_data' => [
                                'name' => "A1 Smart Driving: {$serviceName}",
                                'description' => "Booking Ref: {$booking->booking_reference} | Instructor: {$instructorName} | Date: " . $booking->start_time->format('d/m/Y g:i A'),
                            ],
                            'unit_amount' => $amountInCents,
                        ],
                        'quantity' => 1,
                    ],
                ],
                'metadata' => [
                    'booking_id' => (string) $booking->id,
                    'booking_reference' => $booking->booking_reference,
                    'customer_id' => (string) $booking->customer_id,
                    'amount_cents' => (string) $amountInCents,
                    'currency' => 'AUD',
                ],
                'expires_at' => $sessionExpiresAt,
                'success_url' => $successUrl,
                'cancel_url' => $cancelUrl,
            ], [
                'idempotency_key' => $idempotencyKey,
            ]);

            // Synchronize hold expiry with Stripe session expiry
            $booking->update([
                'expires_at' => Carbon::createFromTimestamp($session->expires_at, 'Australia/Adelaide'),
            ]);

            // Save session ID and payment record
            Payment::create([
                'booking_id' => $booking->id,
                'payment_reference' => $paymentRef,
                'gateway' => 'stripe',
                'transaction_id' => $session->id,
                'stripe_session_id' => $session->id,
                'idempotency_key' => $idempotencyKey,
                'amount' => $booking->price_snapshot,
                'currency' => 'AUD',
                'payment_status' => 'pending',
                'payment_method' => 'card',
                'gateway_response' => [
                    'checkout_url' => $session->url,
                    'session_id' => $session->id,
                    'expires_at' => $session->expires_at,
                ],
            ]);

            AuditLog::create([
                'user_id' => $booking->customer_id,
                'action' => 'stripe_checkout_created',
                'entity_type' => 'Booking',
                'entity_id' => (string) $booking->id,
                'new_values' => [
                    'reference' => $booking->booking_reference,
                    'stripe_session_id' => $session->id,
                    'amount' => $booking->price_snapshot,
                ],
                'ip_address' => $clientIp,
                'user_agent' => $userAgent,
            ]);

            return [
                'status' => 'success',
                'checkout_url' => $session->url,
                'session_id' => $session->id,
                'booking_reference' => $booking->booking_reference,
                'expires_at' => $booking->expires_at?->toIso8601String(),
            ];
        } catch (Exception $e) {
            // Session creation failed - release the slot immediately so no stranded slot is left
            $booking->update([
                'booking_status' => 'cancelled',
                'payment_status' => 'failed',
                'cancellation_reason' => 'Stripe session creation failed: ' . $e->getMessage(),
                'expires_at' => now(),
            ]);

            Log::error('Stripe Checkout Session Creation Error: ' . $e->getMessage(), [
                'booking_id' => $booking->id,
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    /**
     * Resume an existing pending booking Checkout Session or create a new active one.
     */
    public function resumeBookingSession(Booking $booking, ?User $authenticatedUser = null): array
    {
        $client = $this->getClient();

        // Customer access authorization
        if ($authenticatedUser && !$authenticatedUser->isAdmin() && $booking->customer_id !== $authenticatedUser->id) {
            abort(403, 'Unauthorized access to this booking.');
        }

        if ($booking->payment_status === 'paid' || $booking->booking_status === 'confirmed') {
            return [
                'status' => 'already_paid',
                'message' => 'This booking has already been paid for and confirmed.',
                'booking_reference' => $booking->booking_reference,
            ];
        }

        // Check if current slot has expired
        if ($booking->expires_at && $booking->expires_at->isPast()) {
            $booking->update([
                'booking_status' => 'cancelled',
                'payment_status' => 'failed',
                'cancellation_reason' => 'Checkout session expired unpaid.',
            ]);
            abort(422, 'The reservation for this slot has expired. Please select a fresh appointment slot.');
        }

        // Check latest payment record
        $latestPayment = Payment::where('booking_id', $booking->id)->latest()->first();
        if ($latestPayment && !empty($latestPayment->stripe_session_id)) {
            try {
                $session = $client->checkout->sessions->retrieve($latestPayment->stripe_session_id);
                if ($session && $session->status === 'open' && !empty($session->url)) {
                    return [
                        'status' => 'success',
                        'checkout_url' => $session->url,
                        'session_id' => $session->id,
                        'booking_reference' => $booking->booking_reference,
                        'expires_at' => $booking->expires_at?->toIso8601String(),
                    ];
                }
            } catch (Exception $e) {
                Log::warning('Failed retrieving existing Stripe session for resume: ' . $e->getMessage());
            }
        }

        // If previous session is closed/expired but booking hold is still within allowable window, create fresh session
        $amountInCents = (int) round($booking->price_snapshot * 100);
        $serviceName = $booking->serviceType?->name ?? 'Driving Lesson';
        $instructorName = $booking->instructor?->name ?? 'Accredited Instructor';
        $frontendUrl = rtrim(config('app.frontend_url') ?: env('FRONTEND_URL', 'http://localhost:5173'), '/');

        $sessionExpiresAt = Carbon::now('Australia/Adelaide')->addMinutes(30)->timestamp;
        $idempotencyKey = 'stripe_resume_' . $booking->id . '_' . time();

        $session = $client->checkout->sessions->create([
            'mode' => 'payment',
            'client_reference_id' => $booking->booking_reference,
            'customer_email' => $booking->customer?->email,
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'aud',
                        'product_data' => [
                            'name' => "A1 Smart Driving: {$serviceName}",
                            'description' => "Booking Ref: {$booking->booking_reference} | Instructor: {$instructorName}",
                        ],
                        'unit_amount' => $amountInCents,
                    ],
                    'quantity' => 1,
                ],
            ],
            'metadata' => [
                'booking_id' => (string) $booking->id,
                'booking_reference' => $booking->booking_reference,
                'customer_id' => (string) $booking->customer_id,
                'amount_cents' => (string) $amountInCents,
                'currency' => 'AUD',
            ],
            'expires_at' => $sessionExpiresAt,
            'success_url' => "{$frontendUrl}/booking/confirmed?session_id={CHECKOUT_SESSION_ID}&reference={$booking->booking_reference}",
            'cancel_url' => "{$frontendUrl}/booking/cancelled?session_id={CHECKOUT_SESSION_ID}&reference={$booking->booking_reference}",
        ], [
            'idempotency_key' => $idempotencyKey,
        ]);

        $booking->update([
            'expires_at' => Carbon::createFromTimestamp($session->expires_at, 'Australia/Adelaide'),
        ]);

        Payment::create([
            'booking_id' => $booking->id,
            'payment_reference' => 'PAY-' . date('Ymd') . '-' . strtoupper(Str::random(5)),
            'gateway' => 'stripe',
            'transaction_id' => $session->id,
            'stripe_session_id' => $session->id,
            'idempotency_key' => $idempotencyKey,
            'amount' => $booking->price_snapshot,
            'currency' => 'AUD',
            'payment_status' => 'pending',
            'payment_method' => 'card',
            'gateway_response' => [
                'checkout_url' => $session->url,
                'session_id' => $session->id,
                'expires_at' => $session->expires_at,
            ],
        ]);

        return [
            'status' => 'success',
            'checkout_url' => $session->url,
            'session_id' => $session->id,
            'booking_reference' => $booking->booking_reference,
            'expires_at' => $booking->expires_at?->toIso8601String(),
        ];
    }

    /**
     * Handle incoming Stripe webhook with signature verification and atomic confirmation.
     */
    public function handleWebhook(string $payload, ?string $sigHeader): JsonResponse
    {
        if (empty($this->webhookSecret)) {
            Log::error('Stripe webhook received but STRIPE_WEBHOOK_SECRET is not configured in backend.');
            return response()->json(['error' => 'Webhook secret not configured on server'], 500);
        }

        if (empty($sigHeader)) {
            return response()->json(['error' => 'Missing Stripe-Signature header'], 400);
        }

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $this->webhookSecret);
        } catch (Exception $e) {
            Log::warning('Stripe webhook signature verification failed: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid webhook signature'], 400);
        }

        // Log received event
        AuditLog::create([
            'action' => 'stripe_webhook_received',
            'entity_type' => 'StripeWebhook',
            'new_values' => [
                'event_type' => $event->type,
                'event_id' => $event->id,
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        // Process supported events
        switch ($event->type) {
            case 'checkout.session.completed':
                return $this->handleCheckoutSessionCompleted($event->data->object);

            case 'checkout.session.expired':
                return $this->handleCheckoutSessionExpired($event->data->object);

            default:
                return response()->json(['status' => 'ignored', 'event' => $event->type]);
        }
    }

    /**
     * Confirm booking on verified checkout.session.completed event.
     */
    protected function handleCheckoutSessionCompleted(object $session): JsonResponse
    {
        $sessionId = $session->id ?? null;
        if (!$sessionId) {
            return response()->json(['error' => 'Session ID missing in payload'], 400);
        }

        // Locate payment attempt by saved stripe_session_id
        $payment = Payment::where('stripe_session_id', $sessionId)
            ->orWhere('transaction_id', $sessionId)
            ->first();

        if (!$payment) {
            Log::warning("Stripe webhook: No local payment attempt found for session ID: {$sessionId}");
            return response()->json(['error' => 'Payment attempt not found'], 404);
        }

        // Verify currency, payment_status=paid, and amount match
        $stripeCurrency = strtolower($session->currency ?? '');
        $stripePaymentStatus = $session->payment_status ?? '';
        $stripeAmountTotal = (int) ($session->amount_total ?? 0);
        $expectedAmountInCents = (int) round($payment->amount * 100);

        if ($stripeCurrency !== 'aud') {
            Log::error("Stripe webhook mismatch: Currency {$stripeCurrency} does not match expected AUD for session {$sessionId}");
            return response()->json(['error' => 'Currency mismatch'], 422);
        }

        if ($stripePaymentStatus !== 'paid') {
            Log::info("Stripe webhook: Session {$sessionId} payment_status is '{$stripePaymentStatus}', not paid yet.");
            return response()->json(['status' => 'pending_payment']);
        }

        if ($stripeAmountTotal !== $expectedAmountInCents) {
            Log::error("Stripe webhook mismatch: Amount {$stripeAmountTotal} cents does not match expected {$expectedAmountInCents} cents for session {$sessionId}");
            return response()->json(['error' => 'Amount mismatch'], 422);
        }

        // Execute payment and booking update in ONE database transaction
        $result = DB::transaction(function () use ($payment, $session, $sessionId) {
            $booking = Booking::where('id', $payment->booking_id)->lockForUpdate()->first();
            if (!$booking) {
                return ['status' => 'error', 'message' => 'Associated booking not found'];
            }

            // Check if already paid (idempotency: avoid duplicate confirmations or reverting)
            if ($booking->payment_status === 'paid' && $booking->booking_status === 'confirmed') {
                return ['status' => 'already_confirmed'];
            }

            $txId = $session->payment_intent ?: $sessionId;

            // Update payment record
            $payment->update([
                'payment_status' => 'succeeded',
                'transaction_id' => $txId,
                'paid_at' => now(),
                'gateway_response' => array_merge($payment->gateway_response ?: [], [
                    'stripe_payment_intent' => $session->payment_intent ?? null,
                    'payment_status' => 'paid',
                    'customer_details' => (array) ($session->customer_details ?? []),
                    'amount_received_cents' => $session->amount_total ?? null,
                ]),
            ]);

            // Confirm booking and release hold expiry
            $booking->update([
                'booking_status' => 'confirmed',
                'payment_status' => 'paid',
                'expires_at' => null, // Slot permanently locked
            ]);

            // In-app customer notification
            Notification::create([
                'user_id' => $booking->customer_id,
                'title' => "Booking Confirmed ({$booking->booking_reference})",
                'message' => "Payment verified. Your booking for " . ($booking->serviceType?->name ?? 'Driving Lesson') . " on " . $booking->start_time->format('l jS F @ g:i A') . " is confirmed with " . ($booking->instructor?->name ?? 'your instructor') . ".",
                'type' => 'booking_confirmation',
            ]);

            // Audit log
            AuditLog::create([
                'user_id' => $booking->customer_id,
                'action' => 'stripe_payment_confirmed',
                'entity_type' => 'Booking',
                'entity_id' => (string) $booking->id,
                'new_values' => [
                    'reference' => $booking->booking_reference,
                    'transaction_id' => $txId,
                    'amount' => $payment->amount,
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return ['status' => 'confirmed'];
        });

        return response()->json($result);
    }

    /**
     * Handle checkout.session.expired: release slot if unpaid.
     */
    protected function handleCheckoutSessionExpired(object $session): JsonResponse
    {
        $sessionId = $session->id ?? null;
        if (!$sessionId) {
            return response()->json(['error' => 'Missing session id'], 400);
        }

        $payment = Payment::where('stripe_session_id', $sessionId)
            ->orWhere('transaction_id', $sessionId)
            ->first();

        if ($payment) {
            DB::transaction(function () use ($payment) {
                $booking = Booking::where('id', $payment->booking_id)->lockForUpdate()->first();
                if ($booking && $booking->payment_status !== 'paid') {
                    $booking->update([
                        'booking_status' => 'cancelled',
                        'payment_status' => 'failed',
                        'cancellation_reason' => 'Stripe Checkout Session expired unpaid.',
                    ]);
                    $payment->update([
                        'payment_status' => 'expired',
                    ]);
                }
            });
        }

        return response()->json(['status' => 'session_expired_handled']);
    }
}
