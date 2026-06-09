<?php

use App\Models\TililaEdition;
use App\Models\TililabEdition;
use App\Support\ProgramEditionHero;

it('normalizes empty tilila ceremony video fields to null', function () {
    $edition = TililaEdition::query()->create([
        'year' => '2021',
        'edition_label' => ['en' => '4th', 'fr' => '4e', 'ar' => '4'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'cover_image_path' => 'tilila-editions/covers/sample.jpg',
        'ceremony_video_url' => '   ',
        'winners' => [],
        'jury' => [],
        'sort' => 0,
        'is_current' => false,
    ]);

    $payload = ProgramEditionHero::forTilila($edition);

    expect($payload['ceremony_video_url'])->toBeNull();
    expect($payload['cover_image_path'])->toBe('tilila-editions/covers/sample.jpg');
});

it('keeps a stored tilila ceremony video url', function () {
    $edition = TililaEdition::query()->create([
        'year' => '2024',
        'edition_label' => ['en' => '6th', 'fr' => '6e', 'ar' => '6'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'ceremony_video_url' => 'https://www.youtube.com/live/Tj03Erz0gGI',
        'cover_image_path' => 'tilila-editions/covers/sample.jpg',
        'winners' => [],
        'jury' => [],
        'sort' => 0,
        'is_current' => false,
    ]);

    $payload = ProgramEditionHero::forTilila($edition);

    expect($payload['ceremony_video_url'])->toBe('https://www.youtube.com/live/Tj03Erz0gGI');
});

it('normalizes empty tililab ceremony video fields to null', function () {
    $edition = TililabEdition::query()->create([
        'year' => '2021',
        'edition_label' => ['en' => '1st', 'fr' => '1re', 'ar' => '1'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'cover_image_path' => 'tililab-editions/covers/sample.jpg',
        'ceremony_video_url' => null,
        'ceremony_video_path' => null,
        'winners' => [],
        'jury' => [],
        'sort' => 0,
        'is_current' => false,
    ]);

    $payload = ProgramEditionHero::forTililab($edition);

    expect($payload['ceremony_video_url'])->toBeNull();
    expect($payload['ceremony_video_path'])->toBeNull();
    expect($payload['cover_image_path'])->toBe('tililab-editions/covers/sample.jpg');
});

it('keeps stored tililab ceremony video path and url', function () {
    $edition = TililabEdition::query()->create([
        'year' => '2025',
        'edition_label' => ['en' => '5th', 'fr' => '5e', 'ar' => '5'],
        'theme' => ['en' => 'Theme', 'fr' => 'Thème', 'ar' => 'موضوع'],
        'ceremony_video_url' => 'https://www.youtube.com/live/yKYDLPWRRkU',
        'ceremony_video_path' => 'tililab-editions/videos/sample.mp4',
        'cover_image_path' => 'tililab-editions/covers/sample.jpg',
        'winners' => [],
        'jury' => [],
        'sort' => 0,
        'is_current' => false,
    ]);

    $payload = ProgramEditionHero::forTililab($edition);

    expect($payload['ceremony_video_url'])->toBe('https://www.youtube.com/live/yKYDLPWRRkU');
    expect($payload['ceremony_video_path'])->toBe('tililab-editions/videos/sample.mp4');
});
