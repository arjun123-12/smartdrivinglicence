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
            'car_transmission' => 'required|in:auto,manual,both',
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
            'car_transmission' => 'required|in:auto,manual,both',
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
}

