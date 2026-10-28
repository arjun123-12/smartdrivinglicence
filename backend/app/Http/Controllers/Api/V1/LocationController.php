<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Location::where('is_active', true);

        if ($request->has('test_centre_only') && $request->boolean('test_centre_only')) {
            $query->where('is_test_centre', true);
        }

        if ($request->filled('search')) {
            $term = $request->input('search');
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('postcode', 'like', "%{$term}%")
                  ->orWhere('test_centre_name', 'like', "%{$term}%");
            });
        }

        $locations = $query->orderBy('is_test_centre', 'desc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $locations,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $term = $request->input('q', '');
        if (strlen($term) < 2) {
            return response()->json(['status' => 'success', 'data' => []]);
        }

        $locations = Location::where('is_active', true)
            ->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('postcode', 'like', "%{$term}%");
            })
            ->limit(10)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $locations,
        ]);
    }
}

