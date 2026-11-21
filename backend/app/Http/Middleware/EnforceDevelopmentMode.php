<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforceDevelopmentMode
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $isDevMode = (bool) config('services.site.development_mode', false);

        if (!$isDevMode) {
            return $next($request);
        }

        // Whitelisted public routes that must always remain accessible
        if ($this->isWhitelisted($request)) {
            return $next($request);
        }

        // Authenticate with Sanctum if Authorization header is provided
        $user = $request->user('sanctum') ?? auth('sanctum')->user();

        // Allow preview access only to Admins and explicitly Authorized Testers
        if ($user && $user->canAccessDevelopmentPreview()) {
            return $next($request);
        }

        return response()->json([
            'status' => 'error',
            'code' => 'SITE_UNDER_DEVELOPMENT',
            'message' => 'The website is currently under development. Access to this feature is restricted to authorized personnel.',
        ], 403);
    }

    /**
     * Check if the route is exempted from development mode restrictions.
     */
    protected function isWhitelisted(Request $request): bool
    {
        // 1. Stripe Sandbox Webhook & Payment Callbacks - must preserve signature verification
        if ($request->is('api/v1/webhooks/stripe') || $request->is('api/v1/payments/webhook')) {
            return true;
        }

        // 2. Site status check & public business settings
        if ($request->is('api/v1/site/status') || $request->is('api/v1/settings/public')) {
            return true;
        }

        // 3. Authentication endpoints needed for secure login and preview session
        if (
            $request->is('api/v1/auth/login') ||
            $request->is('api/v1/auth/logout') ||
            $request->is('api/v1/auth/me') ||
            $request->is('api/v1/auth/forgot-password')
        ) {
            return true;
        }

        // 4. System health check
        if ($request->is('up')) {
            return true;
        }

        return false;
    }
}
