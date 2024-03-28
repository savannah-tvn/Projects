<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotosCategorie extends Model
{
    use HasFactory;
    protected $table = 'photosCategorie';

    protected $fillable = [
        'categorieId', 'urlPhoto'
    ];
}
