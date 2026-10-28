<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DownloadableResource extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'file_path',
        'download_count',
        'is_active',
    ];

    protected $casts = [
        'download_count' => 'integer',
        'is_active' => 'boolean',
    ];
}

