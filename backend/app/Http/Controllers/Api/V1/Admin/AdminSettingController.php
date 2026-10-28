<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::orderBy('group', 'asc')->get();
        $auditLogs = AuditLog::with('user')->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'status' => 'success',
            'settings' => $settings,
            'audit_logs' => $auditLogs,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $item) {
            Setting::where('key', $item['key'])->update(['value' => $item['value']]);
        }

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'admin_updated_settings',
            'entity_type' => 'Setting',
            'new_values' => $validated['settings'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Settings saved successfully.',
        ]);
    }
}

