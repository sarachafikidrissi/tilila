<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TililabEdition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TililabEditionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = TililabEdition::query()->orderByDesc('year')->orderBy('sort')->orderByDesc('id');

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

        return Inertia::render('admin/tililab/editions/index', [
            'editions' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'search' => $request->query('search', ''),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tililab/editions/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['sort'] = (int) (TililabEdition::query()->max('sort') ?? 0) + 1;

        $edition = TililabEdition::query()->create($data);

        $edition->winners = $this->applyPeopleUploads($request, 'winners', 'tililab-editions/winners', []);
        $edition->jury = $this->applyPeopleUploads($request, 'jury', 'tililab-editions/jury', []);
        $edition->save();

        $this->applyGalleryUploads($request, $edition, []);

        if (! empty($data['is_current'])) {
            TililabEdition::markAsCurrent($edition);
        }

        return redirect()->route('admin.tililab.editions.index')->with('success', 'Edition created.');
    }

    public function edit(TililabEdition $edition): Response
    {
        return Inertia::render('admin/tililab/editions/edit', [
            'edition' => $edition,
        ]);
    }

    public function update(Request $request, TililabEdition $edition): RedirectResponse
    {
        $data = $this->validated($request);
        $edition->update($data);

        $existingWinners = is_array($edition->winners) ? $edition->winners : [];
        $existingJury = is_array($edition->jury) ? $edition->jury : [];

        $edition->winners = $this->applyPeopleUploads(
            $request,
            'winners',
            'tililab-editions/winners',
            $existingWinners,
        );
        $edition->jury = $this->applyPeopleUploads(
            $request,
            'jury',
            'tililab-editions/jury',
            $existingJury,
        );
        $edition->save();

        $existing = is_array($edition->gallery_images) ? $edition->gallery_images : [];
        $this->applyGalleryUploads($request, $edition, $existing);

        if (! empty($data['is_current'])) {
            TililabEdition::markAsCurrent($edition->fresh());
        } elseif ($edition->is_current) {
            $edition->update(['is_current' => false]);
        }

        return redirect()->route('admin.tililab.editions.index')->with('success', 'Edition updated.');
    }

    public function destroy(TililabEdition $edition): RedirectResponse
    {
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

        return redirect()->route('admin.tililab.editions.index')->with('success', 'Edition deleted.');
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
            'winners' => ['nullable', 'array'],
            'winners.*.full_name' => ['nullable', 'string', 'max:255'],
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
            'has_gallery' => ['sometimes', 'boolean'],
            'is_current' => ['sometimes', 'boolean'],
            'applications_close_at' => ['nullable', 'date'],
            'remove_gallery_images' => ['nullable', 'array'],
            'remove_gallery_images.*' => ['string', 'max:500'],
        ]);

        if ($request->hasFile('gallery_images_files')) {
            $request->validate([
                'gallery_images_files' => ['array'],
                'gallery_images_files.*' => ['file', 'image', 'max:10240'],
            ]);
        }

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

        $data['has_gallery'] = (bool) ($data['has_gallery'] ?? false);
        $data['is_current'] = (bool) ($data['is_current'] ?? false);

        return $data;
    }

    /**
     * @param  list<string>  $existing
     */
    private function applyGalleryUploads(Request $request, TililabEdition $edition, array $existing): void
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
                $new[] = $file->store('tililab-editions/gallery', 'public');
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

        $existingByPath = [];
        foreach ($existing as $row) {
            if (! is_array($row)) {
                continue;
            }
            $path = $row['photo_path'] ?? null;
            if (is_string($path) && $path !== '') {
                $existingByPath[$path] = $row;
            }
        }

        $files = $request->file($key);
        $files = is_array($files) ? $files : [];

        $next = [];
        foreach ($incoming as $idx => $row) {
            if (! is_array($row)) {
                continue;
            }

            $bio = $row['bio'] ?? [];
            $bio = is_array($bio) ? $bio : [];

            $photoPath = is_string($row['photo_path'] ?? null) ? (string) $row['photo_path'] : null;

            $photoFile = null;
            if (isset($files[$idx]) && is_array($files[$idx]) && ($files[$idx]['photo'] ?? null) instanceof UploadedFile) {
                $photoFile = $files[$idx]['photo'];
            }

            if ($photoFile instanceof UploadedFile && $photoFile->isValid()) {
                if (is_string($photoPath) && $photoPath !== '') {
                    Storage::disk('public')->delete($photoPath);
                }
                $photoPath = $photoFile->store($storageDir, 'public');
            } elseif (is_string($photoPath) && $photoPath !== '' && ! array_key_exists($photoPath, $existingByPath)) {
                // If the client sent a photo_path that doesn't exist in our previous state, drop it.
                $photoPath = null;
            }

            $next[] = [
                'full_name' => is_string($row['full_name'] ?? null) ? (string) $row['full_name'] : '',
                'bio' => array_merge(['en' => '', 'fr' => '', 'ar' => ''], $bio),
                'photo_path' => $photoPath,
            ];
        }

        // Cleanup: remove photos that were present before but no longer referenced.
        $keptPaths = [];
        foreach ($next as $row) {
            $path = $row['photo_path'] ?? null;
            if (is_string($path) && $path !== '') {
                $keptPaths[$path] = true;
            }
        }
        foreach ($existingByPath as $path => $row) {
            if (! isset($keptPaths[$path])) {
                Storage::disk('public')->delete($path);
            }
        }

        return $next;
    }
}
