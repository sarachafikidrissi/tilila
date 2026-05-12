<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExpertController extends Controller
{
    public function exportCsv(Request $request): StreamedResponse
    {
        $query = Expert::query()->orderByDesc('updated_at');

        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('email', 'like', $like)
                    ->orWhere('status', 'like', $like)
                    ->orWhere('country', 'like', $like)
                    ->orWhere('city_i18n->en', 'like', $like)
                    ->orWhere('city_i18n->fr', 'like', $like)
                    ->orWhere('city_i18n->ar', 'like', $like);

                foreach (['en', 'fr', 'ar'] as $loc) {
                    $q->orWhere("name->{$loc}", 'like', $like);
                }
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $filename = 'experts-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () use ($query): void {
            $out = fopen('php://output', 'w');
            if ($out === false) {
                return;
            }

            // Excel-friendly UTF-8 BOM
            fwrite($out, "\xEF\xBB\xBF");

            // Many Excel locales expect `;` as delimiter.
            $delimiter = ';';

            fputcsv($out, [
                'id',
                'name_en',
                'title_en',
                'email',
                'status',
                'country',
                'city',
            ], $delimiter);

            $query->chunkById(200, function ($rows) use ($out, $delimiter): void {
                foreach ($rows as $expert) {
                    /** @var Expert $expert */
                    fputcsv($out, [
                        $expert->id,
                        (string) ($expert->name['en'] ?? ''),
                        (string) ($expert->title['en'] ?? ''),
                        (string) ($expert->email ?? ''),
                        (string) ($expert->status ?? ''),
                        (string) ($expert->country ?? ''),
                        (string) ($expert->city_i18n['en'] ?? $expert->city_i18n['fr'] ?? $expert->city_i18n['ar'] ?? ''),
                    ], $delimiter);
                }
            });

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function index(Request $request): Response
    {
        $query = Expert::query()->orderByDesc('updated_at');

        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('email', 'like', $like)
                    ->orWhere('status', 'like', $like)
                    ->orWhere('country', 'like', $like)
                    ->orWhere('city_i18n->en', 'like', $like)
                    ->orWhere('city_i18n->fr', 'like', $like)
                    ->orWhere('city_i18n->ar', 'like', $like);

                foreach (['en', 'fr', 'ar'] as $loc) {
                    $q->orWhere("name->{$loc}", 'like', $like);
                }
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $experts = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/experts/index', [
            'experts' => $experts,
            'filters' => [
                'search' => $request->query('search', ''),
                'status' => $request->query('status', ''),
            ],
        ]);
    }

    public function edit(Expert $expert): Response
    {
        return Inertia::render('admin/experts/edit', [
            'expert' => $this->expertToForm($expert),
            'statuses' => ['draft', 'pending', 'published', 'suspended'],
        ]);
    }

    public function update(Request $request, Expert $expert): RedirectResponse
    {
        $data = $this->validated($request, $expert);

        if (($data['name']['en'] ?? '') !== ($expert->name['en'] ?? '')) {
            $data['slug'] = $this->uniqueSlugFromName($data['name']['en'], $expert->id);
        }

        $removeImage = (bool) ($data['remove_image'] ?? false);
        unset($data['remove_image']);

        if ($request->hasFile('profile_image')) {
            if ($expert->image) {
                Storage::disk('public')->delete($expert->image);
            }
            $data = array_merge($data, $this->storeProfileImageFromUpload($request->file('profile_image')));
        } elseif ($removeImage) {
            if ($expert->image) {
                Storage::disk('public')->delete($expert->image);
            }
            $data['image'] = null;
        } else {
            unset($data['image']);
        }

        $expert->update($data);

        return redirect()->route('admin.experts.index')
            ->with('success', 'Expert updated.');
    }

    public function destroy(Expert $expert): RedirectResponse
    {
        $expert->delete();

        return redirect()->route('admin.experts.index')
            ->with('success', 'Expert deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function expertToForm(Expert $expert): array
    {
        return [
            'id' => $expert->id,
            'name' => $expert->name,
            'title' => $expert->title,
            'tags' => $expert->tags ?? [],
            'country' => $expert->country,
            'languages' => $expert->languages ?? [],
            'status' => $expert->status,
            'email' => $expert->email,
            'image_url' => $expert->image_url,
            'details' => $this->normalizeDetailsForForm($expert->details),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $details
     * @return array<string, mixed>
     */
    private function normalizeDetailsForForm(?array $details): array
    {
        $base = [
            'bio' => [],
            'socials' => [
                'linkedin' => '',
                'twitter' => '',
                'instagram' => '',
            ],
            'expertise' => [],
        ];

        if (! is_array($details)) {
            return $base;
        }

        $base['bio'] = is_array($details['bio'] ?? null)
            ? $details['bio']
            : [];
        $socialIn = is_array($details['socials'] ?? null) ? $details['socials'] : [];
        $base['socials'] = [
            'linkedin' => trim((string) ($socialIn['linkedin'] ?? '')),
            'twitter' => trim((string) ($socialIn['twitter'] ?? '')),
            'instagram' => trim((string) ($socialIn['instagram'] ?? '')),
        ];
        $base['expertise'] = is_array($details['expertise'] ?? null)
            ? $details['expertise']
            : [];

        return $base;
    }

    /**
     * Persist file on the public disk; DB stores only the relative path in `image`.
     *
     * @return array{image: string}
     */
    private function storeProfileImageFromUpload(UploadedFile $file): array
    {
        return [
            'image' => $file->store('experts', 'public'),
        ];
    }

    private function uniqueSlugFromName(string $englishName, ?int $ignoreId = null): string
    {
        $base = Str::slug($englishName);
        if ($base === '') {
            $base = 'expert';
        }

        $slug = $base;
        $n = 1;

        while (
            Expert::query()
                ->when($ignoreId !== null, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$n++;
        }

        return $slug;
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Expert $expert = null): array
    {
        $validated = $request->validate([
            'name' => 'required|array',
            'name.en' => 'required|string|max:255',
            'name.fr' => 'nullable|string|max:255',
            'name.ar' => 'nullable|string|max:255',
            'title' => 'required|array',
            'title.en' => 'required|string|max:500',
            'title.fr' => 'nullable|string|max:500',
            'title.ar' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
            'country' => 'required|string|max:255',
            'languages' => 'nullable|array',
            'languages.*' => 'string|max:8',
            'status' => 'required|in:draft,pending,published,suspended',
            'email' => 'nullable|email|max:255',
            'remove_image' => 'sometimes|boolean',
            'details' => 'nullable|array',
        ]);

        if ($request->hasFile('profile_image')) {
            $request->validate([
                'profile_image' => ['required', 'file', 'max:5120', 'mimes:jpeg,png,webp,gif'],
            ]);
        }

        // Optional keys are omitted from $validated when absent — avoid undefined index (PHP 8+).
        $validated['tags'] = $validated['tags'] ?? [];
        $validated['languages'] = $validated['languages'] ?? [];

        $validated['details'] = $this->normalizeDetailsForForm($validated['details'] ?? null);

        return $validated;
    }
}
