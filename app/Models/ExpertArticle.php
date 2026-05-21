<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ExpertArticle extends Model
{
    protected $fillable = [
        'expert_id',
        'slug',
        'title',
        'content',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'title' => 'array',
            'content' => 'array',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function expert(): BelongsTo
    {
        return $this->belongsTo(Expert::class);
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function isPubliclyVisible(): bool
    {
        return $this->isPublished();
    }

    public function displayDate(): CarbonInterface
    {
        return $this->created_at ?? now();
    }

    /**
     * @return array<string, mixed>
     */
    public function toFeedArray(): array
    {
        $expert = $this->relationLoaded('expert') ? $this->expert : $this->expert()->first();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title ?? ['en' => '', 'fr' => '', 'ar' => ''],
            'content' => $this->content ?? ['en' => '', 'fr' => '', 'ar' => ''],
            'published_at' => $this->displayDate()->toISOString(),
            'expert' => $expert ? [
                'id' => $expert->id,
                'name' => $expert->name ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'image' => $expert->image_url,
                'public_profile_url' => $expert->isPublished()
                    ? route('experts.show', $expert)
                    : null,
            ] : null,
        ];
    }

    public static function uniqueSlugFromTitle(string $frenchTitle, ?int $ignoreId = null): string
    {
        $base = Str::slug($frenchTitle);
        if ($base === '') {
            $base = 'article';
        }

        $slug = $base;
        $counter = 1;

        while (
            static::query()
                ->when($ignoreId !== null, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
