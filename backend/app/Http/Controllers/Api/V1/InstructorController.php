<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstructorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Instructor::where('is_active', true)
            ->with(['locations', 'examinerCredentials']);

        if ($request->filled('transmission')) {
            $trans = $request->input('transmission');
            $query->where(function ($q) use ($trans) {
                $q->where('car_transmission', $trans)
                  ->orWhere('car_transmission', 'both');
            });
        }

        if ($request->has('examiner_only') && $request->boolean('examiner_only')) {
            $query->where('is_examiner', true);
        }

        if ($request->filled('location_id')) {
            $locId = $request->input('location_id');
            $query->whereHas('locations', function ($q) use ($locId) {
                $q->where('locations.id', $locId);
            });
        }

        $instructors = $query->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $instructors,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $instructor = Instructor::where('is_active', true)
            ->with(['locations', 'examinerCredentials', 'availabilities' => function ($q) {
                $q->where('is_active', true);
            }])
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $instructor,
        ]);
    }
}

