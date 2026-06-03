<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TililabEdition;
use App\Models\TililabParticipant;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TililabParticipantController extends Controller
{
    public function index(Request $request): Response
    {
        $query = $this->filteredQuery($request);

        $total = TililabParticipant::query()->count();
        $last7Days = TililabParticipant::query()
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        return Inertia::render('admin/tililab/participants/index', [
            'participants' => $query->paginate(15)->withQueryString(),
            'kpis' => [
                'total' => $total,
                'last7Days' => $last7Days,
            ],
            'filters' => $this->filterState($request),
            'editions' => TililabEdition::query()
                ->orderByDesc('year')
                ->orderBy('sort')
                ->orderByDesc('id')
                ->get(['id', 'year', 'is_current', 'edition_label']),
            'countries' => TililabParticipant::query()
                ->whereNotNull('country')
                ->where('country', '!=', '')
                ->distinct()
                ->orderBy('country')
                ->pluck('country')
                ->values(),
        ]);
    }

    public function show(TililabParticipant $participant): Response
    {
        $participant->load('edition:id,year,edition_label,is_current');

        return Inertia::render('admin/tililab/participants/show', [
            'participant' => $participant,
        ]);
    }

    public function destroy(TililabParticipant $participant): RedirectResponse
    {
        $participant->delete();

        return redirect()->route('admin.tililab.participants.index')
            ->with('success', 'Participant deleted.');
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $query = $this->filteredQuery($request);

        $filename = 'tililab-participants-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () use ($query): void {
            $out = fopen('php://output', 'w');
            if ($out === false) {
                return;
            }

            fwrite($out, "\xEF\xBB\xBF");
            $delimiter = ';';

            fputcsv($out, [
                'id',
                'edition_year',
                'first_name',
                'last_name',
                'email',
                'phone',
                'city',
                'country',
                'bio',
                'original_video_link',
                'original_video_url',
                'locale',
                'ip',
                'created_at',
            ], $delimiter);

            $query->with('edition:id,year')->chunkById(200, function ($rows) use ($out, $delimiter): void {
                foreach ($rows as $p) {
                    /** @var TililabParticipant $p */
                    fputcsv($out, [
                        $p->id,
                        (string) ($p->edition?->year ?? ''),
                        (string) ($p->first_name ?? ''),
                        (string) ($p->last_name ?? ''),
                        (string) ($p->email ?? ''),
                        (string) ($p->phone ?? ''),
                        (string) ($p->city ?? ''),
                        (string) ($p->country ?? ''),
                        (string) ($p->bio ?? ''),
                        (string) ($p->original_video_link ?? ''),
                        (string) ($p->original_video_url ?? ''),
                        (string) ($p->locale ?? ''),
                        (string) ($p->ip ?? ''),
                        optional($p->created_at)->toIso8601String(),
                    ], $delimiter);
                }
            });

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * @return Builder<TililabParticipant>
     */
    private function filteredQuery(Request $request): Builder
    {
        $query = TililabParticipant::query()
            ->with('edition:id,year,edition_label,is_current')
            ->orderByDesc('created_at');

        $this->applyListFilters($request, $query);

        return $query;
    }

    /**
     * @param  Builder<TililabParticipant>  $query
     */
    private function applyListFilters(Request $request, Builder $query): void
    {
        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('first_name', 'like', $like)
                    ->orWhere('last_name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('bio', 'like', $like)
                    ->orWhere('phone', 'like', $like)
                    ->orWhere('country', 'like', $like)
                    ->orWhere('city', 'like', $like);
            });
        }

        $editionId = (string) $request->query('edition_id', '');
        if ($editionId === 'none') {
            $query->whereNull('tililab_edition_id');
        } elseif ($editionId !== '' && ctype_digit($editionId)) {
            $query->where('tililab_edition_id', (int) $editionId);
        }

        if ($country = trim((string) $request->query('country', ''))) {
            $query->where('country', $country);
        }

        if ($from = $this->parseFilterDate($request->query('from'))) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to = $this->parseFilterDate($request->query('to'))) {
            $query->whereDate('created_at', '<=', $to);
        }
    }

    /**
     * @return array<string, string>
     */
    private function filterState(Request $request): array
    {
        return [
            'search' => (string) $request->query('search', ''),
            'edition_id' => (string) $request->query('edition_id', ''),
            'country' => (string) $request->query('country', ''),
            'from' => (string) $request->query('from', ''),
            'to' => (string) $request->query('to', ''),
        ];
    }

    private function parseFilterDate(mixed $value): ?Carbon
    {
        if (! is_string($value) || trim($value) === '') {
            return null;
        }

        try {
            return Carbon::parse($value)->startOfDay();
        } catch (\Throwable) {
            return null;
        }
    }
}
