<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Instructor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminInstructorController extends Controller
{
    public function index(): JsonResponse
    {
        $instructors = Instructor::with(['locations', 'examinerCredentials'])
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $instructors,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:instructors',
            'phone' => 'required|string|max:25',
            'bio' => 'nullable|string',
            'qualifications' => 'nullable|string',
            'is_examiner' => 'required|boolean',
            'examiner_accreditation_no' => 'nullable|string|max:100',
            'car_transmission' => 'required|in:auto',
            'car_model' => 'nullable|string|max:100',
            'car_year' => 'nullable|string|max:4',
            'car_dual_controls' => 'boolean',
            'base_hourly_rate' => 'required|numeric|min:20',
            'vort_test_rate' => 'nullable|numeric|min:0',
            'languages' => 'nullable|array',
            'location_ids' => 'nullable|array',
            'location_ids.*' => 'exists:locations,id',
        ]);

        $instructor = Instructor::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'bio' => $validated['bio'] ?? null,
            'qualifications' => $validated['qualifications'] ?? null,
            'is_examiner' => $validated['is_examiner'],
            'examiner_accreditation_no' => $validated['examiner_accreditation_no'] ?? null,
            'car_transmission' => $validated['car_transmission'],
            'car_model' => $validated['car_model'] ?? 'Toyota Corolla Hybrid',
            'car_year' => $validated['car_year'] ?? '2023',
            'car_dual_controls' => $validated['car_dual_controls'] ?? true,
            'base_hourly_rate' => $validated['base_hourly_rate'],
            'vort_test_rate' => $validated['vort_test_rate'] ?? 240.00,
            'languages' => $validated['languages'] ?? ['English'],
            'is_active' => true,
        ]);

        if (!empty($validated['location_ids'])) {
            $instructor->locations()->sync($validated['location_ids']);
        }

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'admin_created_instructor',
            'entity_type' => 'Instructor',
            'entity_id' => (string) $instructor->id,
            'new_values' => ['name' => $instructor->name],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Instructor added successfully.',
            'data' => $instructor->load('locations'),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $instructor = Instructor::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|max:255|unique:instructors,email,{$id}",
            'phone' => 'required|string|max:25',
            'bio' => 'nullable|string',
            'qualifications' => 'nullable|string',
            'is_examiner' => 'required|boolean',
            'examiner_accreditation_no' => 'nullable|string|max:100',
            'car_transmission' => 'required|in:auto',
            'car_model' => 'nullable|string|max:100',
            'car_year' => 'nullable|string|max:4',
            'base_hourly_rate' => 'required|numeric|min:20',
            'vort_test_rate' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'languages' => 'nullable|array',
            'location_ids' => 'nullable|array',
            'location_ids.*' => 'exists:locations,id',
        ]);

        $instructor->update($validated);

        if (isset($validated['location_ids'])) {
            $instructor->locations()->sync($validated['location_ids']);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Instructor details updated.',
            'data' => $instructor->load('locations'),
        ]);
    }

    public function toggleStatus(int $id): JsonResponse
    {
        $instructor = Instructor::findOrFail($id);
        $instructor->is_active = !$instructor->is_active;
        $instructor->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Instructor status toggled.',
            'is_active' => $instructor->is_active,
        ]);
    }

    /**
     * Get complete application review details including vehicle, contact, profile, and private document preview URLs.
     */
    public function reviewApplication(int $id): JsonResponse
    {
        $instructor = Instructor::with(['locations', 'examinerCredentials'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
                'phone' => $instructor->phone,
                'phone_verified_at' => $instructor->phone_verified_at,
                'verification_status' => $instructor->verification_status,
                'is_active' => $instructor->is_active,
                'admin_feedback' => $instructor->admin_feedback,
                'profile_image' => $instructor->profile_image,
                'bio' => $instructor->bio,
                'experience_years' => $instructor->experience_years,
                'languages' => $instructor->languages,
                'car_make' => $instructor->car_make,
                'car_model' => $instructor->car_model,
                'car_year' => $instructor->car_year,
                'car_transmission' => $instructor->car_transmission,
                'car_rego' => $instructor->car_rego,
                'car_dual_controls' => $instructor->car_dual_controls,
                'documents' => [
                    'wwcc' => [
                        'has_document' => !empty($instructor->doc_wwcc_path),
                        'preview_url' => !empty($instructor->doc_wwcc_path) ? "/api/v1/instructors/{$instructor->id}/documents/wwcc" : null,
                    ],
                    'licence' => [
                        'has_document' => !empty($instructor->doc_licence_path),
                        'preview_url' => !empty($instructor->doc_licence_path) ? "/api/v1/instructors/{$instructor->id}/documents/licence" : null,
                    ],
                    'permit' => [
                        'has_document' => !empty($instructor->doc_permit_path),
                        'preview_url' => !empty($instructor->doc_permit_path) ? "/api/v1/instructors/{$instructor->id}/documents/permit" : null,
                    ],
                ],
                'created_at' => $instructor->created_at,
                'updated_at' => $instructor->updated_at,
            ],
        ]);
    }

    /**
     * Approve an instructor application.
     */
    public function approveApplication(Request $request, int $id): JsonResponse
    {
        $instructor = Instructor::findOrFail($id);
        $instructor->verification_status = 'approved';
        $instructor->is_active = true;
        $instructor->admin_feedback = null;
        $instructor->save();

        if ($instructor->user) {
            $instructor->user->is_active = true;
            $instructor->user->save();
        }

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'admin_approved_instructor',
            'entity_type' => 'Instructor',
            'entity_id' => (string) $instructor->id,
            'new_values' => ['verification_status' => 'approved', 'is_active' => true],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Instructor {$instructor->name} approved successfully.",
            'instructor' => $instructor,
        ]);
    }

    /**
     * Request changes on an instructor application with specific reason.
     */
    public function requestChanges(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|min:5|max:2000',
        ]);

        $instructor = Instructor::findOrFail($id);
        $instructor->verification_status = 'changes_requested';
        $instructor->admin_feedback = $validated['reason'];
        $instructor->is_active = false;
        $instructor->save();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'admin_requested_instructor_changes',
            'entity_type' => 'Instructor',
            'entity_id' => (string) $instructor->id,
            'new_values' => [
                'verification_status' => 'changes_requested',
                'reason' => $validated['reason'],
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Changes requested from instructor.',
            'instructor' => $instructor,
        ]);
    }
}

