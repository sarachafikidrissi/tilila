<?php

namespace Database\Seeders;

use App\Models\TililaEdition;
use Database\Seeders\Concerns\SeedsTililaJury;
use Illuminate\Database\Seeder;

class TililaEditionSeeder extends Seeder
{
    use SeedsTililaJury;

    public function run(): void
    {
        TililaEdition::query()->where('year', '2020')->delete();

        foreach ($this->editions() as $row) {
            $year = (string) $row['year'];

            $payload = [
                'edition_label' => $row['edition_label'],
                'theme' => $row['theme'],
                'cover_image_path' => $row['cover_image_path'],
                'winners' => $row['winners'],
                'jury' => $row['jury'],
                'gallery_images' => [],
                'has_gallery' => false,
                'winners_url' => null,
                'jury_url' => null,
                'gallery_url' => null,
                'sort' => $this->sortForYear($year),
            ];

            $ceremonyUrl = $this->ceremonyVideoUrl($year);
            if ($ceremonyUrl !== null) {
                $payload['ceremony_video_url'] = $ceremonyUrl;
            }

            TililaEdition::query()->updateOrCreate(
                ['year' => $year],
                $payload,
            );
        }

        TililaEdition::query()->update(['is_current' => false]);

        $currentYear = (string) now()->year;
        $current = TililaEdition::query()->where('year', $currentYear)->first()
            ?? TililaEdition::query()->orderByDesc('year')->orderByDesc('id')->first();

        if ($current !== null) {
            $current->update(['is_current' => true]);
        }
    }

    private function sortForYear(string $year): int
    {
        return match ($year) {
            '2018' => 1,
            '2019' => 2,
            '2021' => 4,
            '2022' => 5,
            '2023' => 6,
            '2024' => 7,
            '2025' => 8,
            '2026' => 9,
            default => max(1, (int) $year - 2017),
        };
    }

    private function ceremonyVideoUrl(string $year): ?string
    {
        static $map = null;

        if ($map === null) {
            $path = __DIR__.'/data/tilila_ceremony_videos.php';
            $map = is_file($path) ? require $path : [];
        }

        $url = $map[$year] ?? null;

        return is_string($url) && trim($url) !== '' ? trim($url) : null;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function editions(): array
    {
        return [
            [
                'year' => '2018',
                'edition_label' => $this->label(1, 2018),
                'theme' => $this->triple(
                    'First edition focused on breaking gender stereotypes (e.g. men doing household chores).',
                    'Première édition axée sur la rupture des stéréotypes de genre (ex. hommes aux tâches ménagères).',
                    'الدورة الأولى تركز على كسر الصور النمطية حول النوع الاجتماعي (مثل مشاركة الرجال في الأعمال المنزلية).',
                ),
                'cover_image_path' => 'assets/trophee.png',
                'winners' => [
                    $this->winner(
                        'Grand Prize',
                        'Grand Prix',
                        'الجائزة الكبرى',
                        'MIO (Ama Détergent)',
                        'Agency: RAPP.',
                        'Agence : RAPP.',
                        'الوكالة: RAPP.',
                    ),
                ],
                'jury' => $this->juryForYear('2018'),
            ],
            [
                'year' => '2019',
                'edition_label' => $this->label(2, 2019),
                'theme' => $this->triple(
                    'Award ceremony: 10 October 2019 — Casablanca.',
                    'Remise des prix : 10 octobre 2019 — Casablanca.',
                    'حفل التتويج: 10 أكتوبر 2019 — الدار البيضاء.',
                ),
                'cover_image_path' => 'assets/trophee.png',
                'winners' => [
                    $this->winner(
                        '1st Prize',
                        '1er prix',
                        'الجائزة الأولى',
                        'MDJS',
                        'Campaign « Faire gagner le sport » — Agency: Initiative Digital.',
                        'Campagne « Faire gagner le sport » — Agence : Initiative Digital.',
                        'حملة « Faire gagner le sport » — الوكالة: Initiative Digital.',
                    ),
                    $this->winner(
                        '2nd Prize (ex-aequo)',
                        '2e prix (ex-aequo)',
                        'الجائزة الثانية (مناصفة)',
                        'MIO',
                        'Agency: RAPP.',
                        'Agence : RAPP.',
                        'الوكالة: RAPP.',
                    ),
                    $this->winner(
                        '2nd Prize (ex-aequo)',
                        '2e prix (ex-aequo)',
                        'الجائزة الثانية (مناصفة)',
                        'Maxis (Mutandis)',
                        'Agency: Klem.',
                        'Agence : Klem.',
                        'الوكالة: Klem.',
                    ),
                ],
                'jury' => $this->juryForYear('2019'),
            ],
            [
                'year' => '2021',
                'edition_label' => $this->label(3, 2021),
                'theme' => $this->triple(
                    'Award ceremony: 25 November 2021 — Casablanca.',
                    'Remise des prix : 25 novembre 2021 — Casablanca.',
                    'حفل التتويج: 25 نونبر 2021 — الدار البيضاء.',
                ),
                'cover_image_path' => 'assets/trophee.png',
                'winners' => [
                    $this->winner(
                        'Jury Prize',
                        'Prix du Jury',
                        'جائزة لجنة التحكيم',
                        'OFPPT',
                        'Agency: DDB Zone Bleue.',
                        'Agence : DDB Zone Bleue.',
                        'الوكالة: DDB Zone Bleue.',
                    ),
                    $this->winner(
                        'Coup de Cœur',
                        'Prix Coup de Cœur',
                        'جائزة القلب',
                        'COPAG',
                        'Agency: The Next Clic.',
                        'Agence : The Next Clic.',
                        'الوكالة: The Next Clic.',
                    ),
                    $this->winner(
                        'Honor Prize',
                        'Prix d’Honneur',
                        'جائزة الشرف',
                        'MIO',
                        'Agency: RAPP.',
                        'Agence : RAPP.',
                        'الوكالة: RAPP.',
                    ),
                ],
                'jury' => $this->juryForYear('2021'),
            ],
            [
                'year' => '2022',
                'edition_label' => $this->label(4, 2022),
                'theme' => $this->triple(
                    'Award ceremony: 13 October 2022 — Casablanca.',
                    'Remise des prix : 13 octobre 2022 — Casablanca.',
                    'حفل التتويج: 13 أكتوبر 2022 — الدار البيضاء.',
                ),
                'cover_image_path' => 'assets/trophee.png',
                'winners' => [
                    $this->winner(
                        'Jury Prize',
                        'Prix du Jury',
                        'جائزة لجنة التحكيم',
                        'Forces Armées Royales (FAR)',
                        'Agency: Boomerang Communication.',
                        'Agence : Boomerang Communication.',
                        'الوكالة: Boomerang Communication.',
                    ),
                    $this->winner(
                        'Coup de Cœur',
                        'Prix Coup de Cœur',
                        'جائزة القلب',
                        'Casabus-Alsa',
                        'Agency: Initiative Digital.',
                        'Agence : Initiative Digital.',
                        'الوكالة: Initiative Digital.',
                    ),
                    $this->winner(
                        'Honor Prize',
                        'Prix d’Honneur',
                        'جائزة الشرف',
                        'MDJS',
                        'Agency: Initiative Digital.',
                        'Agence : Initiative Digital.',
                        'الوكالة: Initiative Digital.',
                    ),
                ],
                'jury' => $this->juryForYear('2022'),
            ],
            [
                'year' => '2023',
                'edition_label' => $this->label(5, 2023),
                'theme' => $this->triple(
                    'Theme: « For advertising that truly brings us together » — alongside Tililab.',
                    'Thème : « Pour une pub qui nous rassemble vraiment » — en lien avec Tililab.',
                    'الشعار: « من أجل إعلان يجمعنا حقاً » — بالتوازي مع تيليلاب.',
                ),
                'cover_image_path' => 'assets/tilila/editions/edition-2023.png',
                'winners' => [
                    $this->winner(
                        'Jury Prize',
                        'Prix du Jury',
                        'جائزة لجنة التحكيم',
                        'MIA',
                        'Campaign « Bla Mika » — Agency: Jawjab.',
                        'Campagne « Bla Mika » — Agence : Jawjab.',
                        'حملة « Bla Mika » — الوكالة: Jawjab.',
                    ),
                    $this->winner(
                        'Honor Prize',
                        'Prix d’Honneur',
                        'جائزة الشرف',
                        'CIH Bank',
                        'Agency: RAPP.',
                        'Agence : RAPP.',
                        'الوكالة: RAPP.',
                    ),
                    $this->winner(
                        'Coup de Cœur',
                        'Prix Coup de Cœur',
                        'جائزة القلب',
                        'INWI',
                        'Agency: Shem’s.',
                        'Agence : Shem’s.',
                        'الوكالة: Shem’s.',
                    ),
                ],
                'jury' => $this->juryForYear('2023'),
            ],
            [
                'year' => '2024',
                'edition_label' => $this->label(6, 2024),
                'theme' => $this->triple(
                    'Stronger focus on inclusion — people with disabilities in advertising and fighting gender stereotypes.',
                    'Accent renforcé sur l’inclusion — handicap dans la publicité et lutte contre les stéréotypes de genre.',
                    'تركيز على الإدماج — ذوو الإعاقة في الإعلان ومحاربة الصور النمطية.',
                ),
                'cover_image_path' => 'assets/tilila/editions/edition-2024.png',
                'winners' => [
                    $this->winner(
                        'Jury Prize',
                        'Prix du Jury',
                        'جائزة لجنة التحكيم',
                        'Royal Air Maroc',
                        'Agency: Mosaik.',
                        'Agence : Mosaik.',
                        'الوكالة: Mosaik.',
                    ),
                    $this->winner(
                        'Honor Prize',
                        'Prix d’Honneur',
                        'جائزة الشرف',
                        'Marjane',
                        'Agency: Shem’s.',
                        'Agence : Shem’s.',
                        'الوكالة: Shem’s.',
                    ),
                    $this->winner(
                        'Coup de Cœur',
                        'Prix Coup de Cœur',
                        'جائزة القلب',
                        'CIH',
                        'Agency: RAPP.',
                        'Agence : RAPP.',
                        'الوكالة: RAPP.',
                    ),
                    $this->winner(
                        'Tilila Digital Prize',
                        'Prix Tilila Digital',
                        'جائزة تيليلا الرقمية',
                        'Shell',
                        'Agency: The Next Click.',
                        'Agence : The Next Click.',
                        'الوكالة: The Next Click.',
                    ),
                ],
                'jury' => $this->juryForYear('2024'),
            ],
            [
                'year' => '2025',
                'edition_label' => $this->label(7, 2025),
                'theme' => $this->triple(
                    'Theme: rural women — pillars of society, often under-represented in advertising.',
                    'Thème : la femme rurale — pilier de la société, souvent peu visible dans la publicité.',
                    'الموضوع: المرأة الريفية — ركيزة في المجتمع، قليلة التمثيل في الإعلان.',
                ),
                'cover_image_path' => 'assets/tilila/editions/edition-2025.png',
                'winners' => [
                    $this->winner(
                        'Jury Prize',
                        'Prix du Jury',
                        'جائزة لجنة التحكيم',
                        'Ain Atlas',
                        'Agency: Klem.',
                        'Agence : Klem.',
                        'الوكالة: Klem.',
                    ),
                    $this->winner(
                        'Honor Prize',
                        'Prix d’Honneur',
                        'جائزة الشرف',
                        'Sonasid',
                        'Agency: Shem’s.',
                        'Agence : Shem’s.',
                        'الوكالة: Shem’s.',
                    ),
                    $this->winner(
                        'Coup de Cœur',
                        'Prix Coup de Cœur',
                        'جائزة القلب',
                        'Lio',
                        'Agency: Creative Labs.',
                        'Agence : Creative Labs.',
                        'الوكالة: Creative Labs.',
                    ),
                    $this->winner(
                        'Tilila Digital Prize',
                        'Prix Tilila Digital',
                        'جائزة تيليلا الرقمية',
                        'Ain Atlas',
                        'Agency: ID36.',
                        'Agence : ID36.',
                        'الوكالة: ID36.',
                    ),
                ],
                'jury' => $this->juryForYear('2025'),
            ],
            [
                'year' => '2026',
                'edition_label' => $this->label(8, 2026),
                'theme' => $this->triple(
                    'Current edition — submissions are open until the awards ceremony.',
                    'Édition en cours — les candidatures sont ouvertes jusqu’à la cérémonie.',
                    'الدورة الحالية — الترشيحات مفتوحة حتى حفل التوزيع.',
                ),
                'cover_image_path' => null,
                'winners' => [],
                'jury' => [],
            ],
        ];
    }

    /**
     * @return array{en: string, fr: string, ar: string}
     */
    private function label(int $n, int $year): array
    {
        $ordinals = [
            1 => ['en' => '1st', 'fr' => '1re', 'ar' => 'الأولى'],
            2 => ['en' => '2nd', 'fr' => '2e', 'ar' => 'الثانية'],
            3 => ['en' => '3rd', 'fr' => '3e', 'ar' => 'الثالثة'],
            4 => ['en' => '4th', 'fr' => '4e', 'ar' => 'الرابعة'],
            5 => ['en' => '5th', 'fr' => '5e', 'ar' => 'الخامسة'],
            6 => ['en' => '6th', 'fr' => '6e', 'ar' => 'السادسة'],
            7 => ['en' => '7th', 'fr' => '7e', 'ar' => 'السابعة'],
            8 => ['en' => '8th', 'fr' => '8e', 'ar' => 'الثامنة'],
        ];

        $o = $ordinals[$n] ?? ['en' => (string) $n, 'fr' => (string) $n, 'ar' => (string) $n];

        return [
            'en' => "{$o['en']} edition ({$year})",
            'fr' => "{$o['fr']} édition ({$year})",
            'ar' => "الدورة {$o['ar']} ({$year})",
        ];
    }

    /**
     * @return array{en: string, fr: string, ar: string}
     */
    private function triple(string $en, string $fr, string $ar): array
    {
        return ['en' => $en, 'fr' => $fr, 'ar' => $ar];
    }

    /**
     * @return array{full_name: string, trophy: array{en: string, fr: string, ar: string}, bio: array{en: string, fr: string, ar: string}, photo_path: null}
     */
    private function winner(
        string $trophyEn,
        string $trophyFr,
        string $trophyAr,
        string $brandName,
        string $bioEn,
        string $bioFr,
        string $bioAr,
    ): array {
        return [
            'full_name' => $brandName,
            'trophy' => $this->triple($trophyEn, $trophyFr, $trophyAr),
            'bio' => $this->triple($bioEn, $bioFr, $bioAr),
            'photo_path' => null,
        ];
    }

    /**
     * @return array{full_name: string, bio: array{en: string, fr: string, ar: string}, photo_path: null}
     */
    private function juror(string $name, string $roleEn, string $roleFr, string $roleAr): array
    {
        return [
            'full_name' => $name,
            'bio' => $this->triple($roleEn, $roleFr, $roleAr),
            'photo_path' => null,
        ];
    }
}
