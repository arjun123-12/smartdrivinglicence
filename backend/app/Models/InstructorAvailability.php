<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstructorAvailability extends Model
{
    protected $fillable = [
        'instructor_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_active',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'is_active' => 'boolean',
    ];

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }
}

