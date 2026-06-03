<?php

namespace App\Http\Controllers;

use App\Mail\TililaParticipationReceipt;
use App\Models\TililaContestParticipant;
use App\Models\TililaEdition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Throwable;

class TililaParticipationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'city' => ['nullable', 'string', 'max:64'],
            'country' => ['nullable', 'string', 'max:16'],
            'submission_title' => ['nullable', 'string', 'max:255'],
            'submission_description' => ['nullable', 'string', 'max:5000'],
            'submission_link' => ['nullable', 'url', 'max:2048'],
            'submission_video' => [
                'nullable',
                'file',
                // Keep it permissive across browsers; mp4/webm/quicktime are common exports.
                'mimetypes:video/mp4,video/webm,video/quicktime,video/x-matroska',
                // 200 MB (in KB)
                'max:204800',
            ],
            'accepted_rules' => ['accepted'],
            'locale' => ['nullable', 'string', 'max:8'],
        ]);

        $currentEdition = TililaEdition::current();
        if ($currentEdition === null) {
            throw ValidationException::withMessages([
                'submission_title' => 'Submissions are not open for any edition at the moment.',
            ]);
        }

        $videoPath = null;
        if ($request->hasFile('submission_video')) {
            $videoPath = $request->file('submission_video')->storePublicly(
                'tilila/submissions/videos',
                'public'
            );
        }

        /** @var TililaContestParticipant $participant */
        $participant = TililaContestParticipant::query()->create([
            'tilila_edition_id' => $currentEdition->id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'city' => $data['city'] ?? null,
            'country' => $data['country'] ?? null,
            'submission_title' => $data['submission_title'] ?? null,
            'submission_description' => $data['submission_description'] ?? null,
            'submission_link' => $data['submission_link'] ?? null,
            'submission_video_path' => $videoPath,
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
