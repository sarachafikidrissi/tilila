<?php

namespace App\Http\Controllers;

use App\Mail\TililaParticipationReceipt;
use App\Models\TililaContestParticipant;
use App\Models\TililaEdition;
use App\Support\ParticipantFileStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Throwable;

class TililaParticipationController extends Controller
{
    public const CATEGORIES = [
        'hommage',
        'prix_jury',
        'prix_honneur',
        'communication_online',
        'communication_offline',
    ];

    public function store(Request $request)
    {
        $currentEdition = TililaEdition::current();
        if ($currentEdition === null || ! $currentEdition->applicationsAreOpen()) {
            throw ValidationException::withMessages([
                'company' => 'Submissions are not open for the current edition.',
            ]);
        }

        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'representative_role' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('tilila_contest_participants', 'email')
                    ->where('tilila_edition_id', $currentEdition->id),
            ],
            'phone' => ['required', 'string', 'max:64'],
            'company' => ['required', 'string', 'max:255'],
            'brand' => ['required', 'string', 'max:255'],
            'agency' => ['required', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:64'],
            'country' => ['nullable', 'string', 'max:16'],
            'campaign_title' => ['required', 'string', 'max:255'],
            'first_broadcast_date' => ['required', 'date'],
            'submission_link' => ['nullable', 'url', 'max:2048'],
            'category' => ['nullable', 'string', Rule::in(self::CATEGORIES)],
            'creative_concept' => ['required', 'string', 'max:5000'],
            'edi_contribution' => ['required', 'string', 'max:5000'],
            'submission_video' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime,video/x-matroska', 'max:204800'],
            'submission_audio' => ['nullable', 'file', 'mimetypes:audio/mpeg,audio/mp4,audio/wav,audio/x-wav', 'max:51200'],
            'submission_visual' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:20480'],
            'extra_documents' => ['nullable', 'array', 'max:5'],
            'extra_documents.*' => ['file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:20480'],
            'declared_accuracy' => ['accepted'],
            'declared_rights' => ['accepted'],
            'accepted_rules' => ['accepted'],
            'locale' => ['nullable', 'string', 'max:8'],
        ]);

        if (($data['category'] ?? null) === 'hommage') {
            throw ValidationException::withMessages([
                'category' => 'Hommage Tilila is not submitted through this form.',
            ]);
        }

        $videoPath = $request->hasFile('submission_video')
            ? ParticipantFileStorage::store($request->file('submission_video'), 'tilila/submissions/videos')
            : null;
        $audioPath = $request->hasFile('submission_audio')
            ? ParticipantFileStorage::store($request->file('submission_audio'), 'tilila/submissions/audio')
            : null;
        $visualPath = $request->hasFile('submission_visual')
            ? ParticipantFileStorage::store($request->file('submission_visual'), 'tilila/submissions/visuals')
            : null;

        $extraPaths = [];
        if ($request->hasFile('extra_documents')) {
            foreach ($request->file('extra_documents') as $file) {
                $extraPaths[] = ParticipantFileStorage::store($file, 'tilila/submissions/documents');
            }
        }

        /** @var TililaContestParticipant $participant */
        $participant = TililaContestParticipant::query()->create([
            'tilila_edition_id' => $currentEdition->id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'representative_role' => $data['representative_role'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'company' => $data['company'],
            'brand' => $data['brand'],
            'agency' => $data['agency'],
            'city' => $data['city'] ?? null,
            'country' => $data['country'] ?? null,
            'campaign_title' => $data['campaign_title'],
            'first_broadcast_date' => $data['first_broadcast_date'],
            'submission_title' => $data['campaign_title'],
            'submission_link' => $data['submission_link'] ?? null,
            'category' => $data['category'] ?? null,
            'creative_concept' => $data['creative_concept'],
            'edi_contribution' => $data['edi_contribution'],
            'submission_description' => $data['creative_concept'],
            'submission_video_path' => $videoPath,
            'audio_path' => $audioPath,
            'visual_path' => $visualPath,
            'extra_document_paths' => $extraPaths ?: null,
            'declared_accuracy' => true,
            'declared_rights' => true,
            'accepted_rules' => true,
            'locale' => $data['locale'] ?? null,
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 1000),
        ]);

        try {
            Mail::to($participant->email)->send(new TililaParticipationReceipt($participant));
        } catch (Throwable $e) {
            report($e);
        }

        return back()->with('success', 'Participation submitted.');
    }
}
