<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AvailabilityException;
use App\Models\Instructor;
use App\Models\InstructorAvailability;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAvailabilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $instructorId = $request->input('instructor_id');

        $instructors = Instructor::where('is_active', true)->select('id', 'name', 'is_examiner')->get();

        $selectedInstructorId = $instructorId ?? $instructors->first()?->id;

        $selectedInstructor = $selectedInstructorId
            ? Instructor::with(['locations:id,name,postcode,is_test_centre'])->find($selectedInstructorId)
            : null;

        $existingSchedules = InstructorAvailability::where('instructor_id', $selectedInstructorId)
            ->orderBy('day_of_week', 'asc')
            ->get();

        // Ensure all 7 days (0 = Sunday to 6 = Saturday) exist in output
        $schedules = [];
        for ($day = 0; $day <= 6; $day++) {
            $found = $existingSchedules->firstWhere('day_of_week', $day);
            if ($found) {
                $schedules[] = $found;
            } else {
                $schedules[] = [
                    'instructor_id' => (int) $selectedInstructorId,
                    'day_of_week' => $day,
                    'start_time' => '08:00:00',
                    'end_time' => '17:30:00',
                    'is_active' => false,
                ];
            }
        }

        $exceptions = AvailabilityException::where('instructor_id', $selectedInstructorId)
            ->whereDate('date', '>=', now()->toDateString())
            ->orderBy('date', 'asc')
            ->get();

        $totalLocations = Location::count();

        return response()->json([
            'status' => 'success',
            'instructors' => $instructors,
            'selected_instructor_id' => $selectedInstructorId,
            'selected_instructor' => $selectedInstructor,
            'schedules' => $schedules,
            'exceptions' => $exceptions,
            'assigned_locations_count' => $selectedInstructor?->locations?->count() ?? 0,
            'total_locations_count' => $totalLocations,
        ]);
    }

    public function updateSchedule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'instructor_id' => 'required|exists:instructors,id',
            'schedules' => 'required|array',
            'schedules.*.day_of_week' => 'required|integer|between:0,6',
            'schedules.*.start_time' => 'required|string',
            'schedules.*.end_time' => 'required|string',
            'schedules.*.is_active' => 'required|boolean',
        ]);

        foreach ($validated['schedules'] as $item) {
            InstructorAvailability::updateOrCreate(
                [
                    'instructor_id' => $validated['instructor_id'],
                    'day_of_week' => $item['day_of_week'],
                ],
                [
                    'start_time' => $item['start_time'],
                    'end_time' => $item['end_time'],
                    'is_active' => $item['is_active'],
                ]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Working hours updated successfully.',
        ]);
    }

    public function seedDefaultSchedule(Request $request): JsonResponse
    {
        $instructorId = $request->input('instructor_id');
        $instructors = $instructorId
            ? Instructor::where('id', $instructorId)->get()
            : Instructor::where('is_active', true)->get();

        foreach ($instructors as $inst) {
            for ($day = 0; $day <= 6; $day++) {
                InstructorAvailability::updateOrCreate(
                    [
                        'instructor_id' => $inst->id,
                        'day_of_week' => $day,
                    ],
                    [
                        'start_time' => '08:00:00',
                        'end_time' => '17:30:00',
                        'is_active' => true,
                    ]
                );
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Default 7-day schedule (Mon-Sun 8:00 AM - 5:30 PM) activated successfully.',
        ]);
    }

    public function assignLocations(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'instructor_id' => 'required|exists:instructors,id',
            'assign_all' => 'nullable|boolean',
            'location_ids' => 'nullable|array',
        ]);

        $instructor = Instructor::findOrFail($validated['instructor_id']);

        if (!empty($validated['assign_all'])) {
            $allIds = Location::pluck('id')->toArray();
            $instructor->locations()->sync($allIds);
            $count = count($allIds);
        } else {
            $instructor->locations()->sync($validated['location_ids'] ?? []);
            $count = count($validated['location_ids'] ?? []);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Successfully linked {$count} locations/suburbs to instructor {$instructor->name}.",
            'assigned_count' => $count,
        ]);
    }

    public function storeException(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'instructor_id' => 'required|exists:instructors,id',
            'date' => 'required|date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'is_unavailable' => 'boolean',
            'reason' => 'required|string|max:255',
        ]);

        $exception = AvailabilityException::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Exception / leave entry saved.',
            'data' => $exception,
        ], 201);
    }

    public function destroyException(int $id): JsonResponse
    {
        $exception = AvailabilityException::findOrFail($id);
        $exception->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Exception entry deleted.',
        ]);
    }
}

