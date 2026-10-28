<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageFeature extends Model
{
    protected $fillable = [
        'package_id',
        'feature_text',
        'is_highlighted',
        'display_order',
    ];

    protected $casts = [
        'is_highlighted' => 'boolean',
        'display_order' => 'integer',
    ];

    public function package()
    {
        return $this->belongsTo(LessonPackage::class, 'package_id');
    }
}

