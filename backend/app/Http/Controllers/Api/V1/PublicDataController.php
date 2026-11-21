<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ContactEnquiry;
use App\Models\Faq;
use App\Models\Setting;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicDataController extends Controller
{
    public function faqs(Request $request): JsonResponse
    {
        $query = Faq::where('is_active', true);

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        $faqs = $query->orderBy('display_order', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $faqs,
        ]);
    }

    public function testimonials(): JsonResponse
    {
        $testimonials = Testimonial::where('is_approved', true)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $testimonials,
        ]);
    }

    public function submitEnquiry(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:25',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $enquiry = ContactEnquiry::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Thank you for reaching out. A SmartDriving team member will respond within 24 hours.',
            'enquiry_id' => $enquiry->id,
        ], 201);
    }

    public function businessSettings(): JsonResponse
    {
        $keys = [
            'business_name',
            'business_abn',
            'business_phone',
            'business_email',
            'business_address',
            'currency',
            'booking_lead_time_hours',
            'cancellation_cutoff_hours',
            'vort_notice_period_days',
            'hero_search_title',
            'hero_search_subtitle',
            'hero_search_location_label',
            'hero_search_service_label',
            'hero_search_button_text',
            'hero_search_note',
            'hero_search_enabled',
        ];

        $settings = Setting::whereIn('key', $keys)->pluck('value', 'key');
        $settings['development_mode'] = (bool) config('services.site.development_mode', false);

        return response()->json([
            'status' => 'success',
            'settings' => $settings,
        ]);
    }

    /**
     * Return current development mode and preview authorization status.
     */
    public function siteStatus(Request $request): JsonResponse
    {
        $isDevMode = (bool) config('services.site.development_mode', false);
        $user = $request->user('sanctum') ?? auth('sanctum')->user();
        $canPreview = $user ? $user->canAccessDevelopmentPreview() : false;

        return response()->json([
            'status' => 'success',
            'development_mode' => $isDevMode,
            'preview_allowed' => $canPreview,
            'authenticated' => (bool) $user,
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => $user->isAdmin(),
                'is_tester' => $user->isAuthorizedTester(),
                'can_preview' => $canPreview,
            ] : null,
        ]);
    }
}

