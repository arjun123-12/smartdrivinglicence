<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminFaqController extends Controller
{
    public function index(): JsonResponse
    {
        $faqs = Faq::orderBy('display_order', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $faqs,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|max:50',
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $faq = Faq::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'FAQ created successfully.',
            'data' => $faq,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'category' => 'required|string|max:50',
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $faq->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'FAQ updated successfully.',
            'data' => $faq,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'FAQ deleted successfully.',
        ]);
    }
}

