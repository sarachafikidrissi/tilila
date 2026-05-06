<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class TililabParticipant extends Model
{
    protected $table = 'tililab_participants';

    protected $fillable = [
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

    public function getOriginalVideoUrlAttribute(): ?string
    {
        if (! $this->original_video_path) {
            return null;
        }

        return Storage::url($this->original_video_path);
    }
}

