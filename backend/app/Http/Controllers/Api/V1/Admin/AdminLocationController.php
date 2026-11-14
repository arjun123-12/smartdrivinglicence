<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminLocationController extends Controller
{
    public function index(): JsonResponse
    {
        $locations = Location::orderBy('is_test_centre', 'desc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $locations,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'postcode' => 'required|string|max:10',
            'state' => 'nullable|string|max:10',
            'test_centre_name' => 'nullable|string|max:255',
            'is_test_centre' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $location = Location::create([
            'name' => $validated['name'],
            'postcode' => $validated['postcode'],
            'state' => $validated['state'] ?? 'SA',
            'test_centre_name' => $validated['test_centre_name'] ?? null,
            'is_test_centre' => $request->boolean('is_test_centre'),
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Location created successfully.',
            'data' => $location,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $location = Location::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'postcode' => 'required|string|max:10',
            'state' => 'nullable|string|max:10',
            'test_centre_name' => 'nullable|string|max:255',
            'is_test_centre' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $location->update([
            'name' => $validated['name'],
            'postcode' => $validated['postcode'],
            'state' => $validated['state'] ?? $location->state,
            'test_centre_name' => $validated['test_centre_name'] ?? null,
            'is_test_centre' => $request->boolean('is_test_centre'),
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $location->is_active,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Location updated successfully.',
            'data' => $location,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $location = Location::findOrFail($id);
        $location->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Location deleted successfully.',
        ]);
    }

    public function seedDefaultLocations(): JsonResponse
    {
        (new \Database\Seeders\LocationSeeder())->run();

        $locations = Location::orderBy('is_test_centre', 'desc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully seeded South Australia locations and DIT test centres (' . $locations->count() . ' total).',
            'data' => $locations,
            'count' => $locations->count(),
        ]);
    }
}

