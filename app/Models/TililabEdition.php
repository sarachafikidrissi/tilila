<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TililabEdition extends Model
{
    protected $table = 'tililab_editions';

    protected $fillable = [
        'year',
        'edition_label',
        'theme',
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
        'applications_close_at',
    ];

    protected $casts = [
        'applications_close_at' => 'datetime',
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
        return $this->hasMany(TililabParticipant::class);
    }

    public static function current(): ?self
    {
        return static::query()->where('is_current', true)->first();
    }

    public function applicationsAreOpen(): bool
    {
        if (! $this->is_current) {
            return false;
        }

        if ($this->applications_close_at === null) {
            return true;
        }

        return $this->applications_close_at->isFuture();
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
