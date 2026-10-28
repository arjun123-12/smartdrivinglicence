<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AssessmentQuiz;
use App\Models\LessonPackage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index(): JsonResponse
    {
        $packages = LessonPackage::where('is_active', true)
            ->with('features')
            ->orderBy('display_order', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $packages,
        ]);
    }

    public function show(string $idOrSlug): JsonResponse
    {
        $package = LessonPackage::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->with('features')
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $package,
        ]);
    }

    /**
     * First-lesson assessment quiz evaluation & package recommendation.
     */
    public function quizRecommendation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'driving_experience' => 'required|string|in:never_driven,some_experience,experienced,ready_for_test,overseas_conversion',
            'supervised_hours' => 'nullable|integer|min:0|max:200',
            'target_timeline' => 'nullable|string|in:asap,within_1_month,within_3_months,flexible',
            'current_licence' => 'nullable|string|in:learner,provisional_1,provisional_2,overseas,none',
            'transmission_preference' => 'nullable|string|in:auto,manual,either',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:25',
            'suburb' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $exp = $validated['driving_experience'];
        $hours = (int) ($validated['supervised_hours'] ?? 0);
        $licence = $validated['current_licence'] ?? 'learner';

        // Recommendation engine logic
        if ($exp === 'overseas_conversion' || ($exp === 'ready_for_test' && $hours >= 60)) {
            $recommendedSlug = 'vort-complete-pass-bundle';
            $reason = 'Recommended for drivers converting an overseas licence or approaching the VORT test who need a targeted warmup, mock assessment, and car hire for test day.';
        } elseif ($exp === 'never_driven' || $hours < 10) {
            $recommendedSlug = 'confidence-builder-10h';
            $reason = 'Ideal starting point to master core vehicle control, road positioning, and build foundational safe habits with an accredited instructor.';
        } elseif ($hours >= 40 && $exp === 'experienced') {
            $recommendedSlug = 'kickstarter-5h';
            $reason = 'Perfect for refining slow-speed manoeuvres (3-point turn, parallel park, angle park) and ironing out critical road law habits.';
        } else {
            $recommendedSlug = 'confidence-builder-10h';
            $reason = 'Provides comprehensive structured training covering all 5 VORT slow speed manoeuvres, complex intersections, and dual-carriageway driving.';
        }

        $package = LessonPackage::where('slug', $recommendedSlug)
            ->with('features')
            ->first() ?? LessonPackage::first();

        // Save submission if user provided contact details
        if (!empty($validated['email']) && !empty($validated['name'])) {
            AssessmentQuiz::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'suburb' => $validated['suburb'] ?? null,
                'current_licence' => $licence,
                'driving_experience' => $exp,
                'supervised_hours' => $hours,
                'target_timeline' => $validated['target_timeline'] ?? null,
                'recommended_package_id' => $package ? $package->id : null,
                'notes' => $validated['notes'] ?? null,
                'follow_up_status' => 'pending',
            ]);
        }

        return response()->json([
            'status' => 'success',
            'recommendation' => [
                'package' => $package,
                'reason' => $reason,
                'estimated_readiness_weeks' => $exp === 'never_driven' ? '8-12 weeks' : ($exp === 'ready_for_test' ? '1-2 weeks' : '4-6 weeks'),
            ],
        ]);
    }
}

