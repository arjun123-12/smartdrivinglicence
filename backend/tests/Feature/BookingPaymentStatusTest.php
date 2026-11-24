<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Instructor;
use App\Models\Payment;
use App\Models\ServiceType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class BookingPaymentStatusTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Test payment-status API returns verified amount, instructor, and sanitized payment data without leaking secrets.
     */
    public function test_payment_status_returns_verified_amount_and_sanitized_details(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $instructorUser = User::factory()->create(['name' => 'Sarah Connor']);
        $instructor = Instructor::create([
            'user_id' => $instructorUser->id,
            'name' => 'Sarah Connor',
            'email' => 'sarah.connor@test.com',
            'phone' => '+61 400 111 222',
            'is_active' => true,
            'verification_status' => 'verified',
            'base_hourly_rate' => 85.00,
            'vort_test_rate' => 240.00,
        ]);
        $service = ServiceType::first() ?? ServiceType::create([
            'name' => 'Standard Driving Lesson',
            'slug' => 'standard-lesson',
            'default_price' => 85.00,
            'is_test' => false,
        ]);

        $booking = Booking::create([
            'booking_reference' => 'SMD-TEST-VERIFIED-01',
            'customer_id' => $customer->id,
            'instructor_id' => $instructor->id,
            'service_type_id' => $service->id,
            'location_id' => 1,
            'start_time' => Carbon::parse('2026-11-25 09:30:00', 'Australia/Adelaide'),
            'end_time' => Carbon::parse('2026-11-25 10:30:00', 'Australia/Adelaide'),
            'timezone' => 'Australia/Adelaide',
            'booking_status' => 'confirmed',
            'payment_status' => 'paid',
            'price_snapshot' => '240.00',
            'currency' => 'AUD',
            'pickup_address' => '42 King William St, Adelaide',
        ]);

        $sessionId = 'cs_test_mock_verified_session';
        Payment::create([
            'booking_id' => $booking->id,
            'payment_reference' => 'PAY-TEST-001',
            'gateway' => 'stripe',
            'transaction_id' => 'ch_test_mock_charge',
            'stripe_session_id' => $sessionId,
            'idempotency_key' => 'idemp_test_secret_123',
            'amount' => '240.00',
            'currency' => 'AUD',
            'payment_status' => 'succeeded',
            'payment_method' => 'card',
            'gateway_response' => [
                'checkout_url' => 'https://checkout.stripe.com/pay/cs_test_secret_url',
                'raw_secret_data' => 'secret_internal_value',
            ],
            'paid_at' => Carbon::now('Australia/Adelaide'),
        ]);

        // Request with matching session_id
        $response = $this->getJson("/api/v1/bookings/{$booking->booking_reference}/payment-status?session_id={$sessionId}");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'booking_reference' => 'SMD-TEST-VERIFIED-01',
                'booking_status' => 'confirmed',
                'payment_status' => 'paid',
                'is_paid' => true,
                'amount' => '240.00',
                'paid_amount' => '240.00',
                'price_snapshot' => '240.00',
                'instructor_name' => 'Sarah Connor',
                'instructor' => [
                    'id' => $instructor->id,
                    'name' => 'Sarah Connor',
                ],
                'display_date' => 'Wed, 25 Nov 2026',
                'display_time' => '9:30 AM - 10:30 AM',
                'timezone' => 'Australia/Adelaide',
            ]);

        // Ensure internal secrets and Stripe checkout URLs are NOT exposed
        $data = $response->json();
        $this->assertArrayNotHasKey('checkout_url', $data);
        $this->assertArrayNotHasKey('gateway_response', $data);
        if (isset($data['latest_payment'])) {
            $this->assertArrayNotHasKey('checkout_url', $data['latest_payment']);
            $this->assertArrayNotHasKey('gateway_response', $data['latest_payment']);
            $this->assertArrayNotHasKey('idempotency_key', $data['latest_payment']);
            $this->assertEquals('240.00', $data['latest_payment']['amount']);
            $this->assertEquals('succeeded', $data['latest_payment']['payment_status']);
        }
    }
}
