<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpertOfMonth extends Model
{
    protected $fillable = [
        'expert_id',
        'month',
        'year',
        'video_url',
    ];

    protected function casts(): array
    {
        return [
            'month' => 'integer',
            'year' => 'integer',
        ];
    }

    public function expert(): BelongsTo
    {
        return $this->belongsTo(Expert::class);
    }
}
