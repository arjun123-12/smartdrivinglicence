<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'business_name', 'value' => 'SmartDriving South Australia', 'group' => 'general', 'type' => 'string', 'description' => 'Business display name'],
            ['key' => 'business_abn', 'value' => '45 612 890 123', 'group' => 'general', 'type' => 'string', 'description' => 'Australian Business Number'],
            ['key' => 'business_phone', 'value' => '+61 412 345 678', 'group' => 'contact', 'type' => 'string', 'description' => 'Primary customer phone'],
            ['key' => 'business_email', 'value' => 'support@smartdriving.com.au', 'group' => 'contact', 'type' => 'string', 'description' => 'Support email address'],
            ['key' => 'business_address', 'value' => '120 King William Street, Adelaide SA 5000', 'group' => 'contact', 'type' => 'string', 'description' => 'Registered office location'],
            ['key' => 'booking_lead_time_hours', 'value' => '12', 'group' => 'booking', 'type' => 'integer', 'description' => 'Minimum hours before lesson can be booked'],
            ['key' => 'cancellation_cutoff_hours', 'value' => '24', 'group' => 'booking', 'type' => 'integer', 'description' => 'Hours before lesson for free cancellation'],
            ['key' => 'vort_notice_period_days', 'value' => '3', 'group' => 'booking', 'type' => 'integer', 'description' => 'Minimum business days notice required by SA Government for VORT'],
            ['key' => 'currency', 'value' => 'AUD', 'group' => 'payment', 'type' => 'string', 'description' => 'Billing currency code'],
            ['key' => 'payment_gateway', 'value' => 'stripe_mock', 'group' => 'payment', 'type' => 'string', 'description' => 'Payment gateway mode (stripe_mock / stripe)'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}

