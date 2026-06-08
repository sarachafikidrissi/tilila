<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TililaContestParticipant;
use App\Models\TililaEdition;
use App\Support\ParticipantFileStorage;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TililaContestParticipantController extends Controller
{
    public function index(Request $request): Response
    {
        $query = $this->filteredQuery($request);

        $total = TililaContestParticipant::query()->count();
        $last7Days = TililaContestParticipant::query()
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        return Inertia::render('admin/tilila/participants/index', [
            'participants' => $query->paginate(15)->withQueryString(),
            'kpis' => [
                'total' => $total,
                'last7Days' => $last7Days,
            ],
            'filters' => $this->filterState($request),
            'editions' => TililaEdition::query()
                ->orderByDesc('year')
                ->orderBy('sort')
                ->orderByDesc('id')
                ->get(['id', 'year', 'is_current', 'edition_label']),
            'countries' => TililaContestParticipant::query()
                ->whereNotNull('country')
                ->where('country', '!=', '')
                ->distinct()
                ->orderBy('country')
                ->pluck('country')
                ->values(),
        ]);
    }

    public function show(TililaContestParticipant $participant): Response
    {
        $participant->load('edition:id,year,edition_label,is_current');

        return Inertia::render('admin/tilila/participants/show', [
            'participant' => $participant,
        ]);
    }

    public function destroy(TililaContestParticipant $participant): RedirectResponse
    {
        ParticipantFileStorage::deleteMany($participant->storedFilePaths());
        $participant->delete();

        return redirect()->route('admin.tilila.participants.index')
            ->with('success', 'Submission deleted.');
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $query = $this->filteredQuery($request);

        $filename = 'tilila-submissions-'.now()->format('Ymd-His').'.csv';

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
                'representative_role',
                'email',
                'phone',
                'company',
                'brand',
                'agency',
                'city',
                'country',
                'campaign_title',
                'first_broadcast_date',
                'category',
                'creative_concept',
                'edi_contribution',
                'submission_link',
                'submission_video_url',
                'audio_url',
                'visual_url',
                'declared_accuracy',
                'declared_rights',
                'accepted_rules',
                'created_at',
            ], $delimiter);

            $query->with('edition:id,year')->chunkById(200, function ($rows) use ($out, $delimiter): void {
                foreach ($rows as $p) {
                    /** @var TililaContestParticipant $p */
                    fputcsv($out, [
                        $p->id,
                        (string) ($p->edition?->year ?? ''),
                        (string) ($p->first_name ?? ''),
                        (string) ($p->last_name ?? ''),
                        (string) ($p->representative_role ?? ''),
                        (string) ($p->email ?? ''),
                        (string) ($p->phone ?? ''),
                        (string) ($p->company ?? ''),
                        (string) ($p->brand ?? ''),
                        (string) ($p->agency ?? ''),
                        (string) ($p->city ?? ''),
                        (string) ($p->country ?? ''),
                        (string) ($p->campaign_title ?? ''),
                        optional($p->first_broadcast_date)->toDateString(),
                        (string) ($p->category ?? ''),
                        (string) ($p->creative_concept ?? ''),
                        (string) ($p->edi_contribution ?? ''),
                        (string) ($p->submission_link ?? ''),
                        (string) ($p->submission_video_url ?? ''),
                        (string) ($p->audio_url ?? ''),
                        (string) ($p->visual_url ?? ''),
                        $p->declared_accuracy ? 'yes' : 'no',
                        $p->declared_rights ? 'yes' : 'no',
                        $p->accepted_rules ? 'yes' : 'no',
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
     * @return Builder<TililaContestParticipant>
     */
    private function filteredQuery(Request $request): Builder
    {
        $query = TililaContestParticipant::query()
            ->with('edition:id,year,edition_label,is_current')
            ->orderByDesc('created_at');

        $this->applyListFilters($request, $query);

        return $query;
    }

    /**
     * @param  Builder<TililaContestParticipant>  $query
     */
    private function applyListFilters(Request $request, Builder $query): void
    {
        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('first_name', 'like', $like)
                    ->orWhere('last_name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('submission_title', 'like', $like)
                    ->orWhere('country', 'like', $like)
                    ->orWhere('city', 'like', $like);
            });
        }

        $editionId = (string) $request->query('edition_id', '');
        if ($editionId === 'none') {
            $query->whereNull('tilila_edition_id');
        } elseif ($editionId !== '' && ctype_digit($editionId)) {
            $query->where('tilila_edition_id', (int) $editionId);
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
