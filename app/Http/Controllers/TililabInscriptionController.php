<?php

namespace App\Http\Controllers;

use App\Models\TililabParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class TililabInscriptionController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', Rule::unique('tililab_participants', 'email')],
            'phone' => ['nullable', 'string', 'max:64'],
            'city' => ['nullable', 'string', 'max:64'],
            'country' => ['nullable', 'string', 'max:16'],
            'bio' => ['nullable', 'string', 'max:300'],
            'locale' => ['nullable', 'string', 'max:8'],

            // New: upload a video file (preferred). We keep the old link as optional backup.
            // At least one of (original_video, original_video_link) is required.
            'original_video' => [
                'nullable',
                'file',
                'mimetypes:video/mp4,video/webm,video/quicktime,video/x-matroska',
                // 200 MB (in KB)
                'max:204800',
                'required_without:original_video_link',
            ],
            'original_video_link' => [
                'nullable',
                'url',
                'max:2048',
                'required_without:original_video',
            ],
        ]);

        $videoPath = null;
        if ($request->hasFile('original_video')) {
            $videoPath = $request->file('original_video')->storePublicly(
                'tililab/participants/videos',
                'public'
            );
        }

        TililabParticipant::query()->create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'city' => $data['city'] ?? null,
            'country' => $data['country'] ?? null,
            'bio' => $data['bio'] ?? null,
            'original_video_link' => $data['original_video_link'] ?? null,
            'original_video_path' => $videoPath,
            'locale' => $data['locale'] ?? null,
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 1000),
        ]);

        return back()->with('success', 'Inscription submitted.');
    }
}

