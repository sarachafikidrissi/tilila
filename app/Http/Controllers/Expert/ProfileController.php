<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $expert = $this->resolveExpert($request);

        return Inertia::render('expert/profile-edit', [
            'expert' => $this->expertToForm($expert),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $expert = $this->resolveExpert($request);
        $data = $this->validated($request, $expert);
        $details = $data['details'];
        unset($data['details']);

        if ($request->hasFile('cv')) {
            $existingCvPath = trim((string) ($details['cv_path'] ?? ''));
            if ($existingCvPath !== '') {
                Storage::disk('public')->delete($existingCvPath);
            }
            $details['cv_path'] = $this->storeCvFromUpload($request->file('cv'));
        }

        if ($request->hasFile('profile_image')) {
            if ($expert->image) {
                Storage::disk('public')->delete($expert->image);
            }
            $data['image'] = $this->storeProfileImageFromUpload(
                $request->file('profile_image'),
            );
        }
        unset($data['profile_image']);

        $expert->update([
            ...$data,
            'details' => $details,
            'last_activity_at' => now(),
        ]);

        return back()->with('success', 'Your expert profile has been updated.');
    }

    private function resolveExpert(Request $request): Expert
    {
        return Expert::query()->where('user_id', $request->user()->id)->firstOrFail();
    }

    /**
     * @return array<string, mixed>
     */
    private function expertToForm(Expert $expert): array
    {
        $details = is_array($expert->details) ? $expert->details : [];
        $socials = is_array($details['socials'] ?? null) ? $details['socials'] : [];

        return [
            'id' => $expert->id,
            'name' => $this->triLangValue($expert->name),
            'title' => $this->triLangValue($expert->title),
            'expertise' => $this->resolveExpertiseForForm($details),
            'bio' => $this->resolveBioForForm($details),
            'country' => (string) ($expert->country ?? ''),
            'city' => $this->resolveCityForForm($expert),
            'languages' => $expert->languages ?? [],
            'email' => (string) ($expert->email ?? ''),
            'phone' => trim((string) ($details['phone'] ?? '')),
            'linkedin_url' => trim((string) ($socials['linkedin'] ?? '')),
            'twitter_url' => trim((string) ($socials['twitter'] ?? '')),
            'instagram_url' => trim((string) ($socials['instagram'] ?? '')),
            'portfolio_url' => trim((string) ($details['portfolio_url'] ?? '')),
            'image_url' => $expert->image_url,
            'cv_url' => $this->cvUrl($details),
        ];
    }

    /**
     * @return array<string, string>
     */
    private function triLangValue(mixed $value): array
    {
        if (is_array($value)) {
            return [
                'en' => trim((string) ($value['en'] ?? '')),
                'fr' => trim((string) ($value['fr'] ?? '')),
                'ar' => trim((string) ($value['ar'] ?? '')),
            ];
        }

        $text = trim((string) ($value ?? ''));

        return ['en' => $text, 'fr' => '', 'ar' => ''];
    }

    /**
     * @param  array<string, mixed>|null  $details
     * @return array<string, mixed>
     */
    private function normalizeDetailsForForm(?array $details): array
    {
        $base = [
            'bio' => [],
            'socials' => ['linkedin' => '', 'twitter' => '', 'instagram' => ''],
            'expertise' => [],
            'portfolio_url' => '',
            'phone' => '',
            'cv_path' => '',
        ];

        if (! is_array($details)) {
            return $base;
        }

        $socials = is_array($details['socials'] ?? null) ? $details['socials'] : [];

        return array_merge($base, $details, [
            'socials' => [
                'linkedin' => trim((string) ($socials['linkedin'] ?? '')),
                'twitter' => trim((string) ($socials['twitter'] ?? '')),
                'instagram' => trim((string) ($socials['instagram'] ?? '')),
            ],
            'portfolio_url' => trim((string) ($details['portfolio_url'] ?? '')),
            'phone' => trim((string) ($details['phone'] ?? '')),
            'cv_path' => trim((string) ($details['cv_path'] ?? '')),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, Expert $expert): array
    {
        $validated = $request->validate([
            'name' => ['required', 'array'],
            'name.en' => ['required', 'string', 'max:255'],
            'name.fr' => ['required', 'string', 'max:255'],
            'name.ar' => ['required', 'string', 'max:255'],
            'title' => ['required', 'array'],
            'title.en' => ['required', 'string', 'max:500'],
            'title.fr' => ['required', 'string', 'max:500'],
            'title.ar' => ['required', 'string', 'max:500'],
            'expertise' => ['required', 'array'],
            'expertise.en' => ['required', 'string', 'max:2000'],
            'expertise.fr' => ['required', 'string', 'max:2000'],
            'expertise.ar' => ['required', 'string', 'max:2000'],
            'bio' => ['required', 'array'],
            'bio.en' => ['required', 'string', 'max:5000'],
            'bio.fr' => ['required', 'string', 'max:5000'],
            'bio.ar' => ['required', 'string', 'max:5000'],
            'country' => ['nullable', 'string', 'max:120'],
            'city' => ['nullable', 'array'],
            'city.en' => ['nullable', 'string', 'max:120'],
            'city.fr' => ['nullable', 'string', 'max:120'],
            'city.ar' => ['nullable', 'string', 'max:120'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:16'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'linkedin_url' => ['nullable', 'url', 'max:2048'],
            'twitter_url' => ['nullable', 'url', 'max:2048'],
            'instagram_url' => ['nullable', 'url', 'max:2048'],
            'portfolio_url' => ['nullable', 'url', 'max:2048'],
            'profile_image' => ['nullable', 'file', 'max:5120', 'mimes:jpeg,png,webp,gif'],
        ]);

        if ($request->hasFile('cv')) {
            $request->validate([
                'cv' => ['required', 'file', 'max:5120', 'mimes:pdf,doc,docx'],
            ]);
        }

        $validated['name'] = $this->triLangValue($validated['name'] ?? []);
        $validated['title'] = $this->triLangValue($validated['title'] ?? []);
        $validated['expertise'] = $this->triLangValue($validated['expertise'] ?? []);
        $validated['bio'] = $this->triLangValue($validated['bio'] ?? []);
        $validated['country'] = trim((string) ($validated['country'] ?? ''));
        $validated['city'] = $this->triLangValue($validated['city'] ?? []);
        $validated['languages'] = array_values(array_unique(array_filter(array_map(
            static fn (string $value): string => trim($value),
            $validated['languages'] ?? []
        ))));
        $validated['email'] = trim((string) ($validated['email'] ?? ''));
        $validated['phone'] = trim((string) ($validated['phone'] ?? ''));
        $validated['linkedin_url'] = trim((string) ($validated['linkedin_url'] ?? ''));
        $validated['twitter_url'] = trim((string) ($validated['twitter_url'] ?? ''));
        $validated['instagram_url'] = trim((string) ($validated['instagram_url'] ?? ''));
        $validated['portfolio_url'] = trim((string) ($validated['portfolio_url'] ?? ''));

        $details = $this->normalizeDetailsForForm(is_array($expert->details) ? $expert->details : null);
        $details['phone'] = $validated['phone'];
        $details['portfolio_url'] = $validated['portfolio_url'];
        $details['expertise_text'] = $validated['expertise']['en'];
        $details['bio'] = [$validated['bio']];
        $details['socials'] = [
            'linkedin' => $validated['linkedin_url'],
            'twitter' => $validated['twitter_url'],
            'instagram' => $validated['instagram_url'],
        ];

        $validated['details'] = $details;

        unset(
            $validated['phone'],
            $validated['portfolio_url'],
            $validated['linkedin_url'],
            $validated['twitter_url'],
            $validated['instagram_url'],
            $validated['expertise'],
            $validated['bio']
        );
        $validated['city_i18n'] = $validated['city'];
        unset($validated['city']);

        return $validated;
    }

    /**
     * Persist CV file on public disk.
     */
    private function storeCvFromUpload(UploadedFile $file): string
    {
        return $file->store('experts/cv', 'public');
    }

    /**
     * @param  array<string, mixed>  $details
     */
    private function resolveExpertiseForForm(array $details): array
    {
        $fromBio = is_array($details['expertise'] ?? null) ? $details['expertise'] : [];
        $firstCard = is_array($fromBio[0] ?? null) ? $fromBio[0] : [];
        $description = is_array($firstCard['description'] ?? null) ? $firstCard['description'] : [];

        return $this->triLangValue([
            'en' => (string) ($details['expertise_text'] ?? $description['en'] ?? ''),
            'fr' => (string) ($description['fr'] ?? ''),
            'ar' => (string) ($description['ar'] ?? ''),
        ]);
    }

    /**
     * @param  array<string, mixed>  $details
     */
    private function resolveBioForForm(array $details): array
    {
        $bio = is_array($details['bio'] ?? null) ? $details['bio'] : [];
        $first = is_array($bio[0] ?? null) ? $bio[0] : [];

        return $this->triLangValue($first);
    }

    /**
     * @param  array<string, mixed>  $details
     */
    private function cvUrl(array $details): ?string
    {
        $path = trim((string) ($details['cv_path'] ?? ''));
        if ($path === '') {
            return null;
        }

        return Storage::disk('public')->exists($path) ? Storage::url($path) : null;
    }

    /**
     * @return array{en: string, fr: string, ar: string}
     */
    private function resolveCityForForm(Expert $expert): array
    {
        $cityFromColumn = is_array($expert->city_i18n) ? $expert->city_i18n : null;
        if ($cityFromColumn !== null) {
            return $this->triLangValue($cityFromColumn);
        }

        return $this->triLangValue(['en' => '', 'fr' => '', 'ar' => '']);
    }

    /**
     * Persist profile image on the public disk and return the stored path.
     */
    private function storeProfileImageFromUpload(UploadedFile $file): string
    {
        return $file->store('experts', 'public');
    }
}
