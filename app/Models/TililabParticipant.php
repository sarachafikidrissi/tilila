<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'birth_date',
        'cin',
        'education_level',
        'profession',
        'social_links',
        'project_title',
        'prior_work_link',
        'candidate_presentation',
        'project_presentation',
        'main_message',
        'motivation',
        'bio',
        'original_video_link',
        'original_video_path',
        'portfolio_path',
        'pdf_dossier_path',
        'declared_under_30',
        'declared_accuracy',
        'declared_rights',
        'accepted_rules',
        'locale',
        'ip',
        'user_agent',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'declared_under_30' => 'boolean',
        'declared_accuracy' => 'boolean',
        'declared_rights' => 'boolean',
        'accepted_rules' => 'boolean',
    ];

    protected $appends = ['original_video_url', 'portfolio_url', 'pdf_dossier_url'];

    public function edition(): BelongsTo
    {
        return $this->belongsTo(TililabEdition::class, 'tililab_edition_id');
    }

    public function getOriginalVideoUrlAttribute(): ?string
    {
        return $this->original_video_path
            ? route('admin.tililab.participants.file', ['participant' => $this->id, 'type' => 'video'])
            : null;
    }

    public function getPortfolioUrlAttribute(): ?string
    {
        return $this->portfolio_path
            ? route('admin.tililab.participants.file', ['participant' => $this->id, 'type' => 'portfolio'])
            : null;
    }

    public function getPdfDossierUrlAttribute(): ?string
    {
        return $this->pdf_dossier_path
            ? route('admin.tililab.participants.file', ['participant' => $this->id, 'type' => 'pdf'])
            : null;
    }

    /**
     * @return list<string>
     */
    public function storedFilePaths(): array
    {
        return array_values(array_filter([
            $this->original_video_path,
            $this->portfolio_path,
            $this->pdf_dossier_path,
        ]));
    }
}
