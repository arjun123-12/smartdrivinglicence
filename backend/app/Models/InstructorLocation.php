<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstructorLocation extends Model
{
    protected $fillable = [
        'instructor_id',
        'location_id',
    ];

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}

