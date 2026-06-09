<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TililabParticipant;
use App\Models\TililaContestParticipant;
use App\Support\ParticipantFileStorage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProgramParticipantFileController extends Controller
{
    public function tilila(TililaContestParticipant $participant, string $type): StreamedResponse
    {
        if ($type === 'video') {
            return $this->streamPath($participant->submission_video_path);
        }

        if ($type === 'audio') {
            return $this->streamPath($participant->audio_path);
        }

        if ($type === 'visual') {
            return $this->streamPath($participant->visual_path);
        }

        if (str_starts_with($type, 'extra-')) {
            $index = (int) substr($type, 6);
            $paths = $participant->extra_document_paths ?? [];

            return $this->streamPath($paths[$index] ?? null);
        }

        abort(404);
    }

    public function tililab(TililabParticipant $participant, string $type): StreamedResponse
    {
        $path = match ($type) {
            'video' => $participant->original_video_path,
            'portfolio' => $participant->portfolio_path,
            'pdf' => $participant->pdf_dossier_path,
            default => null,
        };

        return $this->streamPath($path);
    }

    private function streamPath(?string $path): StreamedResponse
    {
        abort_unless($path !== null && $path !== '' && ! str_contains($path, '..'), 404);

        $disk = ParticipantFileStorage::resolveDisk($path);
        abort_if($disk === null, 404);

        return $disk->response($path);
    }
}
