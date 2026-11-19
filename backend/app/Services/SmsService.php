<?php

namespace App\Services;

use App\Models\SmsOtp;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class SmsService
{
    /**
     * Normalize an Australian phone number to E.164 standard (+614XXXXXXXX).
     */
    public function normalizeAustralianPhone(?string $phone): string
    {
        if (empty($phone)) {
            throw ValidationException::withMessages([
                'phone' => ['Phone number is required.'],
            ]);
        }

        // Strip spaces, dashes, dots, brackets
        $cleaned = preg_replace('/[\s\-\(\)\.]/', '', trim($phone));

        // Format 1: 0412345678 (10 digits) -> +61412345678
        if (preg_match('/^04\d{8}$/', $cleaned)) {
            return '+61' . substr($cleaned, 1);
        }

        // Format 2: 412345678 (9 digits) -> +61412345678
        if (preg_match('/^4\d{8}$/', $cleaned)) {
            return '+61' . $cleaned;
        }

        // Format 3: 61412345678 (11 digits) -> +61412345678
        if (preg_match('/^614\d{8}$/', $cleaned)) {
            return '+' . $cleaned;
        }

        // Format 4: +61412345678 (12 chars) -> +61412345678
        if (preg_match('/^\+614\d{8}$/', $cleaned)) {
            return $cleaned;
        }

        throw ValidationException::withMessages([
            'phone' => ['Please enter a valid Australian mobile number (e.g. 0412 345 678 or +61 412 345 678).'],
        ]);
    }

    /**
     * Generate and dispatch a secure one-time SMS verification code with cooldown and expiry.
     */
    public function sendOtp(string $rawPhone, string $purpose = 'instructor_signup'): array
    {
        $phone = $this->normalizeAustralianPhone($rawPhone);

        // Check 60-second resend cooldown
        $recentOtp = SmsOtp::where('phone', $phone)
            ->where('purpose', $purpose)
            ->where('is_used', false)
            ->where('resend_after', '>', Carbon::now())
            ->orderBy('id', 'desc')
            ->first();

        if ($recentOtp) {
            $remaining = Carbon::now()->diffInSeconds($recentOtp->resend_after, false);
            if ($remaining > 0) {
                throw ValidationException::withMessages([
                    'phone' => ["Please wait {$remaining} seconds before requesting a new code."],
                ]);
            }
        }

        // Generate cryptographic 6-digit random code
        $code = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        // Invalidate older unused codes for this phone and purpose
        SmsOtp::where('phone', $phone)
            ->where('purpose', $purpose)
            ->where('is_used', false)
            ->delete();

        // Record new active OTP
        $otp = SmsOtp::create([
            'phone' => $phone,
            'otp_code' => $code,
            'purpose' => $purpose,
            'expires_at' => Carbon::now()->addMinutes(10),
            'attempts' => 0,
            'resend_after' => Carbon::now()->addSeconds(60),
            'is_used' => false,
        ]);

        // Dispatch SMS via configured provider (log / twilio)
        $this->dispatchSms($phone, $code, $purpose);

        return [
            'status' => 'success',
            'message' => "Verification code sent to {$phone}.",
            'phone' => $phone,
            'cooldown_seconds' => 60,
            'expires_in_seconds' => 600,
            'debug_otp' => (app()->environment('local', 'testing') || config('app.debug')) ? $code : null,
        ];
    }

    /**
     * Verify a submitted code with attempt tracking, single-use, and expiration.
     */
    public function verifyOtp(string $rawPhone, string $code, string $purpose = 'instructor_signup'): bool
    {
        $phone = $this->normalizeAustralianPhone($rawPhone);
        $cleanCode = trim($code);

        $otp = SmsOtp::where('phone', $phone)
            ->where('purpose', $purpose)
            ->orderBy('id', 'desc')
            ->first();

        if (!$otp || $otp->expires_at < Carbon::now()) {
            throw ValidationException::withMessages([
                'code' => ['The verification code has expired. Please request a new code.'],
            ]);
        }

        if ($otp->is_used || $otp->attempts >= 5) {
            $otp->update(['is_used' => true]);
            throw ValidationException::withMessages([
                'code' => ['Maximum incorrect attempts exceeded. Please request a new verification code.'],
            ]);
        }

        if ($otp->otp_code !== $cleanCode) {
            $otp->increment('attempts');
            $remaining = 5 - $otp->attempts;

            if ($remaining <= 0) {
                $otp->update(['is_used' => true]);
                throw ValidationException::withMessages([
                    'code' => ['Maximum incorrect attempts exceeded. Please request a new verification code.'],
                ]);
            }

            throw ValidationException::withMessages([
                'code' => ["Incorrect verification code. {$remaining} attempts remaining."],
            ]);
        }

        // Code matches: invalidate immediately for single-use security
        $otp->update(['is_used' => true]);

        return true;
    }

    /**
     * Dispatch SMS message via configured provider driver.
     */
    protected function dispatchSms(string $phone, string $code, string $purpose): void
    {
        $driver = config('services.sms.driver') ?: env('SMS_DRIVER', 'log');
        $message = "Your A1 Smart Driving verification code is: {$code}. Valid for 10 minutes.";

        Log::info("[SMS OTP Service] [Driver: {$driver}] Sent code to {$phone} for {$purpose}: {$code}");

        if ($driver === 'twilio') {
            $sid = config('services.sms.twilio.sid') ?: env('TWILIO_SID');
            $token = config('services.sms.twilio.token') ?: env('TWILIO_AUTH_TOKEN');
            $from = config('services.sms.twilio.from') ?: env('TWILIO_FROM');

            if (!empty($sid) && !empty($token) && !empty($from)) {
                try {
                    $url = "https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json";
                    Http::withBasicAuth($sid, $token)->asForm()->post($url, [
                        'From' => $from,
                        'To' => $phone,
                        'Body' => $message,
                    ]);
                } catch (Exception $e) {
                    Log::error('[Twilio SMS Dispatch Error] ' . $e->getMessage());
                }
            }
        }
    }
}
