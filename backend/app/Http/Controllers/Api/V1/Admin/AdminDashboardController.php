<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\ContactEnquiry;
use App\Models\Instructor;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $today = Carbon::today('Australia/Adelaide');
        $thisMonth = Carbon::now('Australia/Adelaide')->startOfMonth();

        $totalRevenue = Payment::where('payment_status', 'succeeded')->sum('amount');
        $monthRevenue = Payment::where('payment_status', 'succeeded')
            ->where('paid_at', '>=', $thisMonth)
            ->sum('amount');

        $totalBookings = Booking::count();
        $confirmedBookings = Booking::where('booking_status', 'confirmed')->count();
        $upcomingBookings = Booking::where('start_time', '>=', now())
            ->whereIn('booking_status', ['confirmed', 'pending'])
            ->count();

        $activeInstructors = Instructor::where('is_active', true)->count();
        $registeredCustomers = User::where('role', 'customer')->count();
        $pendingEnquiries = ContactEnquiry::where('status', 'new')->count();

        $recentBookings = Booking::with(['customer', 'instructor', 'serviceType', 'latestPayment'])
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        $recentAuditLogs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        return response()->json([
            'status' => 'success',
            'stats' => [
                'total_revenue' => number_format($totalRevenue, 2, '.', ''),
                'month_revenue' => number_format($monthRevenue, 2, '.', ''),
                'total_bookings' => $totalBookings,
                'confirmed_bookings' => $confirmedBookings,
                'upcoming_bookings' => $upcomingBookings,
                'active_instructors' => $activeInstructors,
                'registered_customers' => $registeredCustomers,
                'pending_enquiries' => $pendingEnquiries,
            ],
            'recent_bookings' => $recentBookings,
            'recent_logs' => $recentAuditLogs,
        ]);
    }
}

