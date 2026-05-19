<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use App\Models\ExpertOfMonth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

}
