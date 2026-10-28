<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentQuiz extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'suburb',
        'current_licence',
        'driving_experience',
        'supervised_hours',
        'target_timeline',
        'recommended_package_id',
        'notes',
        'follow_up_status',
    ];

    protected $casts = [
        'supervised_hours' => 'integer',
    ];

    public function recommendedPackage()
    {
        return $this->belongsTo(LessonPackage::class, 'recommended_package_id');
    }
}

