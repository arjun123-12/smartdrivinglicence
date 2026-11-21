<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DevelopmentModeTest extends TestCase
{
    use DatabaseTransactions;

    protected User $adminUser;
    protected User $testerUser;
    protected User $customerUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::firstOrCreate(
            ['email' => 'admin_devtest@smartdriving.com.au'],
            [
                'name' => 'Admin Dev Tester',
                'password' => Hash::make('Password123!'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        $this->testerUser = User::firstOrCreate(
            ['email' => 'tester_devtest@smartdriving.com.au'],
            [
                'name' => 'QA Dev Tester',
                'password' => Hash::make('Password123!'),
                'role' => 'customer',
                'is_active' => true,
            ]
        );

        $this->customerUser = User::firstOrCreate(
            ['email' => 'customer_devtest@smartdriving.com.au'],
            [
                'name' => 'Standard Customer',
                'password' => Hash::make('Password123!'),
                'role' => 'customer',
                'is_active' => true,
            ]
        );

        // Configure tester emails
        Config::set('services.site.tester_emails', [
            'tester_devtest@smartdriving.com.au',
            'tester@smartdriving.com.au',
        ]);
    }

    /**
     * Test site status reflects current development mode setting.
     */
    public function test_site_status_endpoint_returns_development_mode_state(): void
    {
        Config::set('services.site.development_mode', false);
        $res = $this->getJson('/api/v1/site/status');
        $res->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'development_mode' => false,
                'preview_allowed' => false,
            ]);

        Config::set('services.site.development_mode', true);
        $resDev = $this->getJson('/api/v1/site/status');
        $resDev->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'development_mode' => true,
                'preview_allowed' => false,
            ]);
    }

    /**
     * Test all routes accessible when development mode is disabled.
     */
    public function test_when_development_mode_disabled_routes_are_accessible(): void
    {
        Config::set('services.site.development_mode', false);

        // Public routes accessible
        $this->getJson('/api/v1/services')->assertStatus(200);

        // Direct booking route hits controller validation rather than 403 dev barrier
        $response = $this->postJson('/api/v1/bookings/calculate-price', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['service_type_id', 'instructor_id']);
    }

    /**
     * Test unauthenticated visitors to restricted routes are blocked in development mode.
     */
    public function test_when_development_mode_enabled_unauthenticated_requests_are_blocked(): void
    {
        Config::set('services.site.development_mode', true);

        // Direct booking calculation blocked
        $res1 = $this->postJson('/api/v1/bookings/calculate-price', []);
        $res1->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'code' => 'SITE_UNDER_DEVELOPMENT',
            ]);

        // Direct booking creation blocked
        $res2 = $this->postJson('/api/v1/bookings', []);
        $res2->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'code' => 'SITE_UNDER_DEVELOPMENT',
            ]);

        // Stripe checkout session creation blocked
        $res3 = $this->postJson('/api/v1/payments/stripe/checkout-session', []);
        $res3->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'code' => 'SITE_UNDER_DEVELOPMENT',
            ]);
    }

    /**
     * Test whitelisted routes remain accessible without auth in development mode.
     */
    public function test_whitelisted_routes_remain_accessible_in_development_mode(): void
    {
        Config::set('services.site.development_mode', true);

        // Site status accessible
        $this->getJson('/api/v1/site/status')->assertStatus(200);

        // Public settings accessible
        $this->getJson('/api/v1/settings/public')->assertStatus(200);

        // Login endpoint accessible (returns 422 for missing credentials, not 403)
        $this->postJson('/api/v1/auth/login', [])->assertStatus(422);

        // Stripe Webhook callback MUST remain reachable and verify signature
        Config::set('services.stripe.webhook_secret', 'whsec_test_secret');
        $webhookRes = $this->postJson('/api/v1/webhooks/stripe', ['id' => 'evt_test_123']);
        $webhookRes->assertStatus(400)
            ->assertJson(['error' => 'Missing Stripe-Signature header']);
    }

    /**
     * Test authorized Admin and Tester can access restricted routes in development mode.
     */
    public function test_admin_and_authorized_tester_can_access_restricted_routes_in_dev_mode(): void
    {
        Config::set('services.site.development_mode', true);

        // Admin passes development check and reaches controller validation (422)
        $adminRes = $this->actingAs($this->adminUser, 'sanctum')
            ->postJson('/api/v1/bookings/calculate-price', []);
        $adminRes->assertStatus(422)
            ->assertJsonValidationErrors(['service_type_id', 'instructor_id']);

        // Tester passes development check and reaches controller validation (422)
        $testerRes = $this->actingAs($this->testerUser, 'sanctum')
            ->postJson('/api/v1/bookings/calculate-price', []);
        $testerRes->assertStatus(422)
            ->assertJsonValidationErrors(['service_type_id', 'instructor_id']);
    }

    /**
     * Test regular customer user is blocked from restricted routes in development mode.
     */
    public function test_regular_customer_is_blocked_from_restricted_routes_in_dev_mode(): void
    {
        Config::set('services.site.development_mode', true);

        $customerRes = $this->actingAs($this->customerUser, 'sanctum')
            ->postJson('/api/v1/bookings/calculate-price', []);

        $customerRes->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'code' => 'SITE_UNDER_DEVELOPMENT',
            ]);
    }

    /**
     * Test secure preview login rejects customer and admits admin/tester.
     */
    public function test_secure_login_with_require_preview(): void
    {
        Config::set('services.site.development_mode', true);

        // Regular customer trying to preview -> 403
        $rejectRes = $this->postJson('/api/v1/auth/login', [
            'email' => $this->customerUser->email,
            'password' => 'Password123!',
            'require_preview' => true,
        ]);
        $rejectRes->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'Access denied: Only administrators and explicitly authorized testers have preview access during development mode.',
            ]);

        // Tester trying to preview -> 200 with token and can_preview true
        $testerRes = $this->postJson('/api/v1/auth/login', [
            'email' => $this->testerUser->email,
            'password' => 'Password123!',
            'require_preview' => true,
        ]);
        $testerRes->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'can_preview' => true,
            ]);

        // Admin trying to preview -> 200 with token and can_preview true
        $adminRes = $this->postJson('/api/v1/auth/login', [
            'email' => $this->adminUser->email,
            'password' => 'Password123!',
            'require_preview' => true,
        ]);
        $adminRes->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'can_preview' => true,
            ]);
    }
}
