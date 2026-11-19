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
        'phone_verified_at',
        'profile_image',
        'bio',
        'experience_years',
        'qualifications',
        'verification_status',
        'admin_feedback',
        'is_examiner',
        'examiner_accreditation_no',
        'car_transmission',
        'car_make',
        'car_model',
        'car_year',
        'car_rego',
        'car_dual_controls',
        'doc_wwcc_path',
        'doc_licence_path',
        'doc_permit_path',
        'base_hourly_rate',
        'vort_test_rate',
        'languages',
        'is_active',
        'display_order',
    ];

    /**
     * Fields hidden from public serialization to protect identity documents and private details.
     */
    protected $hidden = [
        'doc_wwcc_path',
        'doc_licence_path',
        'doc_permit_path',
        'car_rego',
    ];

    protected $casts = [
        'is_examiner' => 'boolean',
        'car_dual_controls' => 'boolean',
        'is_active' => 'boolean',
        'experience_years' => 'integer',
        'phone_verified_at' => 'datetime',
        'base_hourly_rate' => 'decimal:2',
        'vort_test_rate' => 'decimal:2',
        'languages' => 'array',
        'display_order' => 'integer',
    ];

    public function isApproved(): bool
    {
        return in_array($this->verification_status, ['approved', 'verified']) && $this->is_active;
    }

    public function isPendingReview(): bool
    {
        return $this->verification_status === 'pending_review';
    }

    public function isChangesRequested(): bool
    {
        return $this->verification_status === 'changes_requested';
    }

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

