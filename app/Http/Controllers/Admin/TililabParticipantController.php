<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TililabParticipant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TililabParticipantController extends Controller
{
    public function index(Request $request): Response
    {
        $query = TililabParticipant::query()->orderByDesc('created_at');

        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('first_name', 'like', $like)
                    ->orWhere('last_name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('city', 'like', $like)
                    ->orWhere('country', 'like', $like);
            });
        }

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
            'filters' => [
                'search' => $request->query('search', ''),
            ],
        ]);
    }

    public function show(TililabParticipant $participant): Response
    {
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
        $query = TililabParticipant::query()->orderByDesc('created_at');

        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('first_name', 'like', $like)
                    ->orWhere('last_name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('city', 'like', $like)
                    ->orWhere('country', 'like', $like);
            });
        }

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
                'first_name',
                'last_name',
                'email',
                'phone',
                'city',
                'country',
                'bio',
                'original_video_link',
                'original_video_url',
                'created_at',
            ], $delimiter);

            $query->chunkById(200, function ($rows) use ($out, $delimiter): void {
                foreach ($rows as $p) {
                    /** @var TililabParticipant $p */
                    fputcsv($out, [
                        $p->id,
                        (string) ($p->first_name ?? ''),
                        (string) ($p->last_name ?? ''),
                        (string) ($p->email ?? ''),
                        (string) ($p->phone ?? ''),
                        (string) ($p->city ?? ''),
                        (string) ($p->country ?? ''),
                        (string) ($p->bio ?? ''),
                        (string) ($p->original_video_link ?? ''),
                        (string) ($p->original_video_url ?? ''),
                        optional($p->created_at)->toIso8601String(),
                    ], $delimiter);
                }
            });

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}

