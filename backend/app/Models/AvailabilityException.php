<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvailabilityException extends Model
{
    protected $fillable = [
        'instructor_id',
        'date',
        'start_time',
        'end_time',
        'is_unavailable',
        'reason',
    ];

    protected $casts = [
        'date' => 'date',
        'is_unavailable' => 'boolean',
    ];

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }
}

