<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonPackage extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'short_description',
        'lesson_hours',
        'lesson_count',
        'duration_weeks',
        'original_price',
        'current_price',
        'currency',
        'includes_vort',
        'includes_pickup',
        'is_featured',
        'is_active',
        'display_order',
        'terms',
    ];

    protected $casts = [
        'lesson_hours' => 'decimal:2',
        'lesson_count' => 'integer',
        'duration_weeks' => 'integer',
        'original_price' => 'decimal:2',
        'current_price' => 'decimal:2',
        'includes_vort' => 'boolean',
        'includes_pickup' => 'boolean',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function features()
    {
        return $this->hasMany(PackageFeature::class, 'package_id')->orderBy('display_order');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'package_id');
    }
}

