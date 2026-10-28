<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CustomerProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Authenticate user and issue Sanctum token.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'status' => 'error',
                'message' => 'Your account has been deactivated. Please contact support.',
            ], 403);
        }

        // Revoke prior tokens if any, or generate fresh one
        $token = $user->createToken('auth-token', [$user->role])->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_admin' => $user->isAdmin(),
                'customer_profile' => $user->customerProfile,
            ],
        ]);
    }

    /**
     * Register a new customer account.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:25',
            'suburb' => 'nullable|string|max:100',
            'postcode' => 'nullable|string|max:10',
            'licence_type' => 'nullable|string|in:learner,provisional_1,provisional_2,full,international',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
            'is_active' => true,
        ]);

        $customerProfile = CustomerProfile::create([
            'user_id' => $user->id,
            'licence_state' => 'SA',
            'licence_type' => $validated['licence_type'] ?? 'learner',
            'suburb' => $validated['suburb'] ?? null,
            'postcode' => $validated['postcode'] ?? null,
        ]);

        $token = $user->createToken('auth-token', ['customer'])->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Account created successfully',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_admin' => false,
                'customer_profile' => $customerProfile,
            ],
        ], 201);
    }

    /**
     * Get the authenticated user with details.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('customerProfile', 'notifications');

        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_admin' => $user->isAdmin(),
                'customer_profile' => $user->customerProfile,
                'unread_notifications' => $user->notifications()->whereNull('read_at')->count(),
            ],
        ]);
    }

    /**
     * Update customer profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:25',
            'licence_number' => 'nullable|string|max:50',
            'licence_state' => 'nullable|string|max:10',
            'licence_type' => 'nullable|string|in:learner,provisional_1,provisional_2,full,international',
            'date_of_birth' => 'nullable|date',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:25',
            'address' => 'nullable|string|max:255',
            'suburb' => 'nullable|string|max:100',
            'postcode' => 'nullable|string|max:10',
            'notes' => 'nullable|string',
        ]);

        $user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? $user->phone,
        ]);

        $profile = CustomerProfile::firstOrCreate(['user_id' => $user->id]);
        $profile->update([
            'licence_number' => $validated['licence_number'] ?? $profile->licence_number,
            'licence_state' => $validated['licence_state'] ?? $profile->licence_state ?? 'SA',
            'licence_type' => $validated['licence_type'] ?? $profile->licence_type,
            'date_of_birth' => $validated['date_of_birth'] ?? $profile->date_of_birth,
            'emergency_contact_name' => $validated['emergency_contact_name'] ?? $profile->emergency_contact_name,
            'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? $profile->emergency_contact_phone,
            'address' => $validated['address'] ?? $profile->address,
            'suburb' => $validated['suburb'] ?? $profile->suburb,
            'postcode' => $validated['postcode'] ?? $profile->postcode,
            'notes' => $validated['notes'] ?? $profile->notes,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_admin' => $user->isAdmin(),
                'customer_profile' => $profile,
            ],
        ]);
    }

    /**
     * Change user password.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed successfully',
        ]);
    }

    /**
     * Log out and revoke current access token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ]);
    }
}

