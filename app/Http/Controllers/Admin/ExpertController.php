<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use App\Models\ExpertOfMonth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
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
        $expertOfMonths = ExpertOfMonth::query()
            ->with(['expert:id,name,title,image'])
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get()
            ->map(function (ExpertOfMonth $entry): array {
                return [
                    'id' => $entry->id,
                    'month' => $entry->month,
                    'year' => $entry->year,
                    'video_url' => $entry->video_url,
                    'expert' => $entry->expert
                        ? [
                            'id' => $entry->expert->id,
                            'name' => $entry->expert->name,
                            'title' => $entry->expert->title,
                            'image_url' => $entry->expert->image_url,
                        ]
                        : null,
                ];
            })
            ->values();

        return Inertia::render('admin/experts/index', [
            'experts' => $experts,
            'filters' => [
                'search' => $request->query('search', ''),
                'status' => $request->query('status', ''),
            ],
            'expertOfMonths' => $expertOfMonths,
        ]);
    }

    public function edit(Expert $expert): Response
    {
        return Inertia::render('admin/experts/edit', [
            'expert' => $this->expertToAdminForm($expert),
            'statuses' => $this->statuses(),
        ]);
    }

    public function update(Request $request, Expert $expert): RedirectResponse
    {
        $data = $this->validatedForUpdate($request);

        if ($request->boolean('remove_image') && $expert->image) {
            Storage::disk('public')->delete($expert->image);
            $data['image'] = null;
        }

        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                if ($expert->image) {
                    Storage::disk('public')->delete($expert->image);
                }
                $data['image'] = $file->store('experts/avatars', 'public');
            }
        }

        $expert->update([
            ...$data,
            'last_activity_at' => now(),
        ]);

        return redirect()
            ->route('admin.experts.edit', $expert)
            ->with('success', 'Expert updated.');
    }

    public function feature(Request $request, Expert $expert): RedirectResponse
    {
        $data = $request->validate([
            'on_front' => ['required', 'boolean'],
        ]);

        if ($expert->status !== 'published') {
            return back()->with('error', 'Only published experts can be featured.');
        }

        $expert->update([
            'on_front' => (bool) $data['on_front'],
        ]);

        return back()->with(
            'success',
            $expert->on_front
                ? 'Expert featured on the front section.'
                : 'Expert removed from the front section.'
        );
    }

    public function storeExpertOfMonth(Request $request, Expert $expert): RedirectResponse
    {
        if (! $expert->isPublished()) {
            return back()->with('error', 'Only published experts can be featured.');
        }

        $data = $request->validate([
            'month' => ['required', 'integer', 'between:1,12'],
            'year' => ['required', 'integer', 'between:2000,2100'],
            'video_url' => ['required', 'string', 'max:2048', 'url'],
        ]);

        ExpertOfMonth::query()->updateOrCreate(
            [
                'month' => (int) $data['month'],
                'year' => (int) $data['year'],
            ],
            [
                'expert_id' => $expert->id,
                'video_url' => $data['video_url'],
            ]
        );

        return back()->with('success', 'Expert of the month updated.');
    }

    public function updateExpertOfMonth(Request $request, ExpertOfMonth $expertOfMonth): RedirectResponse
    {
        $data = $request->validate([
            'video_url' => ['required', 'string', 'max:2048', 'url'],
        ]);

        $expertOfMonth->update([
            'video_url' => $data['video_url'],
        ]);

        return back()->with('success', 'Expert of the month updated.');
    }

    public function destroyExpertOfMonth(ExpertOfMonth $expertOfMonth): RedirectResponse
    {
        $expertOfMonth->delete();

        return back()->with('success', 'Expert of the month removed.');
    }

    /**
     * @return list<string>
     */
    private function statuses(): array
    {
        return ['draft', 'published'];
    }

    /**
     * @return array<string, mixed>
     */
    private function expertToAdminForm(Expert $expert): array
    {
        $tags = $expert->tags ?? [];

        return [
            'id' => $expert->id,
            'name' => $this->triLang($expert->name),
            'title' => $this->triLang($expert->title),
            'country' => (string) ($expert->country ?? ''),
            'region_scope' => (string) ($expert->region_scope ?? ''),
            'industries' => is_array($tags) ? $tags : [],
            'languages' => $expert->languages ?? [],
            'status' => (string) ($expert->status ?? 'draft'),
            'email' => $expert->email,
            'image_url' => $expert->image_url,
            'details' => is_array($expert->details) ? $expert->details : [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedForUpdate(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'array'],
            'name.en' => ['required', 'string', 'max:255'],
            'name.fr' => ['nullable', 'string', 'max:255'],
            'name.ar' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'array'],
            'title.en' => ['required', 'string', 'max:500'],
            'title.fr' => ['nullable', 'string', 'max:500'],
            'title.ar' => ['nullable', 'string', 'max:500'],
            'country' => ['required', 'string', 'max:120'],
            'region_scope' => ['nullable', 'string', 'max:32', Rule::in(['', 'morocco', 'africa', 'diaspora', 'other'])],
            'industries' => ['nullable', 'array'],
            'industries.*' => ['string', 'max:120'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:16'],
            'status' => ['required', 'string', Rule::in($this->statuses())],
            'email' => ['nullable', 'email', 'max:255'],
            'details' => ['nullable', 'array'],
            'profile_image' => ['nullable', 'file', 'max:5120', 'mimes:jpeg,png,webp,gif'],
            'remove_image' => ['sometimes', 'boolean'],
        ]);

        $regionScope = trim((string) ($validated['region_scope'] ?? ''));

        return [
            'name' => $this->triLang($validated['name'] ?? []),
            'title' => $this->triLang($validated['title'] ?? []),
            'country' => trim((string) $validated['country']),
            'region_scope' => $regionScope !== '' ? $regionScope : null,
            'tags' => array_values(array_unique(array_filter(array_map(
                static fn (mixed $value): string => trim((string) $value),
                $validated['industries'] ?? []
            )))),
            'languages' => array_values(array_unique(array_filter(array_map(
                static fn (mixed $value): string => trim((string) $value),
                $validated['languages'] ?? []
            )))),
            'status' => $validated['status'],
            'email' => ($email = trim((string) ($validated['email'] ?? ''))) !== '' ? $email : null,
            'details' => $this->normalizeDetailsInput($validated['details'] ?? null),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $details
     * @return array<string, mixed>
     */
    private function normalizeDetailsInput(?array $details): array
    {
        if (! is_array($details)) {
            return [];
        }

        $socials = is_array($details['socials'] ?? null) ? $details['socials'] : [];

        return [
            'bio' => is_array($details['bio'] ?? null) ? $details['bio'] : [],
            'socials' => [
                'linkedin' => trim((string) ($socials['linkedin'] ?? '')),
                'twitter' => trim((string) ($socials['twitter'] ?? '')),
                'instagram' => trim((string) ($socials['instagram'] ?? '')),
            ],
            'expertise' => is_array($details['expertise'] ?? null) ? $details['expertise'] : [],
        ];
    }

    /**
     * @return array{en: string, fr: string, ar: string}
     */
    private function triLang(mixed $value): array
    {
        if (! is_array($value)) {
            $text = trim((string) ($value ?? ''));

            return ['en' => $text, 'fr' => '', 'ar' => ''];
        }

        return [
            'en' => trim((string) ($value['en'] ?? '')),
            'fr' => trim((string) ($value['fr'] ?? '')),
            'ar' => trim((string) ($value['ar'] ?? '')),
        ];
    }

}
