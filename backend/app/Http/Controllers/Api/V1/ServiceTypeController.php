<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Illuminate\Http\JsonResponse;

class ServiceTypeController extends Controller
{
    public function index(): JsonResponse
    {
        $services = ServiceType::where('is_active', true)
            ->orderBy('is_test', 'desc')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $services,
        ]);
    }

    public function show(string $idOrSlug): JsonResponse
    {
        $service = ServiceType::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $service,
        ]);
    }
}

