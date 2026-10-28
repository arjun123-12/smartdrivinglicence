<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'licence_number',
        'licence_state',
        'licence_type',
        'date_of_birth',
        'emergency_contact_name',
        'emergency_contact_phone',
        'address',
        'suburb',
        'postcode',
        'notes',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

