<?php

namespace App\Http\Controllers;

use App\Models\ExpertApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ExpertApplicationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('experts/become');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'full_name' => ['nullable', 'string', 'max:255'],
            'name_i18n' => ['nullable', 'array'],
            'name_i18n.en' => ['required_without:full_name', 'string', 'max:255'],
            'name_i18n.fr' => ['required_without:full_name', 'string', 'max:255'],
            'name_i18n.ar' => ['required_without:full_name', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('expert_applications', 'email')->where(
                    fn ($q) => $q->where('status', 'pending')
                ),
            ],
            'phone' => ['nullable', 'string', 'max:64'],
            'country' => ['nullable', 'string', 'max:120'],
            'city' => ['nullable', 'string', 'max:120'],
            'industries' => ['nullable', 'array'],
            'industries.*' => ['string', 'max:64'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:8'],
            'current_title' => ['nullable', 'string', 'max:255'],
            'title_i18n' => ['nullable', 'array'],
            'title_i18n.en' => ['required_without:current_title', 'string', 'max:255'],
            'title_i18n.fr' => ['required_without:current_title', 'string', 'max:255'],
            'title_i18n.ar' => ['required_without:current_title', 'string', 'max:255'],
            'expertise' => ['nullable', 'string', 'max:2000'],
            'expertise_i18n' => ['nullable', 'array'],
            'expertise_i18n.en' => ['required_without:expertise', 'string', 'max:2000'],
            'expertise_i18n.fr' => ['required_without:expertise', 'string', 'max:2000'],
            'expertise_i18n.ar' => ['required_without:expertise', 'string', 'max:2000'],
            'bio' => ['nullable', 'string', 'max:5000'],
            'bio_i18n' => ['nullable', 'array'],
            'bio_i18n.en' => ['required_without:bio', 'string', 'max:5000'],
            'bio_i18n.fr' => ['required_without:bio', 'string', 'max:5000'],
            'bio_i18n.ar' => ['required_without:bio', 'string', 'max:5000'],
            'linkedin_url' => ['nullable', 'url', 'max:2048'],
            'twitter_url' => ['nullable', 'url', 'max:2048'],
            'instagram_url' => ['nullable', 'url', 'max:2048'],
            'portfolio_url' => ['nullable', 'url', 'max:2048'],
            'locale' => ['nullable', 'string', 'max:8'],
            'cv' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ], [
            'email.unique' => 'You already have a pending application with this email.',
        ]);

        $cvPath = null;
        if ($request->hasFile('cv')) {
            $cvPath = $request->file('cv')->store('expert-applications/cv', 'public');
        }

        $nameI18n = $this->normalizeTri($data['name_i18n'] ?? null, $data['full_name'] ?? '');
        $titleI18n = $this->normalizeTri($data['title_i18n'] ?? null, $data['current_title'] ?? '');
        $expertiseI18n = $this->normalizeTri($data['expertise_i18n'] ?? null, $data['expertise'] ?? '');
        $bioI18n = $this->normalizeTri($data['bio_i18n'] ?? null, $data['bio'] ?? '');
        $socials = [
            'linkedin' => trim((string) ($data['linkedin_url'] ?? '')),
            'twitter' => trim((string) ($data['twitter_url'] ?? '')),
            'instagram' => trim((string) ($data['instagram_url'] ?? '')),
        ];
        $industries = array_values(array_unique(array_filter(array_map(
            static fn (string $item): string => trim($item),
            $data['industries'] ?? [],
        ))));
        $languages = array_values(array_unique(array_filter(array_map(
            static fn (string $item): string => trim($item),
            $data['languages'] ?? [],
        ))));

        ExpertApplication::query()->create([
            'full_name' => $nameI18n['en'],
            'name_i18n' => $nameI18n,
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'country' => $data['country'] ?? null,
            'city' => $data['city'] ?? null,
            'industries' => $industries,
            'languages' => $languages,
            'current_title' => $titleI18n['en'],
            'title_i18n' => $titleI18n,
            'expertise' => $expertiseI18n['en'],
            'expertise_i18n' => $expertiseI18n,
            'bio' => $bioI18n['en'],
            'bio_i18n' => $bioI18n,
            'socials' => $socials,
            'linkedin_url' => $socials['linkedin'] ?: null,
            'portfolio_url' => $data['portfolio_url'] ?? null,
            'cv_path' => $cvPath,
            'locale' => $data['locale'] ?? null,
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 1000),
            'status' => 'pending',
        ]);

        return back()->with('success', 'Your expert request was submitted successfully.');
    }

    /**
     * @param  array<string, mixed>|null  $value
     * @return array{en: string, fr: string, ar: string}
     */
    private function normalizeTri(?array $value, string $fallback = ''): array
    {
        $en = trim((string) ($value['en'] ?? $fallback));
        $fr = trim((string) ($value['fr'] ?? ''));
        $ar = trim((string) ($value['ar'] ?? ''));

        if ($fr === '') {
            $fr = $en;
        }
        if ($ar === '') {
            $ar = $en;
        }

        return [
            'en' => $en,
            'fr' => $fr,
            'ar' => $ar,
        ];
    }
}
