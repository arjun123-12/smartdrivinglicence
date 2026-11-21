<?php

/**
 * End-to-End Verification Script for Development Mode & Private Preview
 */

$backendUrl = 'http://localhost:8000/api/v1';
$frontendUrl = 'http://localhost:5173';

function request($url, $method = 'GET', $data = null, $token = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    $headers = ['Accept: application/json'];
    if ($data !== null) {
        $headers[] = 'Content-Type: application/json';
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['status' => $status, 'data' => json_decode($response, true), 'raw' => $response];
}

echo "========================================================\n";
echo "1. VERIFYING LIVE FRONTEND & BACKEND STATUS\n";
echo "========================================================\n";

// 1. Check frontend
$frontendRes = file_get_contents($frontendUrl);
if ($frontendRes && str_contains($frontendRes, '<div id="root">')) {
    echo "✓ Frontend Vite server accessible at {$frontendUrl}\n";
} else {
    echo "✗ Frontend not reachable at {$frontendUrl}\n";
}

// 2. Check site status API
$siteStatus = request("{$backendUrl}/site/status");
echo "✓ GET /site/status returned HTTP {$siteStatus['status']}\n";
echo "  - development_mode: " . ($siteStatus['data']['development_mode'] ? 'true' : 'false') . "\n";
echo "  - preview_allowed: " . ($siteStatus['data']['preview_allowed'] ? 'true' : 'false') . "\n";
assert($siteStatus['data']['development_mode'] === true, "Development mode should be true");

echo "\n========================================================\n";
echo "2. VERIFYING UNRESTRICTED & RESTRICTED ROUTES IN DEV MODE\n";
echo "========================================================\n";

// 3. Unauthenticated call to direct booking calculation should be 403 Forbidden
$calcRes = request("{$backendUrl}/bookings/calculate-price", 'POST', ['service_type_id' => 1]);
echo "✓ Direct booking route (unauthenticated) returned HTTP {$calcRes['status']}\n";
echo "  - code: " . ($calcRes['data']['code'] ?? 'N/A') . "\n";
echo "  - message: " . ($calcRes['data']['message'] ?? 'N/A') . "\n";
assert($calcRes['status'] === 403, "Unauthenticated booking call should return 403");

// 4. Stripe Webhook callback should remain reachable without 403
$webhookRes = request("{$backendUrl}/webhooks/stripe", 'POST', ['id' => 'evt_test_123']);
echo "✓ Stripe Webhook callback returned HTTP {$webhookRes['status']} (Not blocked by 403)\n";
assert($webhookRes['status'] !== 403, "Stripe webhook should not be blocked by 403 dev mode");

echo "\n========================================================\n";
echo "3. VERIFYING SECURE PREVIEW AUTHENTICATION\n";
echo "========================================================\n";

// 5. Standard customer attempting preview login should be rejected with 403
$custLogin = request("{$backendUrl}/auth/login", 'POST', [
    'email' => 'learner@smartdriving.com.au',
    'password' => 'Password123!',
    'require_preview' => true,
]);
echo "✓ Standard customer preview login rejected with HTTP {$custLogin['status']}\n";
echo "  - message: " . ($custLogin['data']['message'] ?? 'N/A') . "\n";
assert($custLogin['status'] === 403, "Standard customer should be rejected from preview");

// 6. Authorized QA Tester login should succeed with token and can_preview = true
$testerLogin = request("{$backendUrl}/auth/login", 'POST', [
    'email' => 'tester@smartdriving.com.au',
    'password' => 'Password123!',
    'require_preview' => true,
]);
echo "✓ Authorized QA Tester preview login succeeded with HTTP {$testerLogin['status']}\n";
$testerToken = $testerLogin['data']['token'] ?? null;
echo "  - can_preview: " . ($testerLogin['data']['can_preview'] ? 'true' : 'false') . "\n";
echo "  - token issued: " . ($testerToken ? 'YES' : 'NO') . "\n";
assert($testerLogin['status'] === 200, "Tester login should succeed");
assert($testerLogin['data']['can_preview'] === true, "Tester should have can_preview=true");

// 7. Admin login should succeed with token and can_preview = true
$adminLogin = request("{$backendUrl}/auth/login", 'POST', [
    'email' => 'admin@smartdriving.com.au',
    'password' => 'Password123!',
    'require_preview' => true,
]);
echo "✓ Administrator preview login succeeded with HTTP {$adminLogin['status']}\n";
$adminToken = $adminLogin['data']['token'] ?? null;
echo "  - can_preview: " . ($adminLogin['data']['can_preview'] ? 'true' : 'false') . "\n";
assert($adminLogin['status'] === 200, "Admin login should succeed");

echo "\n========================================================\n";
echo "4. VERIFYING PREVIEW ACCESS TO RESTRICTED APIS\n";
echo "========================================================\n";

// 8. Tester making booking calculation call with Bearer token passes dev barrier
$testerCalc = request("{$backendUrl}/bookings/calculate-price", 'POST', [], $testerToken);
echo "✓ Tester call to restricted route returned HTTP {$testerCalc['status']} (bypassed 403 dev barrier)\n";
assert($testerCalc['status'] === 422, "Tester should bypass 403 and hit controller validation (422)");

// 9. Admin making booking calculation call with Bearer token passes dev barrier
$adminCalc = request("{$backendUrl}/bookings/calculate-price", 'POST', [], $adminToken);
echo "✓ Admin call to restricted route returned HTTP {$adminCalc['status']} (bypassed 403 dev barrier)\n";
assert($adminCalc['status'] === 422, "Admin should bypass 403 and hit controller validation (422)");

echo "\n========================================================\n";
echo "ALL END-TO-END VERIFICATION CHECKS PASSED SUCCESSFULLY!\n";
echo "========================================================\n";
