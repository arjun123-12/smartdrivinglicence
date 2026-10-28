<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminTestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $testimonials,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'suburb' => 'required|string|max:100',
            'rating' => 'required|integer|between:1,5',
            'feedback' => 'required|string',
            'test_type' => 'required|string|max:100',
            'instructor_name' => 'nullable|string|max:255',
            'is_approved' => 'boolean',
        ]);

        $testimonial = Testimonial::create(array_merge($validated, [
            'approved_at' => ($validated['is_approved'] ?? true) ? now() : null,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial added.',
            'data' => $testimonial,
        ], 201);
    }

    public function toggleApproval(int $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->is_approved = !$testimonial->is_approved;
        $testimonial->approved_at = $testimonial->is_approved ? now() : null;
        $testimonial->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Approval status updated.',
            'is_approved' => $testimonial->is_approved,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial deleted.',
        ]);
    }
}

