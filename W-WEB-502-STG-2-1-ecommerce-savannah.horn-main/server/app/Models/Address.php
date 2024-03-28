<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class address extends Model
{
    use HasFactory;

    protected $fillable = [
        'country',
        'city',
        'zipcode',
        'phone',
        'address',
        'user_id',
        'last_name',
        'first_name',
    ];

}
