<?php

use App\Models\TililaEdition;
use App\Models\TililabEdition;
use App\Support\ProgramTililabArchive;

it('reuses tilila ceremony video for matching tililab archive years', function () {
    TililaEdition::query()->create([
        'year' => '2024',
        'edition_label' => ['en' => '6th', 'fr' => '6e', 'ar' => '6'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'ceremony_video_url' => 'https://www.youtube.com/live/Tj03Erz0gGI',
        'winners' => [],
        'jury' => [],
        'sort' => 0,
        'is_current' => false,
    ]);

    $edition = TililabEdition::query()->create([
        'year' => '2024',
        'edition_label' => ['en' => '4th', 'fr' => '4e', 'ar' => '4'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'winners' => [],
        'jury' => [],
        'sort' => 0,
        'is_current' => false,
    ]);

    $edition->withArchiveEnrichment();

    expect($edition->ceremony_video_url)->toBe('https://www.youtube.com/live/Tj03Erz0gGI');
});

it('prefers a tililab-specific ceremony video when set', function () {
    TililaEdition::query()->create([
        'year' => '2023',
        'edition_label' => ['en' => '5th', 'fr' => '5e', 'ar' => '5'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'ceremony_video_url' => 'https://www.youtube.com/live/tilila-only',
        'winners' => [],
        'jury' => [],
        'sort' => 0,
        'is_current' => false,
    ]);

    $edition = TililabEdition::query()->create([
        'year' => '2023',
        'edition_label' => ['en' => '3rd', 'fr' => '3e', 'ar' => '3'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'ceremony_video_url' => 'https://www.youtube.com/live/tililab-custom',
        'winners' => [],
        'jury' => [],
        'sort' => 0,
        'is_current' => false,
    ]);

    $edition->withArchiveEnrichment();

    expect($edition->ceremony_video_url)->toBe('https://www.youtube.com/live/tililab-custom');
});

it('reuses tilila jury photos for matching tililab jury members', function () {
    TililaEdition::query()->create([
        'year' => '2024',
        'edition_label' => ['en' => '6th', 'fr' => '6e', 'ar' => '6'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'winners' => [],
        'jury' => [
            [
                'full_name' => 'Sanaa Akroud',
                'bio' => ['en' => 'Bio', 'fr' => 'Bio', 'ar' => 'Bio'],
                'photo_path' => 'tilila-editions/jury/sample.jpg',
            ],
        ],
        'sort' => 0,
        'is_current' => false,
    ]);

    $edition = TililabEdition::query()->create([
        'year' => '2024',
        'edition_label' => ['en' => '4th', 'fr' => '4e', 'ar' => '4'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'winners' => [],
        'jury' => [
            [
                'full_name' => 'Sanaa Akroud',
                'bio' => ['en' => 'Bio', 'fr' => 'Bio', 'ar' => 'Bio'],
                'photo_path' => null,
            ],
        ],
        'sort' => 0,
        'is_current' => false,
    ]);

    $edition->withArchiveEnrichment();

    expect($edition->jury[0]['photo_path'])->toBe('tilila-editions/jury/sample.jpg');
});

it('prefers a tililab-specific jury photo when already set', function () {
    TililaEdition::query()->create([
        'year' => '2023',
        'edition_label' => ['en' => '5th', 'fr' => '5e', 'ar' => '5'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'winners' => [],
        'jury' => [
            [
                'full_name' => 'Rabii Kati',
                'bio' => ['en' => 'Bio', 'fr' => 'Bio', 'ar' => 'Bio'],
                'photo_path' => 'tilila-editions/jury/tilila.jpg',
            ],
        ],
        'sort' => 0,
        'is_current' => false,
    ]);

    $edition = TililabEdition::query()->create([
        'year' => '2023',
        'edition_label' => ['en' => '3rd', 'fr' => '3e', 'ar' => '3'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'winners' => [],
        'jury' => [
            [
                'full_name' => 'Rabii Kati',
                'bio' => ['en' => 'Bio', 'fr' => 'Bio', 'ar' => 'Bio'],
                'photo_path' => 'tililab-editions/jury/custom.jpg',
            ],
        ],
        'sort' => 0,
        'is_current' => false,
    ]);

    $edition->withArchiveEnrichment();

    expect($edition->jury[0]['photo_path'])->toBe('tililab-editions/jury/custom.jpg');
});

it('does not override an uploaded archive video with tilila youtube fallback', function () {
    TililaEdition::query()->create([
        'year' => '2024',
        'edition_label' => ['en' => '6th', 'fr' => '6e', 'ar' => '6'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'ceremony_video_url' => 'https://www.youtube.com/live/tilila-fallback',
        'winners' => [],
        'jury' => [],
        'sort' => 0,
        'is_current' => false,
    ]);

    $edition = TililabEdition::query()->create([
        'year' => '2024',
        'edition_label' => ['en' => '4th', 'fr' => '4e', 'ar' => '4'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'ceremony_video_path' => 'tililab-editions/videos/custom.mp4',
        'winners' => [],
        'jury' => [],
        'sort' => 0,
        'is_current' => false,
    ]);

    $edition->withArchiveEnrichment();

    expect($edition->ceremony_video_path)->toBe('tililab-editions/videos/custom.mp4');
    expect($edition->ceremony_video_url)->toBeNull();
});
