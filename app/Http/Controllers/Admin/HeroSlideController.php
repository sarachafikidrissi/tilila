<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class HeroSlideController extends Controller
{
    public function index(): Response
    {
        $slides = HeroSlide::query()
            ->ordered()
            ->get()
            ->map(fn (HeroSlide $s) => [
                'id' => $s->id,
                'slide_key' => $s->slide_key,
                'is_active' => $s->is_active,
                'sort_order' => $s->sort_order,
                'display_mode' => $s->display_mode,
                'display_type' => $s->display_type ?? 'banner',
                'path_prefix' => $s->path_prefix,
                'also_on_home' => (bool) $s->also_on_home,
                'media_type' => $s->media_type ?? 'image',
                'image_url' => $s->image_url,
                'video_url' => $s->video_url,
                'title_before' => $s->title_before,
                'title_accent' => $s->title_accent,
            ]);

        return Inertia::render('admin/hero-slides/index', [
            'slides' => $slides,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/hero-slides/create', [
            'displayTypeOptions' => ['banner', 'carousel'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('hero_slides', 'public');
        }

        $this->promoteTempVideoPath($data);

        // Auto-assign sort_order to the end when the admin leaves it at the default 0.
        if (! $request->filled('sort_order') || (int) $request->input('sort_order') === 0) {
            $data['sort_order'] = (int) (HeroSlide::query()->max('sort_order') ?? -1) + 1;
        }

        $slide = HeroSlide::query()->create($data);
        $this->syncDisplayTypeForPath($slide->path_prefix, (string) $data['display_type']);

        return redirect()->route('admin.hero-slides.index')->with('success', 'Hero slide created.');
    }

    public function edit(HeroSlide $heroSlide): Response
    {
        return Inertia::render('admin/hero-slides/edit', [
            'slide' => array_merge($heroSlide->toArray(), [
                'image_url' => $heroSlide->image_url,
                'video_url' => $heroSlide->video_url,
            ]),
            'displayTypeOptions' => ['banner', 'carousel'],
        ]);
    }

    public function update(Request $request, HeroSlide $heroSlide): RedirectResponse
    {
        $data = $this->validated($request, $heroSlide);

        $newMediaType = (string) ($data['media_type'] ?? 'image');
        $oldMediaType = (string) ($heroSlide->media_type ?? 'image');

        if ($newMediaType === 'image' && $oldMediaType === 'video') {
            if ($heroSlide->video_path) {
                $this->deleteStoredFile((string) $heroSlide->video_path);
            }
            $data['video_path'] = null;
        }

        if ($newMediaType === 'video' && $oldMediaType === 'image') {
            if ($heroSlide->image_path) {
                $this->deleteStoredFile((string) $heroSlide->image_path);
            }
            $data['image_path'] = null;
        }

        if ($request->hasFile('image')) {
            if ($heroSlide->image_path) {
                $this->deleteStoredFile((string) $heroSlide->image_path);
            }
            $data['image_path'] = $request->file('image')->store('hero_slides', 'public');
        }

        if (
            $newMediaType === $oldMediaType
            && array_key_exists('video_path', $data)
            && $data['video_path'] !== $heroSlide->video_path
            && $heroSlide->video_path
        ) {
            $this->deleteStoredFile((string) $heroSlide->video_path);
        }

        $this->promoteTempVideoPath($data);

        $heroSlide->update($data);
        $this->syncDisplayTypeForPath($heroSlide->path_prefix, (string) $data['display_type']);

        return redirect()->route('admin.hero-slides.index')->with('success', 'Hero slide updated.');
    }

    public function destroy(HeroSlide $heroSlide): RedirectResponse
    {
        $this->deleteStoredFile((string) $heroSlide->image_path);
        $this->deleteStoredFile((string) $heroSlide->video_path);
        $heroSlide->delete();

        return redirect()->route('admin.hero-slides.index')->with('success', 'Hero slide deleted.');
    }

    public function toggle(HeroSlide $heroSlide): RedirectResponse
    {
        $heroSlide->update(['is_active' => ! $heroSlide->is_active]);

        return redirect()->route('admin.hero-slides.index')->with('success', 'Hero slide status updated.');
    }

    public function toggleAlsoOnHome(HeroSlide $heroSlide): RedirectResponse
    {
        if (! $this->canHaveAlsoOnHome($heroSlide)) {
            return back()->with(
                'warning',
                'Only slides assigned to a page other than home can be added to the home carousel.',
            );
        }

        $heroSlide->update(['also_on_home' => ! $heroSlide->also_on_home]);

        return redirect()->route('admin.hero-slides.index')->with('success', 'Home carousel setting updated.');
    }

    public function uploadVideo(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'video' => 'required|file|mimes:mp4,webm',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first('video'),
            ], 422);
        }

        $path = $request->file('video')->store('hero_slides/videos/temp', 'public');

        return response()->json(['path' => $path]);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'required|integer|exists:hero_slides,id',
        ]);

        foreach ($request->input('ordered_ids') as $position => $id) {
            HeroSlide::query()->where('id', $id)->update(['sort_order' => $position]);
        }

        return redirect()->route('admin.hero-slides.index')->with('success', 'Order saved.');
    }

    /** @return array<string, mixed> */
    private function validated(Request $request, ?HeroSlide $slide = null): array
    {
        $slideKeyRule = $slide
            ? ['required', 'string', 'max:64', Rule::unique('hero_slides', 'slide_key')->ignore($slide->id)]
            : ['required', 'string', 'max:64', Rule::unique('hero_slides', 'slide_key')];

        $validated = $request->validate([
            'slide_key' => $slideKeyRule,
            'path_prefix' => ['nullable', 'string', 'max:255'],
            'display_type' => 'required|string|in:banner,carousel',
            'also_on_home' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'display_mode' => 'required|string|in:normal,banner_image',
            'image_contain' => 'boolean',
            'banner_image_contain' => 'boolean',
            'image_position' => 'nullable|string|max:32',
            'image_bg' => 'nullable|string|max:64',
            'media_type' => 'required|string|in:image,video',
            'video_path' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:8192',

            'image_alt' => 'nullable|array',
            'image_alt.en' => 'nullable|string|max:255',
            'image_alt.fr' => 'nullable|string|max:255',
            'image_alt.ar' => 'nullable|string|max:255',

            'badge' => 'nullable|array',
            'badge.en' => 'nullable|string|max:255',
            'badge.fr' => 'nullable|string|max:255',
            'badge.ar' => 'nullable|string|max:255',

            'kicker' => 'nullable|array',
            'kicker.en' => 'nullable|string|max:255',
            'kicker.fr' => 'nullable|string|max:255',
            'kicker.ar' => 'nullable|string|max:255',

            'title_before' => 'nullable|array',
            'title_before.en' => 'nullable|string|max:255',
            'title_before.fr' => 'nullable|string|max:255',
            'title_before.ar' => 'nullable|string|max:255',

            'title_accent' => 'nullable|array',
            'title_accent.en' => 'nullable|string|max:255',
            'title_accent.fr' => 'nullable|string|max:255',
            'title_accent.ar' => 'nullable|string|max:255',

            'description' => 'nullable|array',
            'description.en' => 'nullable|string|max:2000',
            'description.fr' => 'nullable|string|max:2000',
            'description.ar' => 'nullable|string|max:2000',

            'card_line' => 'nullable|array',
            'card_line.en' => 'nullable|string|max:500',
            'card_line.fr' => 'nullable|string|max:500',
            'card_line.ar' => 'nullable|string|max:500',

            'ctas' => 'nullable|array',
            'ctas.*.label' => 'required|array',
            'ctas.*.label.en' => 'required|string|max:255',
            'ctas.*.label.fr' => 'required|string|max:255',
            'ctas.*.label.ar' => 'required|string|max:255',
            'ctas.*.url' => 'nullable|string|max:2048',
            'ctas.*.style' => 'required|string|in:primary,secondary',
            'ctas.*.is_active' => 'boolean',
        ], [], [
            'ctas.*.label.en' => 'CTA label (EN)',
            'ctas.*.label.fr' => 'CTA label (FR)',
            'ctas.*.label.ar' => 'CTA label (AR)',
        ]);

        // Require at least one title locale for normal slides
        if (($validated['display_mode'] ?? 'normal') === 'normal') {
            $tb = $validated['title_before'] ?? [];
            $ta = $validated['title_accent'] ?? [];
            $hasBefore = ! empty(array_filter([$tb['en'] ?? '', $tb['fr'] ?? '', $tb['ar'] ?? '']));
            $hasAccent = ! empty(array_filter([$ta['en'] ?? '', $ta['fr'] ?? '', $ta['ar'] ?? '']));
            if (! $hasBefore && ! $hasAccent) {
                throw ValidationException::withMessages([
                    'title_before.en' => ['A title is required for normal display mode slides.'],
                ]);
            }
        }

        // Require every language's label per CTA (also rejects whitespace-only values).
        foreach (($validated['ctas'] ?? []) as $i => $cta) {
            $label = $cta['label'] ?? [];
            foreach (['en', 'fr', 'ar'] as $lang) {
                if (trim((string) ($label[$lang] ?? '')) === '') {
                    throw ValidationException::withMessages([
                        "ctas.{$i}.label.{$lang}" => ['A label is required in all languages (EN, FR, AR) for each CTA.'],
                    ]);
                }
            }
        }

        unset($validated['image']);

        $validated['path_prefix'] = $this->normalizePathPrefix($validated['path_prefix'] ?? null);

        if ($validated['path_prefix'] === null || $validated['path_prefix'] === '/') {
            $validated['also_on_home'] = false;
        }

        return $validated;
    }

    private function normalizePathPrefix(?string $prefix): ?string
    {
        if ($prefix === null) {
            return null;
        }

        $prefix = trim($prefix);

        if ($prefix === '') {
            return null;
        }

        if (! str_starts_with($prefix, '/')) {
            $prefix = '/'.$prefix;
        }

        $prefix = rtrim($prefix, '/');

        return $prefix === '' ? '/' : $prefix;
    }

    private function syncDisplayTypeForPath(?string $pathPrefix, string $displayType): void
    {
        $normalized = $this->normalizePathPrefix($pathPrefix);

        if ($normalized === null || $normalized === '/') {
            return;
        }

        HeroSlide::query()
            ->where('path_prefix', $normalized)
            ->update(['display_type' => $displayType]);
    }

    private function canHaveAlsoOnHome(HeroSlide $slide): bool
    {
        $normalized = $this->normalizePathPrefix($slide->path_prefix);

        return $normalized !== null && $normalized !== '/';
    }

    /** @param array<string, mixed> $data */
    private function promoteTempVideoPath(array &$data): void
    {
        if (
            ! isset($data['video_path'])
            || ! is_string($data['video_path'])
            || ! str_starts_with($data['video_path'], 'hero_slides/videos/temp/')
        ) {
            return;
        }

        $tempPath = $data['video_path'];
        $finalPath = 'hero_slides/videos/'.basename($tempPath);
        $disk = Storage::disk('public');

        if (! $disk->exists($tempPath)) {
            Log::warning('Temp video file not found during promotion', [
                'temp_path' => $tempPath,
            ]);
            $data['video_path'] = null;

            return;
        }

        try {
            $disk->move($tempPath, $finalPath);
            $data['video_path'] = $finalPath;
        } catch (\Exception $e) {
            Log::error('Failed to promote temp video file', [
                'temp_path' => $tempPath,
                'final_path' => $finalPath,
                'error' => $e->getMessage(),
            ]);
            throw new \RuntimeException(
                'The video could not be saved. Please re-upload and try again.',
                0,
                $e
            );
        }
    }

    private function deleteStoredFile(?string $path): void
    {
        if ($path && ! str_starts_with($path, '/')) {
            Storage::disk('public')->delete($path);
        }
    }
}
