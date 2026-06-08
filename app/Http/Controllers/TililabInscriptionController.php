<?php

namespace App\Http\Controllers;

use App\Models\TililabEdition;
use App\Models\TililabParticipant;
use App\Support\ParticipantFileStorage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TililabInscriptionController extends Controller
{
    public function store(Request $request)
    {
        $currentEdition = TililabEdition::current();
        if ($currentEdition === null || ! $currentEdition->applicationsAreOpen()) {
            throw ValidationException::withMessages([
                'email' => 'Applications are not open for the current edition.',
            ]);
        }

        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('tililab_participants', 'email')
                    ->where('tililab_edition_id', $currentEdition->id),
            ],
            'phone' => ['required', 'string', 'max:64'],
            'city' => ['required', 'string', 'max:64'],
            'country' => ['nullable', 'string', 'max:16'],
            'birth_date' => ['required', 'date', 'before:today'],
            'cin' => ['required', 'string', 'max:32'],
            'education_level' => ['required', 'string', 'max:255'],
            'profession' => ['required', 'string', 'max:255'],
            'social_links' => ['nullable', 'string', 'max:2048'],
            'project_title' => ['required', 'string', 'max:255'],
            'prior_work_link' => ['nullable', 'url', 'max:2048'],
            'candidate_presentation' => ['required', 'string', 'max:5000'],
            'project_presentation' => ['required', 'string', 'max:5000'],
            'main_message' => ['required', 'string', 'max:5000'],
            'motivation' => ['required', 'string', 'max:5000'],
            'bio' => ['nullable', 'string', 'max:300'],
            'original_video' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime,video/x-matroska', 'max:204800'],
            'original_video_link' => ['nullable', 'url', 'max:2048'],
            'portfolio_file' => ['nullable', 'file', 'mimes:pdf,zip', 'max:51200'],
            'pdf_dossier' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
            'declared_under_30' => ['accepted'],
            'declared_accuracy' => ['accepted'],
            'declared_rights' => ['accepted'],
            'accepted_rules' => ['accepted'],
            'locale' => ['nullable', 'string', 'max:8'],
        ]);

        $age = Carbon::parse($data['birth_date'])->age;
        if ($age >= 30) {
            throw ValidationException::withMessages([
                'birth_date' => 'You must be under 30 years old at the time of application.',
            ]);
        }

        if (! $request->hasFile('original_video') && blank($data['original_video_link'] ?? null)
            && ! $request->hasFile('portfolio_file') && ! $request->hasFile('pdf_dossier')) {
            throw ValidationException::withMessages([
                'original_video' => 'Provide a video, portfolio, or PDF dossier.',
            ]);
        }

        $videoPath = $request->hasFile('original_video')
            ? ParticipantFileStorage::store($request->file('original_video'), 'tililab/participants/videos')
            : null;
        $portfolioPath = $request->hasFile('portfolio_file')
            ? ParticipantFileStorage::store($request->file('portfolio_file'), 'tililab/participants/portfolios')
            : null;
        $pdfPath = $request->hasFile('pdf_dossier')
            ? ParticipantFileStorage::store($request->file('pdf_dossier'), 'tililab/participants/dossiers')
            : null;

        TililabParticipant::query()->create([
            'tililab_edition_id' => $currentEdition->id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'city' => $data['city'],
            'country' => $data['country'] ?? 'ma',
            'birth_date' => $data['birth_date'],
            'cin' => $data['cin'],
            'education_level' => $data['education_level'],
            'profession' => $data['profession'],
            'social_links' => $data['social_links'] ?? null,
            'project_title' => $data['project_title'],
            'prior_work_link' => $data['prior_work_link'] ?? null,
            'candidate_presentation' => $data['candidate_presentation'],
            'project_presentation' => $data['project_presentation'],
            'main_message' => $data['main_message'],
            'motivation' => $data['motivation'],
            'bio' => $data['bio'] ?? null,
            'original_video_link' => $data['original_video_link'] ?? null,
            'original_video_path' => $videoPath,
            'portfolio_path' => $portfolioPath,
            'pdf_dossier_path' => $pdfPath,
            'declared_under_30' => true,
            'declared_accuracy' => true,
            'declared_rights' => true,
            'accepted_rules' => true,
            'locale' => $data['locale'] ?? null,
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 1000),
        ]);

        return back()->with('success', 'Inscription submitted.');
    }
}
