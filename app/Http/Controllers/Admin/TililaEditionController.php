<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TililaEdition;
use App\Support\YoutubeVideo;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TililaEditionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = TililaEdition::query()->orderByDesc('year')->orderBy('sort')->orderByDesc('id');

        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('year', 'like', $like)
                    ->orWhere('winners_url', 'like', $like)
                    ->orWhere('jury_url', 'like', $like)
                    ->orWhere('gallery_url', 'like', $like)
                    ->orWhere('edition_label->en', 'like', $like)
                    ->orWhere('edition_label->fr', 'like', $like)
                    ->orWhere('edition_label->ar', 'like', $like)
                    ->orWhere('theme->en', 'like', $like)
                    ->orWhere('theme->fr', 'like', $like)
                    ->orWhere('theme->ar', 'like', $like);
            });
        }

        return Inertia::render('admin/tilila/editions/index', [
            'editions' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'search' => $request->query('search', ''),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tilila/editions/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['sort'] = (int) (TililaEdition::query()->max('sort') ?? 0) + 1;

        $cover = $request->file('cover_image');
        if ($cover instanceof UploadedFile && $cover->isValid()) {
            $data['cover_image_path'] = $cover->store('tilila-editions/covers', 'public');
        } else {
            $data['cover_image_path'] = ($data['cover_image_path'] ?? null) ?: null;
        }

        $edition = TililaEdition::query()->create($data);

        $edition->winners = $this->applyPeopleUploads($request, 'winners', 'tilila-editions/winners', []);
        $edition->jury = $this->applyPeopleUploads($request, 'jury', 'tilila-editions/jury', []);
        $edition->save();

        $this->applyGalleryUploads($request, $edition, []);

        return redirect()->route('admin.tilila.editions.index')->with('success', 'Edition created.');
    }

    public function edit(TililaEdition $edition): Response
    {
        return Inertia::render('admin/tilila/editions/edit', [
            'edition' => $edition,
        ]);
    }

    public function update(Request $request, TililaEdition $edition): RedirectResponse
    {
        $data = $this->validated($request);

        $cover = $request->file('cover_image');
        if ($cover instanceof UploadedFile && $cover->isValid()) {
            $old = $edition->cover_image_path;
            if (is_string($old) && $old !== '') {
                Storage::disk('public')->delete($old);
            }
            $data['cover_image_path'] = $cover->store('tilila-editions/covers', 'public');
        } else {
            // Keep existing unless explicitly cleared.
            $data['cover_image_path'] = ($data['cover_image_path'] ?? null) ?: $edition->cover_image_path;
        }

        $edition->update($data);

        $existingWinners = is_array($edition->winners) ? $edition->winners : [];
        $existingJury = is_array($edition->jury) ? $edition->jury : [];

        $edition->winners = $this->applyPeopleUploads(
            $request,
            'winners',
            'tilila-editions/winners',
            $existingWinners,
        );
        $edition->jury = $this->applyPeopleUploads(
            $request,
            'jury',
            'tilila-editions/jury',
            $existingJury,
        );
        $edition->save();

        $existing = is_array($edition->gallery_images) ? $edition->gallery_images : [];
        $this->applyGalleryUploads($request, $edition, $existing);

        return redirect()->route('admin.tilila.editions.index')->with('success', 'Edition updated.');
    }

    public function destroy(TililaEdition $edition): RedirectResponse
    {
        if (is_string($edition->cover_image_path) && $edition->cover_image_path !== '') {
            Storage::disk('public')->delete($edition->cover_image_path);
        }

        $winners = is_array($edition->winners) ? $edition->winners : [];
        foreach ($winners as $row) {
            if (! is_array($row)) {
                continue;
            }
            $path = $row['photo_path'] ?? null;
            if (is_string($path) && $path !== '') {
                Storage::disk('public')->delete($path);
            }
        }
        $jury = is_array($edition->jury) ? $edition->jury : [];
        foreach ($jury as $row) {
            if (! is_array($row)) {
                continue;
            }
            $path = $row['photo_path'] ?? null;
            if (is_string($path) && $path !== '') {
                Storage::disk('public')->delete($path);
            }
        }

        $images = is_array($edition->gallery_images) ? $edition->gallery_images : [];
        foreach ($images as $path) {
            if (is_string($path) && $path !== '') {
                Storage::disk('public')->delete($path);
            }
        }
        $edition->delete();

        return redirect()->route('admin.tilila.editions.index')->with('success', 'Edition deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'year' => ['required', 'string', 'max:8'],
            'edition_label' => ['required', 'array'],
            'edition_label.en' => ['required', 'string', 'max:255'],
            'edition_label.fr' => ['nullable', 'string', 'max:255'],
            'edition_label.ar' => ['nullable', 'string', 'max:255'],
            'theme' => ['nullable', 'array'],
            'theme.en' => ['nullable', 'string', 'max:255'],
            'theme.fr' => ['nullable', 'string', 'max:255'],
            'theme.ar' => ['nullable', 'string', 'max:255'],
            'cover_image_path' => ['nullable', 'string', 'max:500'],
            'winners' => ['nullable', 'array'],
            'winners.*.full_name' => ['nullable', 'string', 'max:255'],
            'winners.*.trophy' => ['nullable', 'array'],
            'winners.*.trophy.en' => ['nullable', 'string', 'max:255'],
            'winners.*.trophy.fr' => ['nullable', 'string', 'max:255'],
            'winners.*.trophy.ar' => ['nullable', 'string', 'max:255'],
            'winners.*.bio' => ['nullable', 'array'],
            'winners.*.bio.en' => ['nullable', 'string', 'max:800'],
            'winners.*.bio.fr' => ['nullable', 'string', 'max:800'],
            'winners.*.bio.ar' => ['nullable', 'string', 'max:800'],
            'winners.*.photo_path' => ['nullable', 'string', 'max:500'],
            'jury' => ['nullable', 'array'],
            'jury.*.full_name' => ['nullable', 'string', 'max:255'],
            'jury.*.bio' => ['nullable', 'array'],
            'jury.*.bio.en' => ['nullable', 'string', 'max:800'],
            'jury.*.bio.fr' => ['nullable', 'string', 'max:800'],
            'jury.*.bio.ar' => ['nullable', 'string', 'max:800'],
            'jury.*.photo_path' => ['nullable', 'string', 'max:500'],
            'winners_url' => ['nullable', 'url', 'max:2048'],
            'jury_url' => ['nullable', 'url', 'max:2048'],
            'gallery_url' => ['nullable', 'url', 'max:2048'],
            'ceremony_video_url' => ['nullable', 'string', 'max:2048'],
            'has_gallery' => ['sometimes', 'boolean'],
            'remove_gallery_images' => ['nullable', 'array'],
            'remove_gallery_images.*' => ['string', 'max:500'],
        ]);

        if ($request->hasFile('cover_image')) {
            $request->validate([
                'cover_image' => ['file', 'image', 'max:10240'],
            ]);
        }

        if ($request->hasFile('gallery_images_files')) {
            $request->validate([
                'gallery_images_files' => ['array'],
                'gallery_images_files.*' => ['file', 'image', 'max:10240'],
            ]);
        }

        // Optional multiple photos for winners/jury rows.
        if ($request->hasFile('winners')) {
            $request->validate([
                'winners' => ['array'],
                'winners.*.photo' => ['nullable', 'file', 'image', 'max:10240'],
            ]);
        }
        if ($request->hasFile('jury')) {
            $request->validate([
                'jury' => ['array'],
                'jury.*.photo' => ['nullable', 'file', 'image', 'max:10240'],
            ]);
        }

        $data['edition_label'] = array_merge(['en' => '', 'fr' => '', 'ar' => ''], $data['edition_label'] ?? []);
        $data['theme'] = array_merge(['en' => '', 'fr' => '', 'ar' => ''], $data['theme'] ?? []);

        $data['winners'] = is_array($data['winners'] ?? null) ? $data['winners'] : [];
        $data['jury'] = is_array($data['jury'] ?? null) ? $data['jury'] : [];

        $data['winners_url'] = ($data['winners_url'] ?? null) ?: null;
        $data['jury_url'] = ($data['jury_url'] ?? null) ?: null;
        $data['gallery_url'] = ($data['gallery_url'] ?? null) ?: null;

        $ceremonyUrl = trim((string) ($data['ceremony_video_url'] ?? ''));
        if ($ceremonyUrl !== '' && YoutubeVideo::embedUrlFromInput($ceremonyUrl) === null) {
            throw ValidationException::withMessages([
                'ceremony_video_url' => 'Enter a valid YouTube link (watch, live, shorts, youtu.be, or embed).',
            ]);
        }
        $data['ceremony_video_url'] = $ceremonyUrl === '' ? null : $ceremonyUrl;

        // Checkbox can be absent in requests.
        $data['has_gallery'] = (bool) ($data['has_gallery'] ?? false);

        return $data;
    }

    /**
     * @param  list<string>  $existing
     */
    private function applyGalleryUploads(Request $request, TililaEdition $edition, array $existing): void
    {
        $toRemove = $request->input('remove_gallery_images', []);
        $toRemove = is_array($toRemove) ? array_values(array_filter($toRemove, 'is_string')) : [];

        $kept = [];
        foreach ($existing as $path) {
            if (! is_string($path) || $path === '') {
                continue;
            }
            if (in_array($path, $toRemove, true)) {
                Storage::disk('public')->delete($path);
                continue;
            }
            $kept[] = $path;
        }

        $new = [];
        $files = $request->file('gallery_images_files');
        if (is_array($files)) {
            foreach ($files as $file) {
                if (! $file instanceof UploadedFile) {
                    continue;
                }
                if (! $file->isValid()) {
                    continue;
                }
                $new[] = $file->store('tilila-editions/gallery', 'public');
            }
        }

        $galleryImages = array_values(array_filter(array_merge($kept, $new), fn ($p) => is_string($p) && $p !== ''));
        $edition->gallery_images = $galleryImages;
        $edition->has_gallery = $edition->has_gallery || count($galleryImages) > 0;
        $edition->save();
    }

    /**
     * @param  list<array<string, mixed>>  $existing
     * @return list<array<string, mixed>>
     */
    private function applyPeopleUploads(
        Request $request,
        string $key,
        string $storageDir,
        array $existing,
    ): array {
        $incoming = $request->input($key, []);
        $incoming = is_array($incoming) ? array_values($incoming) : [];

        $keepPaths = [];
        $rows = [];

        foreach (array_values($incoming) as $idx => $row) {
            if (! is_array($row)) {
                continue;
            }

            $fullName = trim((string) ($row['full_name'] ?? ''));
            if ($fullName === '') {
                continue;
            }

            $bioIn = is_array($row['bio'] ?? null) ? $row['bio'] : [];
            $bio = [
                'en' => trim((string) ($bioIn['en'] ?? '')),
                'fr' => trim((string) ($bioIn['fr'] ?? '')),
                'ar' => trim((string) ($bioIn['ar'] ?? '')),
            ];

            $trophyIn = is_array($row['trophy'] ?? null) ? $row['trophy'] : [];
            $trophy = [
                'en' => trim((string) ($trophyIn['en'] ?? '')),
                'fr' => trim((string) ($trophyIn['fr'] ?? '')),
                'ar' => trim((string) ($trophyIn['ar'] ?? '')),
            ];

            $photoPath = null;
            $file = $request->file("$key.$idx.photo");
            if ($file instanceof UploadedFile && $file->isValid()) {
                $photoPath = $file->store($storageDir, 'public');
            } elseif (! empty($row['photo_path']) && is_string($row['photo_path'])) {
                $photoPath = $row['photo_path'];
            }

            if (is_string($photoPath) && $photoPath !== '') {
                $keepPaths[] = $photoPath;
            }

            $entry = [
                'full_name' => $fullName,
                'bio' => $bio,
                'photo_path' => $photoPath,
            ];

            if ($key === 'winners') {
                $entry['trophy'] = $trophy;
            }

            $rows[] = $entry;
        }

        // Delete old photos that are no longer referenced.
        foreach ($existing as $oldRow) {
            if (! is_array($oldRow)) {
                continue;
            }
            $oldPath = $oldRow['photo_path'] ?? null;
            if (is_string($oldPath) && $oldPath !== '' && ! in_array($oldPath, $keepPaths, true)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        return $rows;
    }
}

