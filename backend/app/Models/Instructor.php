<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'profile_image',
        'bio',
        'qualifications',
        'verification_status',
        'is_examiner',
        'examiner_accreditation_no',
        'car_transmission',
        'car_model',
        'car_year',
        'car_dual_controls',
        'base_hourly_rate',
        'vort_test_rate',
        'languages',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'is_examiner' => 'boolean',
        'car_dual_controls' => 'boolean',
        'is_active' => 'boolean',
        'base_hourly_rate' => 'decimal:2',
        'vort_test_rate' => 'decimal:2',
        'languages' => 'array',
        'display_order' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function examinerCredentials()
    {
        return $this->hasMany(ExaminerCredential::class);
    }

    public function locations()
    {
        return $this->belongsToMany(Location::class, 'instructor_locations');
    }

    public function availabilities()
    {
        return $this->hasMany(InstructorAvailability::class);
    }

    public function exceptions()
    {
        return $this->hasMany(AvailabilityException::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}

