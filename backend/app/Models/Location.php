<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'name',
        'postcode',
        'state',
        'test_centre_name',
        'is_test_centre',
        'is_active',
    ];

    protected $casts = [
        'is_test_centre' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function instructors()
    {
        return $this->belongsToMany(Instructor::class, 'instructor_locations');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}

