<?php

namespace Tests\Feature;

use App\Models\Instructor;
use App\Models\SmsOtp;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InstructorAuthAndApprovalTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
    }

    /**
     * Test instructor signup validates required fields and documents.
     */
    public function test_instructor_signup_validates_required_fields_and_documents(): void
    {
        $response = $this->postJson('/api/v1/instructors/signup', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'email',
                'phone',
                'password',
                'experience_years',
                'languages',
                'bio',
                'car_make',
                'car_model',
                'car_year',
                'car_transmission',
                'car_rego',
                'doc_wwcc',
                'doc_licence',
                'doc_permit',
            ]);
    }

    /**
     * Test successful signup stores documents in private storage and sends OTP.
     */
    public function test_instructor_signup_stores_private_documents_and_creates_applicant(): void
    {
        $wwcc = UploadedFile::fake()->create('wwcc.pdf', 500, 'application/pdf');
        $licence = UploadedFile::fake()->create('licence.jpg', 500, 'image/jpeg');
        $permit = UploadedFile::fake()->create('permit.pdf', 500, 'application/pdf');

        $response = $this->post('/api/v1/instructors/signup', [
            'name' => 'Oliver Test Trainer',
            'email' => 'oliver.test@smartdriving.com.au',
            'phone' => '0412 999 888',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'experience_years' => 4,
            'languages' => json_encode(['English', 'Spanish']),
            'bio' => 'Experienced driving instructor specializing in anxious learners and first-time pass rates.',
            'car_make' => 'Toyota',
            'car_model' => 'Corolla Hybrid',
            'car_year' => 2023,
            'car_transmission' => 'auto',
            'car_rego' => 'S123TST',
            'doc_wwcc' => $wwcc,
            'doc_licence' => $licence,
            'doc_permit' => $permit,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'phone',
                'instructor_id',
            ]);

        $this->assertDatabaseHas('instructors', [
            'email' => 'oliver.test@smartdriving.com.au',
            'phone' => '+61412999888',
            'verification_status' => 'pending_phone_verification',
            'car_transmission' => 'auto',
            'car_rego' => 'S123TST',
        ]);

        $this->assertDatabaseHas('sms_otps', [
            'phone' => '+61412999888',
            'purpose' => 'instructor_signup',
        ]);
    }

    /**
     * Test verifying phone with correct OTP transitions status to pending_review.
     */
    public function test_phone_verification_confirms_phone_and_sets_pending_review(): void
    {
        $otp = SmsOtp::create([
            'phone' => '+61412111222',
            'otp_code' => '654321',
            'purpose' => 'instructor_signup',
            'expires_at' => now()->addMinutes(10),
            'resend_after' => now()->addSeconds(60),
            'attempts' => 0,
            'is_used' => false,
        ]);

        $user = User::create([
            'name' => 'Phone Verify User',
            'email' => 'pvuser@smartdriving.com.au',
            'phone' => '+61412111222',
            'password' => Hash::make('Password123!'),
            'role' => 'instructor',
            'is_active' => true,
        ]);

        $instructor = Instructor::create([
            'user_id' => $user->id,
            'name' => 'Phone Verify User',
            'email' => 'pvuser@smartdriving.com.au',
            'phone' => '+61412111222',
            'verification_status' => 'pending_phone_verification',
            'car_transmission' => 'auto',
            'base_hourly_rate' => 85.00,
            'vort_test_rate' => 240.00,
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/v1/instructors/verify-phone', [
            'phone' => '0412 111 222',
            'otp_code' => '654321',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'instructor' => [
                    'verification_status' => 'pending_review',
                ],
            ]);

        $instructor->refresh();
        $this->assertEquals('pending_review', $instructor->verification_status);
        $this->assertNotNull($instructor->phone_verified_at);
    }

    /**
     * Test incorrect OTP increments attempts and locks out after max attempts.
     */
    public function test_invalid_otp_increments_attempts_and_locks_out(): void
    {
        $otp = SmsOtp::create([
            'phone' => '+61412333444',
            'otp_code' => '112233',
            'purpose' => 'instructor_login',
            'expires_at' => now()->addMinutes(10),
            'resend_after' => now()->addSeconds(60),
            'attempts' => 4, // 5th attempt will lock out
            'is_used' => false,
        ]);

        // Wrong code attempt 5
        $response = $this->postJson('/api/v1/auth/instructor/verify-otp', [
            'phone' => '+61412333444',
            'otp_code' => '999999',
        ]);

        $response->assertStatus(422);

        $otp->refresh();
        $this->assertEquals(5, $otp->attempts);

        // Attempt 6 should be locked out
        $responseBlocked = $this->postJson('/api/v1/auth/instructor/verify-otp', [
            'phone' => '+61412333444',
            'otp_code' => '112233',
        ]);

        $responseBlocked->assertStatus(422)
            ->assertJson(['message' => 'Maximum incorrect attempts exceeded. Please request a new verification code.']);
    }

    /**
     * Test OTP login flow with Australian phone normalization.
     */
    public function test_instructor_sms_login_send_and_verify_otp(): void
    {
        $user = User::create([
            'name' => 'Existing Instructor User',
            'email' => 'existing.inst@smartdriving.com.au',
            'phone' => '+61412555666',
            'password' => Hash::make('Password123!'),
            'role' => 'instructor',
            'is_active' => true,
        ]);

        $instructor = Instructor::create([
            'user_id' => $user->id,
            'name' => 'Existing Instructor User',
            'email' => 'existing.inst@smartdriving.com.au',
            'phone' => '+61412555666',
            'verification_status' => 'approved',
            'car_transmission' => 'auto',
            'base_hourly_rate' => 85.00,
            'vort_test_rate' => 240.00,
            'is_active' => true,
        ]);

        // Send login OTP
        $sendResponse = $this->postJson('/api/v1/auth/instructor/send-otp', [
            'phone' => '0412 555 666',
        ]);

        $sendResponse->assertStatus(200)
            ->assertJson(['status' => 'success']);

        $otp = SmsOtp::where('phone', '+61412555666')->where('purpose', 'instructor_login')->latest()->first();
        $this->assertNotNull($otp);

        // Verify OTP
        $verifyResponse = $this->postJson('/api/v1/auth/instructor/verify-otp', [
            'phone' => '0412 555 666',
            'otp_code' => $otp->otp_code,
        ]);

        $verifyResponse->assertStatus(200)
            ->assertJsonStructure(['status', 'token', 'user', 'instructor']);
    }

    /**
     * Test private document endpoint prevents unauthorized access and allows admin.
     */
    public function test_private_document_access_control(): void
    {
        $owner = User::create([
            'name' => 'Doc Owner',
            'email' => 'owner@smartdriving.com.au',
            'phone' => '+61412777888',
            'password' => Hash::make('Password123!'),
            'role' => 'instructor',
            'is_active' => true,
        ]);

        $stranger = User::create([
            'name' => 'Stranger Learner',
            'email' => 'stranger@smartdriving.com.au',
            'phone' => '+61412777999',
            'password' => Hash::make('Password123!'),
            'role' => 'customer',
            'is_active' => true,
        ]);

        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin.doc@smartdriving.com.au',
            'phone' => '+61412777000',
            'password' => Hash::make('Password123!'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $filePath = 'instructor_documents/' . $owner->id . '/wwcc_sample.pdf';
        Storage::disk('local')->put($filePath, '%PDF-1.4 Fake WWCC Content');

        $instructor = Instructor::create([
            'user_id' => $owner->id,
            'name' => 'Doc Owner',
            'email' => 'owner@smartdriving.com.au',
            'phone' => '+61412777888',
            'doc_wwcc_path' => $filePath,
            'verification_status' => 'pending_review',
            'car_transmission' => 'auto',
            'base_hourly_rate' => 85.00,
            'vort_test_rate' => 240.00,
            'is_active' => false,
        ]);

        // Unauthenticated guest request -> 401
        $this->getJson("/api/v1/instructors/{$instructor->id}/documents/wwcc")
            ->assertStatus(401);

        // Stranger user request -> 403 Forbidden
        $this->actingAs($stranger, 'sanctum')
            ->getJson("/api/v1/instructors/{$instructor->id}/documents/wwcc")
            ->assertStatus(403);

        // Admin request -> 200 OK
        $this->actingAs($admin, 'sanctum')
            ->get("/api/v1/instructors/{$instructor->id}/documents/wwcc")
            ->assertStatus(200);

        // Owner instructor request -> 200 OK
        $this->actingAs($owner, 'sanctum')
            ->get("/api/v1/instructors/{$instructor->id}/documents/wwcc")
            ->assertStatus(200);
    }

    /**
     * Test admin can review, approve, or request changes.
     */
    public function test_admin_can_review_approve_and_request_changes(): void
    {
        $admin = User::create([
            'name' => 'Admin Reviewer',
            'email' => 'admin.reviewer@smartdriving.com.au',
            'phone' => '+61499999000',
            'password' => Hash::make('Password123!'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $instructor = Instructor::create([
            'name' => 'Applicant Instructor',
            'email' => 'applicant@smartdriving.com.au',
            'phone' => '+61488888000',
            'verification_status' => 'pending_review',
            'car_transmission' => 'auto',
            'base_hourly_rate' => 85.00,
            'vort_test_rate' => 240.00,
            'is_active' => false,
        ]);

        // 1. Admin Review
        $reviewRes = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/admin/instructors/{$instructor->id}/review");

        $reviewRes->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'id' => $instructor->id,
                    'verification_status' => 'pending_review',
                ],
            ]);

        // 2. Admin Request Changes
        $changesRes = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/instructors/{$instructor->id}/request-changes", [
                'reason' => 'Please provide a clear scan of your driving licence front and back.',
            ]);

        $changesRes->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'instructor' => [
                    'verification_status' => 'changes_requested',
                    'admin_feedback' => 'Please provide a clear scan of your driving licence front and back.',
                ],
            ]);

        // 3. Admin Approve
        $approveRes = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/instructors/{$instructor->id}/approve");

        $approveRes->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'instructor' => [
                    'verification_status' => 'approved',
                    'is_active' => true,
                ],
            ]);
    }

    /**
     * Test public directory ONLY lists approved/verified instructors.
     */
    public function test_only_approved_instructors_appear_in_public_directory(): void
    {
        $approvedInst = Instructor::create([
            'name' => 'Visible Approved Instructor',
            'email' => 'approved.visible@smartdriving.com.au',
            'phone' => '+61411000111',
            'verification_status' => 'approved',
            'car_transmission' => 'auto',
            'base_hourly_rate' => 85.00,
            'vort_test_rate' => 240.00,
            'is_active' => true,
        ]);

        $pendingInst = Instructor::create([
            'name' => 'Hidden Pending Instructor',
            'email' => 'pending.hidden@smartdriving.com.au',
            'phone' => '+61411000222',
            'verification_status' => 'pending_review',
            'car_transmission' => 'auto',
            'base_hourly_rate' => 85.00,
            'vort_test_rate' => 240.00,
            'is_active' => false,
        ]);

        $changesInst = Instructor::create([
            'name' => 'Hidden Changes Instructor',
            'email' => 'changes.hidden@smartdriving.com.au',
            'phone' => '+61411000333',
            'verification_status' => 'changes_requested',
            'car_transmission' => 'auto',
            'base_hourly_rate' => 85.00,
            'vort_test_rate' => 240.00,
            'is_active' => false,
        ]);

        $publicList = $this->getJson('/api/v1/instructors');
        $publicList->assertStatus(200);

        $names = collect($publicList->json('data'))->pluck('name');
        $this->assertTrue($names->contains('Visible Approved Instructor'));
        $this->assertFalse($names->contains('Hidden Pending Instructor'));
        $this->assertFalse($names->contains('Hidden Changes Instructor'));
    }
}
