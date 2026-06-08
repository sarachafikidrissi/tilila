<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProgramTestimonial extends Model
{
    protected $fillable = [
        'program',
        'quote',
        'name',
        'role',
        'edition_year',
        'photo_path',
        'video_url',
        'sort',
        'is_published',
    ];

    protected $casts = [
        'quote' => 'array',
        'role' => 'array',
        'is_published' => 'boolean',
    ];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute(): ?string
    {
        if (! $this->photo_path) {
            return null;
        }

        return Storage::url($this->photo_path);
    }

    public function scopePublishedForProgram($query, string $program)
    {
        return $query
            ->where('program', $program)
            ->where('is_published', true)
            ->orderBy('sort')
            ->orderByDesc('id');
    }
}
