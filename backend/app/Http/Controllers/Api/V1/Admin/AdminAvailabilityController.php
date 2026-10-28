<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AvailabilityException;
use App\Models\Instructor;
use App\Models\InstructorAvailability;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAvailabilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $instructorId = $request->input('instructor_id');

        $instructors = Instructor::where('is_active', true)->select('id', 'name')->get();

        $selectedInstructorId = $instructorId ?? $instructors->first()?->id;

        $schedules = InstructorAvailability::where('instructor_id', $selectedInstructorId)
            ->orderBy('day_of_week', 'asc')
            ->get();

        $exceptions = AvailabilityException::where('instructor_id', $selectedInstructorId)
            ->whereDate('date', '>=', now()->toDateString())
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'instructors' => $instructors,
            'selected_instructor_id' => $selectedInstructorId,
            'schedules' => $schedules,
            'exceptions' => $exceptions,
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

