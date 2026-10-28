<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'customer')
            ->with('customerProfile')
            ->withCount('bookings');

        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%");
            });
        }

        $customers = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $customers,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $customer = User::where('role', 'customer')
            ->with(['customerProfile', 'bookings.serviceType', 'bookings.instructor', 'bookings.latestPayment'])
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $customer,
        ]);
    }

    public function toggleStatus(int $id): JsonResponse
    {
        $customer = User::where('role', 'customer')->findOrFail($id);
        $customer->is_active = !$customer->is_active;
        $customer->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Customer status changed.',
            'is_active' => $customer->is_active,
        ]);
    }
}

