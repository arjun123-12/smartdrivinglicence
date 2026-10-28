<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\LessonPackage;
use App\Models\PackageFeature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminPackageController extends Controller
{
    public function index(): JsonResponse
    {
        $packages = LessonPackage::with('features')
            ->orderBy('display_order', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $packages,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'lesson_hours' => 'required|numeric|min:1',
            'lesson_count' => 'required|integer|min:1',
            'duration_weeks' => 'nullable|integer|min:1',
            'original_price' => 'nullable|numeric',
            'current_price' => 'required|numeric|min:1',
            'includes_vort' => 'boolean',
            'includes_pickup' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'terms' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*.feature_text' => 'required|string|max:255',
            'features.*.is_highlighted' => 'boolean',
        ]);

        $slug = Str::slug($validated['name']);
        if (LessonPackage::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::random(4);
        }

        $package = LessonPackage::create(array_merge($validated, [
            'slug' => $slug,
            'currency' => 'AUD',
        ]));

        if (!empty($validated['features'])) {
            foreach ($validated['features'] as $idx => $feat) {
                PackageFeature::create([
                    'package_id' => $package->id,
                    'feature_text' => $feat['feature_text'],
                    'is_highlighted' => $feat['is_highlighted'] ?? false,
                    'display_order' => $idx + 1,
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson package created successfully.',
            'data' => $package->load('features'),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $package = LessonPackage::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'lesson_hours' => 'required|numeric|min:1',
            'lesson_count' => 'required|integer|min:1',
            'original_price' => 'nullable|numeric',
            'current_price' => 'required|numeric|min:1',
            'includes_vort' => 'boolean',
            'includes_pickup' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'terms' => 'nullable|string',
            'features' => 'nullable|array',
        ]);

        $package->update($validated);

        if (isset($validated['features'])) {
            $package->features()->delete();
            foreach ($validated['features'] as $idx => $feat) {
                PackageFeature::create([
                    'package_id' => $package->id,
                    'feature_text' => is_array($feat) ? $feat['feature_text'] : $feat,
                    'is_highlighted' => is_array($feat) ? ($feat['is_highlighted'] ?? false) : false,
                    'display_order' => $idx + 1,
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Package updated successfully.',
            'data' => $package->load('features'),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $package = LessonPackage::findOrFail($id);
        $package->features()->delete();
        $package->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Package deleted successfully.',
        ]);
    }
}

