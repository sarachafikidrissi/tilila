<?php

namespace App\Http\Controllers;

use App\Models\Opportunity;
use App\Models\OpportunityApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OpportunityController extends Controller
{
    public function index(Request $request): Response
    {
        // Public directory: load enough rows for client-side filtering/sorting.
        // If this grows, we can switch to server-side filters + pagination.
        $opportunities = Opportunity::query()
            ->orderByDesc('updated_at')
            ->limit(200)
            ->get()
            ->map(fn (Opportunity $o) => $this->toListItem($o));

        $basePath = str_starts_with($request->path(), 'learn/opportunities')
            ? '/learn/opportunities'
            : '/opportunities';

        return Inertia::render('opportunities/index', [
            'opportunities' => $opportunities,
            'opportunitiesBasePath' => $basePath,
        ]);
    }

    public function show(Request $request, Opportunity $opportunity): Response
    {
        $basePath = str_starts_with($request->path(), 'learn/opportunities')
            ? '/learn/opportunities'
            : '/opportunities';

        return Inertia::render('opportunities/[id]', [
            'opportunity' => $this->toDetailsItem($opportunity),
            'opportunitiesBasePath' => $basePath,
        ]);
    }

    public function apply(Request $request, Opportunity $opportunity)
    {
        abort_unless(
            in_array($opportunity->status, ['open', 'closing_soon'], true),
            422,
            'Applications are closed for this opportunity.',
        );

        if ($opportunity->applications_limit !== null && $opportunity->applications_limit <= 0) {
            abort(422, 'Applications are closed for this opportunity.');
        }

        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:64',
            'country' => 'nullable|string|max:32',
            'current_role' => 'nullable|string|max:255',
            'organization' => 'nullable|string|max:255',
            'years_experience' => 'nullable|string|max:32',
            'motivation' => 'nullable|string|max:5000',
            'locale' => 'nullable|string|max:8',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'portfolio_link' => 'nullable|url|max:2048',
        ]);

        $resumePath = null;
        if ($request->hasFile('resume')) {
            $resumePath = $request->file('resume')->store('opportunity-applications/resume', 'public');
        }

        DB::transaction(function () use ($request, $opportunity, $data, $resumePath): void {
            /** @var Opportunity $locked */
            $locked = Opportunity::query()->whereKey($opportunity->id)->lockForUpdate()->firstOrFail();

            if ($locked->applications_limit !== null && $locked->applications_limit <= 0) {
                abort(422, 'Applications are closed for this opportunity.');
            }

            OpportunityApplication::create([
                'opportunity_id' => $locked->id,
                'full_name' => $data['full_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'country' => $data['country'] ?? null,
                'current_role' => $data['current_role'] ?? null,
                'organization' => $data['organization'] ?? null,
                'years_experience' => $data['years_experience'] ?? null,
                'motivation' => $data['motivation'] ?? null,
                'resume_path' => $resumePath,
                'portfolio_link' => $data['portfolio_link'] ?? null,
                'locale' => $data['locale'] ?? null,
                'ip' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 1000),
            ]);

            $updates = [
                'applications_count' => (int) ($locked->applications_count ?? 0) + 1,
            ];

            if ($locked->applications_limit !== null) {
                $nextLimit = max(0, (int) $locked->applications_limit - 1);
                $updates['applications_limit'] = $nextLimit;
                if ($nextLimit === 0) {
                    $updates['status'] = 'filled';
                }
            }

            $locked->update($updates);
        });

        return back()->with('success', 'Application submitted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function toListItem(Opportunity $o): array
    {
        return [
            // Frontend currently uses `item.id` inside the URL.
            'id' => $o->slug,
            'type' => $o->type,
            'status' => $o->status,
            'title' => $o->title ?? ['en' => '', 'fr' => '', 'ar' => ''],
            'org' => $o->org ?? ['en' => '', 'fr' => '', 'ar' => ''],
            'location' => $o->location ?? ['en' => '', 'fr' => '', 'ar' => ''],
            'deadline' => $o->deadline?->format('Y-m-d'),
            'posted' => [
                'en' => $o->created_at?->diffForHumans() ?? '',
                'fr' => $o->created_at?->locale('fr')->diffForHumans() ?? '',
                'ar' => $o->created_at?->locale('ar')->diffForHumans() ?? '',
            ],
            'views' => $o->views ?? 0,
            'excerpt' => $o->excerpt ?? ['en' => '', 'fr' => '', 'ar' => ''],
        ];
    }

    /**
     * Provide the shape expected by `resources/js/pages/opportunities/[id].jsx`.
     *
     * @return array<string, mixed>
     */
    private function toDetailsItem(Opportunity $o): array
    {
        $deadline = $o->deadline;
        $deadlineLabel = $deadline ? $deadline->format('Y-m-d') : '';

        return [
            'id' => $o->slug,
            'slug' => $o->slug,
            'type' => $o->type,
            'status' => $o->status,
            'title' => $o->title ?? ['en' => '', 'fr' => '', 'ar' => ''],
            'org' => $o->org ?? ['en' => '', 'fr' => '', 'ar' => ''],
            'location' => $o->location ?? ['en' => '', 'fr' => '', 'ar' => ''],
            'deadline' => $deadline?->format('Y-m-d'),
            'posted' => [
                'en' => $o->created_at?->diffForHumans() ?? '',
                'fr' => $o->created_at?->locale('fr')->diffForHumans() ?? '',
                'ar' => $o->created_at?->locale('ar')->diffForHumans() ?? '',
            ],
            'views' => $o->views ?? 0,
            'excerpt' => $o->excerpt ?? ['en' => '', 'fr' => '', 'ar' => ''],

            // Formerly from `OPPORTUNITY_DETAILS` (mock). Keep keys so UI renders,
            // but derive minimal values from DB columns.
            'details' => [
                'badge' => null,
                'meta' => null,
                'description' => $o->excerpt ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'descriptionLong' => [],
                'programModules' => [],
                'organizer' => [
                    'name' => $o->org ?? ['en' => '', 'fr' => '', 'ar' => ''],
                    'blurb' => ['en' => '', 'fr' => '', 'ar' => ''],
                ],
                'quickInfo' => [
                    'location' => $o->location ?? ['en' => '', 'fr' => '', 'ar' => ''],
                    'duration' => ['en' => '', 'fr' => '', 'ar' => ''],
                    'language' => ['en' => '', 'fr' => '', 'ar' => ''],
                    'cost' => ['en' => '', 'fr' => '', 'ar' => ''],
                ],
                'relatedThemes' => [],
                'eligibility' => [],
                'deadline' => [
                    'label' => [
                        'en' => 'Application Deadline',
                        'fr' => 'Date limite de candidature',
                        'ar' => 'آخر موعد للتقديم',
                    ],
                    'dateLabel' => [
                        'en' => $deadlineLabel,
                        'fr' => $deadlineLabel,
                        'ar' => $deadlineLabel,
                    ],
                ],
                'howToApply' => [],
            ],
        ];
    }
}
