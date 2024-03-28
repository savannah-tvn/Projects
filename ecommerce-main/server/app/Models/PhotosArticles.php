<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotosArticles extends Model
{
    use HasFactory;
    protected $table = 'photosArticles';

    protected $fillable = [
        'articleId', 'urlPhoto'
    ];
}
