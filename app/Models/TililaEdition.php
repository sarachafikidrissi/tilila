<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'is_current',
    ];

    protected $casts = [
        'edition_label' => 'array',
        'theme' => 'array',
        'winners' => 'array',
        'jury' => 'array',
        'gallery_images' => 'array',
        'has_gallery' => 'boolean',
        'is_current' => 'boolean',
    ];

    public function participants(): HasMany
    {
        return $this->hasMany(TililaContestParticipant::class);
    }

    public static function current(): ?self
    {
        return static::query()->where('is_current', true)->first();
    }

    public static function markAsCurrent(self $edition): void
    {
        static::query()
            ->where('id', '!=', $edition->id)
            ->update(['is_current' => false]);

        if (! $edition->is_current) {
            $edition->forceFill(['is_current' => true])->save();
        }
    }
}
