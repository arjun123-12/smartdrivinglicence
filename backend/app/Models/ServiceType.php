<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'default_duration_minutes',
        'default_price',
        'currency',
        'is_test',
        'is_active',
    ];

    protected $casts = [
        'default_duration_minutes' => 'integer',
        'default_price' => 'decimal:2',
        'is_test' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}

