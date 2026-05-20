<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TililaEdition extends Model
{
    protected $fillable = [
        'year',
        'edition_label',
        'theme',
        'ceremony_video_url',
        'cover_image_path',
        'winners',
        'jury',
        'winners_url',
        'jury_url',
        'gallery_url',
        'gallery_images',
        'has_gallery',
        'sort',
    ];

    protected $casts = [
        'edition_label' => 'array',
        'theme' => 'array',
        'winners' => 'array',
        'jury' => 'array',
        'gallery_images' => 'array',
        'has_gallery' => 'boolean',
    ];
}

