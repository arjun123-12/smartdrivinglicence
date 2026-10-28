<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'suburb',
        'rating',
        'feedback',
        'test_type',
        'instructor_name',
        'avatar_url',
        'is_approved',
        'approved_at',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
    ];
}

