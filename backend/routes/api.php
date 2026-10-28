<?php

use App\Http\Controllers\Api\V1\Admin\AdminAvailabilityController;
use App\Http\Controllers\Api\V1\Admin\AdminBookingController;
use App\Http\Controllers\Api\V1\Admin\AdminCustomerController;
use App\Http\Controllers\Api\V1\Admin\AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\AdminEnquiryController;
use App\Http\Controllers\Api\V1\Admin\AdminFaqController;
use App\Http\Controllers\Api\V1\Admin\AdminInstructorController;
use App\Http\Controllers\Api\V1\Admin\AdminPackageController;
use App\Http\Controllers\Api\V1\Admin\AdminPaymentController;
use App\Http\Controllers\Api\V1\Admin\AdminServiceController;
use App\Http\Controllers\Api\V1\Admin\AdminSettingController;
use App\Http\Controllers\Api\V1\Admin\AdminTestimonialController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AvailabilityController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\InstructorController;
use App\Http\Controllers\Api\V1\LocationController;
use App\Http\Controllers\Api\V1\PackageController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\PublicDataController;
use App\Http\Controllers\Api\V1\ServiceTypeController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public authentication
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);

    // Public catalog & lookup
    Route::get('/services', [ServiceTypeController::class, 'index']);
    Route::get('/services/{idOrSlug}', [ServiceTypeController::class, 'show']);

    Route::get('/locations', [LocationController::class, 'index']);
    Route::get('/locations/search', [LocationController::class, 'search']);

    Route::get('/instructors', [InstructorController::class, 'index']);
    Route::get('/instructors/{id}', [InstructorController::class, 'show']);

    Route::get('/packages', [PackageController::class, 'index']);
    Route::get('/packages/{idOrSlug}', [PackageController::class, 'show']);
    Route::post('/packages/quiz-recommendation', [PackageController::class, 'quizRecommendation']);

    Route::get('/availability/search', [AvailabilityController::class, 'searchSlots']);

    // Booking workflow & payments
    Route::post('/bookings/calculate-price', [BookingController::class, 'calculatePrice']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{reference}', [BookingController::class, 'show']);

    Route::post('/payments/process', [PaymentController::class, 'processPayment']);
    Route::post('/payments/webhook', [PaymentController::class, 'webhook']);

    // Public CMS & enquiries
    Route::get('/faqs', [PublicDataController::class, 'faqs']);
    Route::get('/testimonials', [PublicDataController::class, 'testimonials']);
    Route::post('/contact', [PublicDataController::class, 'submitEnquiry']);
    Route::get('/settings/public', [PublicDataController::class, 'businessSettings']);

    // Authenticated user / customer routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::put('/auth/password', [AuthController::class, 'changePassword']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/customer/bookings', [BookingController::class, 'customerBookings']);
        Route::post('/customer/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    });

    // Admin protected routes
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'stats']);

        Route::get('/bookings', [AdminBookingController::class, 'index']);
        Route::get('/bookings/{id}', [AdminBookingController::class, 'show']);
        Route::put('/bookings/{id}/status', [AdminBookingController::class, 'updateStatus']);
        Route::post('/bookings/{id}/reschedule', [AdminBookingController::class, 'reschedule']);

        Route::get('/instructors', [AdminInstructorController::class, 'index']);
        Route::post('/instructors', [AdminInstructorController::class, 'store']);
        Route::put('/instructors/{id}', [AdminInstructorController::class, 'update']);
        Route::patch('/instructors/{id}/toggle', [AdminInstructorController::class, 'toggleStatus']);

        Route::get('/packages', [AdminPackageController::class, 'index']);
        Route::post('/packages', [AdminPackageController::class, 'store']);
        Route::put('/packages/{id}', [AdminPackageController::class, 'update']);
        Route::delete('/packages/{id}', [AdminPackageController::class, 'destroy']);

        Route::get('/customers', [AdminCustomerController::class, 'index']);
        Route::get('/customers/{id}', [AdminCustomerController::class, 'show']);
        Route::patch('/customers/{id}/toggle', [AdminCustomerController::class, 'toggleStatus']);

        Route::get('/services', [AdminServiceController::class, 'index']);
        Route::post('/services', [AdminServiceController::class, 'store']);
        Route::put('/services/{id}', [AdminServiceController::class, 'update']);

        Route::get('/availability', [AdminAvailabilityController::class, 'index']);
        Route::post('/availability/schedule', [AdminAvailabilityController::class, 'updateSchedule']);
        Route::post('/availability/exceptions', [AdminAvailabilityController::class, 'storeException']);
        Route::delete('/availability/exceptions/{id}', [AdminAvailabilityController::class, 'destroyException']);

        Route::get('/payments', [AdminPaymentController::class, 'index']);
        Route::post('/payments/{id}/refund', [AdminPaymentController::class, 'refund']);

        Route::get('/faqs', [AdminFaqController::class, 'index']);
        Route::post('/faqs', [AdminFaqController::class, 'store']);
        Route::put('/faqs/{id}', [AdminFaqController::class, 'update']);
        Route::delete('/faqs/{id}', [AdminFaqController::class, 'destroy']);

        Route::get('/testimonials', [AdminTestimonialController::class, 'index']);
        Route::post('/testimonials', [AdminTestimonialController::class, 'store']);
        Route::patch('/testimonials/{id}/toggle', [AdminTestimonialController::class, 'toggleApproval']);
        Route::delete('/testimonials/{id}', [AdminTestimonialController::class, 'destroy']);

        Route::get('/enquiries', [AdminEnquiryController::class, 'index']);
        Route::put('/enquiries/{id}/status', [AdminEnquiryController::class, 'updateStatus']);

        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::post('/settings', [AdminSettingController::class, 'update']);
    });
});
