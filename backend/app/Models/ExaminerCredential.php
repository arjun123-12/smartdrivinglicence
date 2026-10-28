<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExaminerCredential extends Model
{
    protected $fillable = [
        'instructor_id',
        'accreditation_number',
        'issuing_authority',
        'expiry_date',
        'verification_document_url',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'verified_at' => 'datetime',
    ];

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }
}

