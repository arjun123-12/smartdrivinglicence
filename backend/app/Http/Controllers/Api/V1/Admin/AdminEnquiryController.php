<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactEnquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminEnquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ContactEnquiry::query();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $enquiries = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $enquiries,
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $enquiry = ContactEnquiry::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:new,in_progress,responded,closed',
            'admin_notes' => 'nullable|string',
        ]);

        $enquiry->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Enquiry status updated.',
            'data' => $enquiry,
        ]);
    }
}

