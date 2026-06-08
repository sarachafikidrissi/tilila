<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TililaContestParticipant extends Model
{
    protected $table = 'tilila_contest_participants';

    protected $fillable = [
        'tilila_edition_id',
        'first_name',
        'last_name',
        'representative_role',
        'email',
        'phone',
        'company',
        'brand',
        'agency',
        'city',
        'country',
        'campaign_title',
        'first_broadcast_date',
        'category',
        'submission_title',
        'submission_description',
        'creative_concept',
        'edi_contribution',
        'submission_link',
        'submission_video_path',
        'audio_path',
        'visual_path',
        'extra_document_paths',
        'declared_accuracy',
        'declared_rights',
        'accepted_rules',
        'locale',
        'ip',
        'user_agent',
    ];

    protected $casts = [
        'first_broadcast_date' => 'date',
        'extra_document_paths' => 'array',
        'declared_accuracy' => 'boolean',
        'declared_rights' => 'boolean',
        'accepted_rules' => 'boolean',
    ];

    protected $appends = ['submission_video_url', 'audio_url', 'visual_url'];

    public function edition(): BelongsTo
    {
        return $this->belongsTo(TililaEdition::class, 'tilila_edition_id');
    }

    public function getSubmissionVideoUrlAttribute(): ?string
    {
        return $this->submission_video_path
            ? route('admin.tilila.participants.file', ['participant' => $this->id, 'type' => 'video'])
            : null;
    }

    public function getAudioUrlAttribute(): ?string
    {
        return $this->audio_path
            ? route('admin.tilila.participants.file', ['participant' => $this->id, 'type' => 'audio'])
            : null;
    }

    public function getVisualUrlAttribute(): ?string
    {
        return $this->visual_path
            ? route('admin.tilila.participants.file', ['participant' => $this->id, 'type' => 'visual'])
            : null;
    }

    /**
     * @return list<string>
     */
    public function storedFilePaths(): array
    {
        return array_values(array_filter([
            $this->submission_video_path,
            $this->audio_path,
            $this->visual_path,
            ...($this->extra_document_paths ?? []),
        ]));
    }
}
