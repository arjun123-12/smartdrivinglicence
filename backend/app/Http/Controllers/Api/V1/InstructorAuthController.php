<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Instructor;
use App\Models\User;
use App\Services\SmsService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InstructorAuthController extends Controller
{
    /**
     * Mobile-friendly instructor registration with document uploads.
     */
    public function signup(Request $request, SmsService $smsService): JsonResponse
    {
        $validated = $request->validate([
            // Account
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email|unique:instructors,email',
            'phone' => 'required|string|max:30',
            'password' => 'required|string|min:8|confirmed',

            // Profile
            'experience_years' => 'required|integer|min:0|max:50',
            'languages' => 'required',
            'bio' => 'required|string|min:20|max:3000',
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

            // Vehicle
            'car_make' => 'required|string|max:100',
            'car_model' => 'required|string|max:100',
            'car_year' => 'required|integer|min:2010|max:' . (date('Y') + 1),
            'car_transmission' => 'required|in:auto',
            'car_rego' => 'required|string|max:20',

            // Required Accreditation Documents
            'doc_wwcc' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'doc_licence' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'doc_permit' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $normalizedPhone = $smsService->normalizeAustralianPhone($validated['phone']);

        // Check unique phone across users and instructors
        $existingInstructor = Instructor::where('phone', $normalizedPhone)->first();
        if ($existingInstructor) {
            throw ValidationException::withMessages([
                'phone' => ['An instructor account with this mobile number already exists. Please log in.'],
            ]);
        }

        $languages = is_array($validated['languages'])
            ? $validated['languages']
            : (json_decode($validated['languages'], true) ?: ['English']);

        $created = DB::transaction(function () use ($request, $validated, $normalizedPhone, $languages) {
            // 1. Create User account
            $user = User::create([
                'name' => $validated['name'],
                'email' => strtolower(trim($validated['email'])),
                'phone' => $normalizedPhone,
                'password' => Hash::make($validated['password']),
                'role' => 'instructor',
                'is_active' => true,
            ]);

            // 2. Upload public profile photo if provided
            $profileImagePath = null;
            if ($request->hasFile('profile_photo')) {
                $ext = $request->file('profile_photo')->getClientOriginalExtension();
                $filename = 'inst_' . $user->id . '_' . time() . '.' . $ext;
                $profileImagePath = $request->file('profile_photo')->storeAs('instructors', $filename, 'public');
            }

            // 3. Store required identity & accreditation documents in PRIVATE storage
            $privateDir = 'instructor_documents/' . $user->id;
            $wwccExt = $request->file('doc_wwcc')->getClientOriginalExtension();
            $licenceExt = $request->file('doc_licence')->getClientOriginalExtension();
            $permitExt = $request->file('doc_permit')->getClientOriginalExtension();

            $wwccPath = $request->file('doc_wwcc')->storeAs($privateDir, 'wwcc_' . time() . '.' . $wwccExt, 'local');
            $licencePath = $request->file('doc_licence')->storeAs($privateDir, 'licence_' . time() . '.' . $licenceExt, 'local');
            $permitPath = $request->file('doc_permit')->storeAs($privateDir, 'permit_' . time() . '.' . $permitExt, 'local');

            // 4. Create Instructor record
            $instructor = Instructor::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'email' => strtolower(trim($validated['email'])),
                'phone' => $normalizedPhone,
                'bio' => $validated['bio'],
                'experience_years' => $validated['experience_years'],
                'languages' => $languages,
                'car_make' => $validated['car_make'],
                'car_model' => $validated['car_model'],
                'car_year' => $validated['car_year'],
                'car_transmission' => 'auto',
                'car_rego' => strtoupper(trim($validated['car_rego'])),
                'car_dual_controls' => true,
                'profile_image' => $profileImagePath ? '/storage/' . $profileImagePath : null,
                'doc_wwcc_path' => $wwccPath,
                'doc_licence_path' => $licencePath,
                'doc_permit_path' => $permitPath,
                'verification_status' => 'pending_phone_verification',
                'is_active' => false,
                'is_examiner' => false,
                'base_hourly_rate' => 85.00,
                'vort_test_rate' => 240.00,
            ]);

            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'instructor_signup_submitted',
                'entity_type' => 'Instructor',
                'entity_id' => (string) $user->id,
                'new_values' => [
                    'name' => $validated['name'],
                    'phone' => $normalizedPhone,
                    'car_model' => $validated['car_model'],
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return [$user, $instructor];
        });

        [$user, $instructor] = $created;

        // Send SMS OTP to verify Australian mobile number
        $smsResult = $smsService->sendOtp($normalizedPhone, 'instructor_signup');

        return response()->json([
            'status' => 'success',
            'message' => 'Instructor application created. We have sent an SMS verification code to your mobile.',
            'phone' => $normalizedPhone,
            'instructor_id' => $instructor->id,
            'verification_required' => true,
            'cooldown_seconds' => $smsResult['cooldown_seconds'] ?? 60,
            'debug_otp' => $smsResult['debug_otp'] ?? null,
        ], 201);
    }

    /**
     * Verify mobile phone with one-time SMS code and transition status to Pending Review.
     */
    public function verifyPhone(Request $request, SmsService $smsService): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $rawCode = $request->input('code') ?: $request->input('otp_code');
        if (empty($rawCode) || strlen(trim($rawCode)) !== 6) {
            throw ValidationException::withMessages([
                'otp_code' => ['The 6-digit verification code is required.'],
            ]);
        }

        $normalizedPhone = $smsService->normalizeAustralianPhone($request->input('phone'));

        $smsService->verifyOtp($normalizedPhone, $rawCode, 'instructor_signup');

        // Locate instructor record
        $instructor = Instructor::where('phone', $normalizedPhone)->first();
        if (!$instructor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Instructor record not found for this mobile number.',
            ], 404);
        }

        // Set verified timestamp and advance status to pending_review
        $instructor->phone_verified_at = Carbon::now();
        $instructor->verification_status = 'pending_review';
        $instructor->save();

        if ($instructor->user) {
            $instructor->user->phone_verified_at = Carbon::now();
            $instructor->user->save();
        }

        // Generate Sanctum token so instructor can access status dashboard immediately
        $user = $instructor->user ?? User::where('phone', $normalizedPhone)->first();
        $token = $user ? $user->createToken('instructor-token', ['instructor'])->plainTextToken : null;

        return response()->json([
            'status' => 'success',
            'message' => 'Mobile number verified successfully. Your application is now Pending Review.',
            'token' => $token,
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => 'instructor',
            ] : null,
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'verification_status' => $instructor->verification_status,
                'is_approved' => $instructor->isApproved(),
            ],
        ]);
    }

    /**
     * Resend phone verification code with cooldown restriction.
     */
    public function resendOtp(Request $request, SmsService $smsService): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'purpose' => 'nullable|string|in:instructor_signup,instructor_login',
        ]);

        $purpose = $validated['purpose'] ?? 'instructor_signup';
        $result = $smsService->sendOtp($validated['phone'], $purpose);

        return response()->json($result);
    }

    /**
     * Request a one-time SMS login code.
     */
    public function sendLoginOtp(Request $request, SmsService $smsService): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'required|string',
        ]);

        $normalizedPhone = $smsService->normalizeAustralianPhone($validated['phone']);

        // Check if an instructor exists matching this phone
        $instructor = $this->findInstructorByPhone($normalizedPhone);

        if (!$instructor) {
            return response()->json([
                'status' => 'error',
                'message' => "No instructor account found with mobile number {$normalizedPhone}. Please sign up as an instructor first.",
            ], 404);
        }

        $result = $smsService->sendOtp($normalizedPhone, 'instructor_login');

        return response()->json([
            'status' => 'success',
            'message' => "Login code sent to {$normalizedPhone}.",
            'phone' => $normalizedPhone,
            'cooldown_seconds' => $result['cooldown_seconds'] ?? 60,
            'debug_otp' => $result['debug_otp'] ?? null,
        ]);
    }

    /**
     * Verify SMS OTP code and log the instructor in.
     */
    public function verifyLoginOtp(Request $request, SmsService $smsService): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $rawCode = $request->input('code') ?: $request->input('otp_code');
        if (empty($rawCode) || strlen(trim($rawCode)) !== 6) {
            throw ValidationException::withMessages([
                'otp_code' => ['The 6-digit verification code is required.'],
            ]);
        }

        $normalizedPhone = $smsService->normalizeAustralianPhone($request->input('phone'));

        $smsService->verifyOtp($normalizedPhone, $rawCode, 'instructor_login');

        $instructor = $this->findInstructorByPhone($normalizedPhone);
        if (!$instructor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Instructor account not found.',
            ], 404);
        }

        // Link or create User account if not yet attached (preserves existing seeded approved instructors)
        $user = $instructor->user;
        if (!$user) {
            $user = User::firstOrCreate(
                ['email' => $instructor->email],
                [
                    'name' => $instructor->name,
                    'phone' => $normalizedPhone,
                    'password' => Hash::make(Str::random(24)),
                    'role' => 'instructor',
                    'is_active' => true,
                    'phone_verified_at' => Carbon::now(),
                ]
            );

            $instructor->user_id = $user->id;
            $instructor->phone_verified_at = $instructor->phone_verified_at ?: Carbon::now();
            $instructor->save();
        }

        $token = $user->createToken('instructor-token', ['instructor'])->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Signed in successfully.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => 'instructor',
            ],
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'verification_status' => $instructor->verification_status,
                'is_approved' => $instructor->isApproved(),
                'admin_feedback' => $instructor->admin_feedback,
            ],
        ]);
    }

    /**
     * Get current authenticated instructor's application status and submitted info.
     */
    public function getApplicationStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        $instructor = $user->instructor;

        if (!$instructor) {
            // Check if phone matches
            $instructor = $this->findInstructorByPhone($user->phone);
            if ($instructor && !$instructor->user_id) {
                $instructor->user_id = $user->id;
                $instructor->save();
            }
        }

        if (!$instructor) {
            return response()->json([
                'status' => 'error',
                'message' => 'No instructor profile found for your account.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
                'phone' => $instructor->phone,
                'verification_status' => $instructor->verification_status,
                'is_approved' => $instructor->isApproved(),
                'is_pending_review' => $instructor->isPendingReview(),
                'is_changes_requested' => $instructor->isChangesRequested(),
                'admin_feedback' => $instructor->admin_feedback,
                'experience_years' => $instructor->experience_years,
                'languages' => $instructor->languages,
                'bio' => $instructor->bio,
                'car_make' => $instructor->car_make,
                'car_model' => $instructor->car_model,
                'car_year' => $instructor->car_year,
                'car_rego' => $instructor->car_rego,
                'car_transmission' => $instructor->car_transmission,
                'profile_image' => $instructor->profile_image,
                'has_doc_wwcc' => !empty($instructor->doc_wwcc_path),
                'has_doc_licence' => !empty($instructor->doc_licence_path),
                'has_doc_permit' => !empty($instructor->doc_permit_path),
                'created_at' => $instructor->created_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Resubmit application after updating requested changes.
     */
    public function resubmitApplication(Request $request): JsonResponse
    {
        $user = $request->user();
        $instructor = $user->instructor ?: $this->findInstructorByPhone($user->phone);

        if (!$instructor) {
            return response()->json(['status' => 'error', 'message' => 'Instructor profile not found.'], 404);
        }

        $validated = $request->validate([
            'experience_years' => 'nullable|integer|min:0|max:50',
            'languages' => 'nullable',
            'bio' => 'nullable|string|min:20|max:3000',
            'car_make' => 'nullable|string|max:100',
            'car_model' => 'nullable|string|max:100',
            'car_year' => 'nullable|integer|min:2010|max:' . (date('Y') + 1),
            'car_rego' => 'nullable|string|max:20',
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'doc_wwcc' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'doc_licence' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'doc_permit' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $privateDir = 'instructor_documents/' . $user->id;

        // Update replaced files
        if ($request->hasFile('doc_wwcc')) {
            $ext = $request->file('doc_wwcc')->getClientOriginalExtension();
            $instructor->doc_wwcc_path = $request->file('doc_wwcc')->storeAs($privateDir, 'wwcc_' . time() . '.' . $ext, 'local');
        }
        if ($request->hasFile('doc_licence')) {
            $ext = $request->file('doc_licence')->getClientOriginalExtension();
            $instructor->doc_licence_path = $request->file('doc_licence')->storeAs($privateDir, 'licence_' . time() . '.' . $ext, 'local');
        }
        if ($request->hasFile('doc_permit')) {
            $ext = $request->file('doc_permit')->getClientOriginalExtension();
            $instructor->doc_permit_path = $request->file('doc_permit')->storeAs($privateDir, 'permit_' . time() . '.' . $ext, 'local');
        }
        if ($request->hasFile('profile_photo')) {
            $ext = $request->file('profile_photo')->getClientOriginalExtension();
            $filename = 'inst_' . $user->id . '_' . time() . '.' . $ext;
            $path = $request->file('profile_photo')->storeAs('instructors', $filename, 'public');
            $instructor->profile_image = '/storage/' . $path;
        }

        if (isset($validated['experience_years'])) $instructor->experience_years = $validated['experience_years'];
        if (isset($validated['bio'])) $instructor->bio = $validated['bio'];
        if (isset($validated['car_make'])) $instructor->car_make = $validated['car_make'];
        if (isset($validated['car_model'])) $instructor->car_model = $validated['car_model'];
        if (isset($validated['car_year'])) $instructor->car_year = $validated['car_year'];
        if (isset($validated['car_rego'])) $instructor->car_rego = strtoupper(trim($validated['car_rego']));

        if (!empty($validated['languages'])) {
            $instructor->languages = is_array($validated['languages'])
                ? $validated['languages']
                : (json_decode($validated['languages'], true) ?: ['English']);
        }

        // Reset to pending_review and clear feedback
        $instructor->verification_status = 'pending_review';
        $instructor->admin_feedback = null;
        $instructor->save();

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'instructor_resubmitted_application',
            'entity_type' => 'Instructor',
            'entity_id' => (string) $instructor->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Application updated and resubmitted successfully for review.',
            'instructor' => [
                'id' => $instructor->id,
                'verification_status' => $instructor->verification_status,
                'admin_feedback' => null,
            ],
        ]);
    }

    /**
     * Secure authorized endpoint to view private identity documents.
     * Authorized: Admin or the instructor themselves.
     */
    public function viewDocument(Request $request, int $id, string $type)
    {
        $user = $request->user();
        $instructor = Instructor::findOrFail($id);

        // Security check: Must be admin or the owner instructor
        $isOwner = $user && $user->instructor && $user->instructor->id === $instructor->id;
        $isAdmin = $user && $user->isAdmin();

        if (!$isOwner && !$isAdmin) {
            abort(403, 'Unauthorized access to confidential documents.');
        }

        $path = match ($type) {
            'wwcc' => $instructor->doc_wwcc_path,
            'licence' => $instructor->doc_licence_path,
            'permit' => $instructor->doc_permit_path,
            default => null,
        };

        if (empty($path) || !Storage::disk('local')->exists($path)) {
            abort(404, 'The requested document does not exist.');
        }

        return Storage::disk('local')->response($path);
    }

    /**
     * Helper to find instructor matching phone even if spaces exist in DB.
     */
    protected function findInstructorByPhone(string $normalizedPhone): ?Instructor
    {
        $instructor = Instructor::where('phone', $normalizedPhone)->first();
        if ($instructor) {
            return $instructor;
        }

        $cleanDigits = preg_replace('/[^\d]/', '', $normalizedPhone);

        return Instructor::all()->first(function ($inst) use ($cleanDigits) {
            $instDigits = preg_replace('/[^\d]/', '', $inst->phone ?? '');
            return $instDigits === $cleanDigits;
        });
    }
}
