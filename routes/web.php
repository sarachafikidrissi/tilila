<?php

use App\Http\Controllers\AccessRequestController;
use App\Http\Controllers\ExpertApplicationController;
use App\Http\Controllers\ExpertArticleController;
use App\Http\Controllers\ExpertController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\NewsletterSubscriptionController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\TililabInscriptionController;
use App\Http\Controllers\TililaConnectController;
use App\Http\Controllers\TililaParticipationController;
use App\Models\Event;
use App\Models\Expert;
use App\Models\MediaItem;
use App\Models\TililabEdition;
use App\Models\TililaEdition;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    $tililaEdition = TililaEdition::query()
        ->orderByDesc('year')
        ->orderBy('sort')
        ->orderByDesc('id')
        ->first();

    $tililabEdition = TililabEdition::query()
        ->orderByDesc('year')
        ->orderBy('sort')
        ->orderByDesc('id')
        ->first();

    return Inertia::render('home/index', [
        'canRegister' => Features::enabled(Features::registration()),
        'tililaEdition' => $tililaEdition,
        'tililabEdition' => $tililabEdition,
        'stats' => [
            'experts_published' => Expert::query()->where('status', 'published')->count(),
            'countries_represented' => Expert::query()
                ->where('status', 'published')
                ->whereNotNull('country')
                ->where('country', '!=', '')
                ->distinct()
                ->count('country'),
            'events_and_editions' => Event::query()
                ->where('visibility', 'public')
                ->where('status', '!=', 'draft')
                ->count()
                + TililaEdition::query()->count()
                + TililabEdition::query()->count(),
        ],
        'featuredExperts' => Expert::query()
            ->where('status', 'published')
            ->orderByDesc('last_activity_at')
            ->orderByDesc('id')
            ->limit(3)
            ->get()
            ->map(fn (Expert $e) => $e->toDirectoryArray()),
        'latestMedia' => MediaItem::query()
            ->where('visibility', 'public')
            ->where('status', 'published')
            ->orderByDesc('updated_at')
            ->limit(6)
            ->get()
            ->map(fn (MediaItem $m) => [
                'id' => (string) $m->slug,
                'badge' => $m->badge ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'title' => $m->title ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'excerpt' => $m->excerpt ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'meta' => is_array($m->meta) ? $m->meta : ['en' => '', 'fr' => '', 'ar' => ''],
                'cta' => MediaItem::defaultCta(),
                'imageSrc' => $m->image_url,
            ]),
        'quickAgenda' => Event::query()
            ->where('visibility', 'public')
            ->where('status', '!=', 'draft')
            ->where(function ($q) {
                $q->where('status', 'live')
                    ->orWhere(function ($q2) {
                        $q2->whereIn('status', ['upcoming'])
                            ->whereNotNull('date')
                            ->whereDate('date', '>=', now()->toDateString());
                    });
            })
            ->orderByRaw("CASE WHEN status = 'live' THEN 0 ELSE 1 END")
            ->orderBy('date')
            ->orderBy('time')
            ->limit(3)
            ->get()
            ->map(function (Event $e) {
                $loc = $e->location ?? [];
                $locationLabel = trim((string) ($loc['en'] ?? ''));
                if ($locationLabel === '') {
                    $locationLabel = trim((string) ($loc['fr'] ?? $loc['ar'] ?? ''));
                }

                return [
                    'id' => $e->id,
                    'title' => $e->title ?? ['en' => '', 'fr' => '', 'ar' => ''],
                    'date' => $e->date?->format('Y-m-d') ?? '',
                    'time' => $e->time ? substr((string) $e->time, 0, 5) : null,
                    'timezone' => $e->timezone,
                    'status' => $e->status,
                    'type' => $e->type,
                    'locationLabel' => $locationLabel,
                    'href' => route('events.show', $e->id),
                ];
            }),
        'partners' => [
            ['name' => 'SOREAD 2M', 'href' => null],
            ['name' => 'Programme EDI Tilila', 'href' => null],
        ],
    ]);
})->name('home');

Route::permanentRedirect('/expertes', '/experts');

Route::get('/experts', [ExpertController::class, 'index'])->name('experts.index');
Route::get('/experts/connect', [TililaConnectController::class, 'create'])->name('experts.connect');
Route::post('/experts/connect', [TililaConnectController::class, 'store'])->name('experts.connect.store');
Route::get('/experts/become', [ExpertApplicationController::class, 'create'])->name('experts.become');
Route::post('/experts/become', [ExpertApplicationController::class, 'store'])->name('experts.become.store');
Route::get('/experts/articles/{article}', [ExpertArticleController::class, 'show'])->name('experts.articles.show');
Route::get('/experts/{expert}', [ExpertController::class, 'show'])
    ->middleware(['auth', 'verified', 'expert.access'])
    ->name('experts.show');

Route::post('/newsletter', [NewsletterSubscriptionController::class, 'store'])->name('newsletter.store');

Route::get('/plan-du-site', function () {
    return Inertia::render('legal/plan-du-site');
})->name('plan-du-site');

Route::get('/mentions-legales', function () {
    return Inertia::render('legal/mentions-legales');
})->name('mentions-legales');
Route::get('/opportunities', [OpportunityController::class, 'index'])->name('opportunities.index');
Route::get('/opportunities/{opportunity}', [OpportunityController::class, 'show'])->name('opportunities.show');
Route::post('/opportunities/{opportunity}/apply', [OpportunityController::class, 'apply'])->name('opportunities.apply');
Route::get('/about', function () {
    return Inertia::render('user/about/index');
});
Route::get('/contact', function () {
    return Inertia::render('contact/index');
})->name('contact');
Route::get('/tililab', function () {
    $currentEdition = TililabEdition::current();

    $pastEditions = TililabEdition::query()
        ->where('is_current', false)
        ->when(
            $currentEdition,
            fn ($q) => $q->where('id', '!=', $currentEdition->id),
        )
        ->orderByDesc('year')
        ->orderBy('sort')
        ->orderByDesc('id')
        ->get();

    return Inertia::render('user/tililab/index', [
        'currentEdition' => $currentEdition,
        'editions' => $pastEditions,
    ]);
});
Route::get('/tilila', function () {
    $currentEdition = TililaEdition::current();

    $pastEditions = TililaEdition::query()
        ->where('is_current', false)
        ->when(
            $currentEdition,
            fn ($q) => $q->where('id', '!=', $currentEdition->id),
        )
        ->orderByDesc('year')
        ->orderBy('sort')
        ->orderByDesc('id')
        ->get();

    return Inertia::render('user/tilila/index', [
        'currentEdition' => $currentEdition,
        'editions' => $pastEditions,
    ]);
});

Route::get('/tilila/editions/{edition}', function (TililaEdition $edition) {
    return Inertia::render('user/tilila/edition', [
        'edition' => $edition,
    ]);
});

Route::get('/tilila/editions/{edition}/gallery', function (TililaEdition $edition) {
    return Inertia::render('user/tilila/gallery', [
        'edition' => $edition,
    ]);
});

Route::get('/tilila/editions/{edition}/winners', function (TililaEdition $edition) {
    return Inertia::render('user/tilila/winners', [
        'edition' => $edition,
    ]);
});

Route::get('/tilila/editions/{edition}/jury', function (TililaEdition $edition) {
    return Inertia::render('user/tilila/jury', [
        'edition' => $edition,
    ]);
});

Route::get('/tilila/participate', function () {
    return Inertia::render('user/tilila/partials/ParticipateModal');
})->name('tilila.participate');

Route::get('/tililab/editions/{edition}', function (TililabEdition $edition) {
    return Inertia::render('user/tililab/edition', [
        'edition' => $edition,
    ]);
});

Route::post('/tilila/participate', [TililaParticipationController::class, 'store'])->name('tilila.participate.store');
Route::get('/tililab/form', function () {
    return Inertia::render('user/tililab/partials/FormOFInscription');
});
Route::post('/tililab/form', [TililabInscriptionController::class, 'store'])->name('tililab.form.store');
Route::get('/media', [MediaController::class, 'index'])->name('media.index');
Route::get('/media/{media}', [MediaController::class, 'show'])->name('media.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('access-request/create', [AccessRequestController::class, 'create'])->name('access-request.create');
    Route::post('access-request', [AccessRequestController::class, 'store'])
        ->middleware('throttle:5,60')
        ->name('access-request.store');
    Route::get('access-request/pending', [AccessRequestController::class, 'pending'])->name('access-request.pending');
    Route::get('access-request/rejected', [AccessRequestController::class, 'rejected'])->name('access-request.rejected');

    Route::get('dashboard', fn () => redirect()->route('admin.dashboard'))
        ->middleware('role:admin')
        ->name('dashboard');

    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        require __DIR__.'/admin.php';
    });

    Route::prefix('expert')->name('expert.')->middleware('role:expert')->group(function () {
        require __DIR__.'/expert.php';
    });
});

require __DIR__.'/events.php';
require __DIR__.'/learn.php';
require __DIR__.'/gouvernance.php';
require __DIR__.'/settings.php';
