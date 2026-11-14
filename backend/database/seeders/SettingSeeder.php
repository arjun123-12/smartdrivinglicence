<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'business_name', 'value' => 'A1 Smart Driving', 'group' => 'general', 'type' => 'string', 'description' => 'Business display name'],
            ['key' => 'business_legal_name', 'value' => 'MB & HB GROUP PTY LTD', 'group' => 'general', 'type' => 'string', 'description' => 'Registered legal entity'],
            ['key' => 'business_abn', 'value' => '92 662 509 720', 'group' => 'general', 'type' => 'string', 'description' => 'Australian Business Number (ABN)'],
            ['key' => 'business_phone', 'value' => '0430 580 111', 'group' => 'contact', 'type' => 'string', 'description' => 'Primary customer phone'],
            ['key' => 'business_email', 'value' => 'enquiries@a1smartdriving.com.au', 'group' => 'contact', 'type' => 'string', 'description' => 'Support email address'],
            ['key' => 'business_address', 'value' => 'Adelaide, South Australia', 'group' => 'contact', 'type' => 'string', 'description' => 'Registered office location'],
            ['key' => 'booking_lead_time_hours', 'value' => '12', 'group' => 'booking', 'type' => 'integer', 'description' => 'Minimum hours before lesson can be booked'],
            ['key' => 'cancellation_cutoff_hours', 'value' => '24', 'group' => 'booking', 'type' => 'integer', 'description' => 'Hours before lesson for free cancellation'],
            ['key' => 'vort_notice_period_days', 'value' => '3', 'group' => 'booking', 'type' => 'integer', 'description' => 'Minimum business days notice required by SA Government for VORT'],
            ['key' => 'currency', 'value' => 'AUD', 'group' => 'payment', 'type' => 'string', 'description' => 'Billing currency code'],
            ['key' => 'payment_gateway', 'value' => 'stripe_mock', 'group' => 'payment', 'type' => 'string', 'description' => 'Payment gateway mode (stripe_mock / stripe)'],
            ['key' => 'hero_search_title', 'value' => 'Find Your Driving Service', 'group' => 'hero', 'type' => 'string', 'description' => 'Hero search box heading'],
            ['key' => 'hero_search_subtitle', 'value' => 'Choose your location and service to get started.', 'group' => 'hero', 'type' => 'string', 'description' => 'Hero search box subheading'],
            ['key' => 'hero_search_location_label', 'value' => 'Your suburb or test centre', 'group' => 'hero', 'type' => 'string', 'description' => 'Location dropdown field label'],
            ['key' => 'hero_search_service_label', 'value' => 'Service required', 'group' => 'hero', 'type' => 'string', 'description' => 'Service dropdown field label'],
            ['key' => 'hero_search_button_text', 'value' => 'Find Available Slots', 'group' => 'hero', 'type' => 'string', 'description' => 'Search button call to action text'],
            ['key' => 'hero_search_note', 'value' => 'Easy online booking for your next driving step', 'group' => 'hero', 'type' => 'string', 'description' => 'Security/trust note under search button'],
            ['key' => 'hero_search_enabled', 'value' => '1', 'group' => 'hero', 'type' => 'boolean', 'description' => 'Show or hide the hero search card'],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['key' => $setting['key']],
                array_merge($setting, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}

