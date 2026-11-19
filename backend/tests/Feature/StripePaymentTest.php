<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class StripePaymentTest extends TestCase
{
    /**
     * Test checkout session validation fails when required fields are missing.
     */
    public function test_checkout_session_validation_requires_fields(): void
    {
        $response = $this->postJson('/api/v1/payments/stripe/checkout-session', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'service_type_id',
                'instructor_id',
                'location_id',
                'start_time',
                'end_time',
                'pickup_address',
                'customer_name',
                'customer_email',
                'customer_phone',
            ]);
    }

    /**
     * Test webhook returns error 500 when webhook secret is unconfigured.
     */
    public function test_webhook_fails_gracefully_when_secret_not_configured(): void
    {
        Config::set('services.stripe.webhook_secret', null);

        $response = $this->postJson('/api/v1/webhooks/stripe', [
            'id' => 'evt_test_123',
            'type' => 'checkout.session.completed',
        ], [
            'Stripe-Signature' => 'test_sig',
        ]);

        $response->assertStatus(500)
            ->assertJson(['error' => 'Webhook secret not configured on server']);
    }

    /**
     * Test webhook rejects missing Stripe-Signature header.
     */
    public function test_webhook_rejects_missing_signature(): void
    {
        Config::set('services.stripe.webhook_secret', 'whsec_dummy_test_secret');

        $response = $this->postJson('/api/v1/webhooks/stripe', [
            'id' => 'evt_test_123',
            'type' => 'checkout.session.completed',
        ]);

        $response->assertStatus(400)
            ->assertJson(['error' => 'Missing Stripe-Signature header']);
    }

    /**
     * Test webhook rejects invalid Stripe signatures.
     */
    public function test_webhook_rejects_invalid_signature(): void
    {
        Config::set('services.stripe.webhook_secret', 'whsec_dummy_test_secret');

        $response = $this->postJson('/api/v1/webhooks/stripe', [
            'id' => 'evt_test_123',
            'type' => 'checkout.session.completed',
        ], [
            'Stripe-Signature' => 't=123456,v1=bad_signature_hex',
        ]);

        $response->assertStatus(400)
            ->assertJson(['error' => 'Invalid webhook signature']);
    }
}
