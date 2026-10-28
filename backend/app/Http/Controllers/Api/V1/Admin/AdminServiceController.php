<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = ServiceType::orderBy('id', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $services,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'default_duration_minutes' => 'required|integer|min:30',
            'default_price' => 'required|numeric|min:1',
            'is_test' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $slug = Str::slug($validated['name']);
        if (ServiceType::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::random(4);
        }

        $service = ServiceType::create(array_merge($validated, [
            'slug' => $slug,
            'currency' => 'AUD',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Service created successfully.',
            'data' => $service,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $service = ServiceType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'default_duration_minutes' => 'required|integer|min:30',
            'default_price' => 'required|numeric|min:1',
            'is_test' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $service->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Service updated successfully.',
            'data' => $service,
        ]);
    }
}

