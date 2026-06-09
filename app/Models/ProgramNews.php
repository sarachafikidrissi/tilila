<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProgramNews extends Model
{
    protected $table = 'program_news';

    protected $fillable = [
        'program',
        'title',
        'slug',
        'excerpt',
        'body',
        'cover_image_path',
        'published_at',
        'is_published',
    ];

    protected $casts = [
        'title' => 'array',
        'excerpt' => 'array',
        'body' => 'array',
        'published_at' => 'datetime',
        'is_published' => 'boolean',
    ];

    protected $appends = ['cover_image_url'];

    protected static function booted(): void
    {
        static::saving(function (ProgramNews $news) {
            if (blank($news->slug) && is_array($news->title)) {
                $news->slug = Str::slug($news->title['fr'] ?? $news->title['en'] ?? 'news-'.now()->timestamp);
            }
        });
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        if (! $this->cover_image_path) {
            return null;
        }

        return Storage::url($this->cover_image_path);
    }

    public function scopePublished($query, ?string $program = null)
    {
        $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at');

        if ($program) {
            $query->where(function ($q) use ($program) {
                $q->where('program', $program)->orWhereNull('program');
            });
        }

        return $query;
    }
}
