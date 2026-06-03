<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class TililabParticipant extends Model
{
    protected $table = 'tililab_participants';

    protected $fillable = [
        'tililab_edition_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'city',
        'country',
        'bio',
        'original_video_link',
        'original_video_path',
        'locale',
        'ip',
        'user_agent',
    ];

    protected $appends = ['original_video_url'];

    public function edition(): BelongsTo
    {
        return $this->belongsTo(TililabEdition::class, 'tililab_edition_id');
    }

    public function getOriginalVideoUrlAttribute(): ?string
    {
        if (! $this->original_video_path) {
            return null;
        }

        return Storage::url($this->original_video_path);
    }
}
