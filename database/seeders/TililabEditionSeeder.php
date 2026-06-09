<?php

namespace Database\Seeders;

use App\Models\TililabEdition;
use Database\Seeders\Concerns\SeedsTililaJury;
use Illuminate\Database\Seeder;

class TililabEditionSeeder extends Seeder
{
    use SeedsTililaJury;

    public function run(): void
    {
        TililabEdition::query()->whereNotIn('year', ['2021', '2022', '2023', '2024', '2025', '2026'])->delete();

        foreach ($this->editions() as $row) {
            $year = (int) $row['year'];
            $payload = [
                    'edition_label' => $row['edition_label'],
                    'theme' => $row['theme'],
                    'winners' => $row['winners'],
                    'jury' => $row['jury'],
                    'gallery_images' => [],
                    'has_gallery' => false,
                    'winners_url' => null,
                    'jury_url' => null,
                    'gallery_url' => null,
                    'sort' => $year - 2020,
            ];

            $ceremonyUrl = $this->ceremonyVideoUrl((string) $year);
            if ($ceremonyUrl !== null) {
                $payload['ceremony_video_url'] = $ceremonyUrl;
            }

            TililabEdition::query()->updateOrCreate(
                ['year' => (string) $year],
                $payload,
            );
        }

        TililabEdition::query()->update(['is_current' => false]);

        $currentYear = (string) now()->year;
        $current = TililabEdition::query()->where('year', $currentYear)->first()
            ?? TililabEdition::query()->orderByDesc('year')->orderByDesc('id')->first();

        if ($current !== null) {
            $current->update(['is_current' => true]);
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function editions(): array
    {
        return [
            [
                'year' => '2021',
                'edition_label' => $this->label(1, 2021),
                'theme' => $this->triple(
                    'Launch edition of Tililab — inclusive advertising and gender equality.',
                    'Édition inaugurale de Tililab — publicité inclusive et égalité des genres.',
                    'الدورة الافتتاحية لتيليلاب — إعلان شامل والمساواة بين الجنسين.',
                ),
                'jury' => $this->juryForYear('2021'),
                'winners' => [
                    $this->winner(
                        'Zakaria El Jouhari',
                        'Also known as Zakaria Joël / Eljouhari Zakaria. Strong spot promoting inclusive advertising and gender equality.',
                        'Également connu sous Zakaria Joël / Eljouhari Zakaria. Spot marquant pour une publicité inclusive et l’égalité des genres.',
                        'يُعرف أيضاً بزكرياء جويل / الزجوهري زكرياء. إعلان قوي يعزز الشمول والمساواة.',
                    ),
                ],
            ],
            [
                'year' => '2022',
                'edition_label' => $this->label(2, 2022),
                'theme' => $this->triple(
                    'Theme: diversity in advertising creation. Bootcamp held in Marrakech.',
                    'Thème : diversité dans la création publicitaire. Bootcamp à Marrakech.',
                    'الموضوع: التنوع في الإبداع الإعلاني. المعسكر في مراكش.',
                ),
                'jury' => $this->juryForYear('2022'),
                'winners' => [
                    $this->winner(
                        'Aymane Oulmadou',
                        'Winner of the 2nd Tililab edition.',
                        'Lauréat de la 2e édition Tililab.',
                        'فائز بالدورة الثانية لتيليلاب.',
                    ),
                ],
            ],
            [
                'year' => '2023',
                'edition_label' => $this->label(3, 2023),
                'theme' => $this->triple(
                    'Edition emphasizing teamwork among young creators (ex-aequo winners).',
                    'Édition mettant l’accent sur le travail d’équipe des jeunes créateurs (lauréats ex-aequo).',
                    'دورة تؤكد العمل الجماعي للمبدعين الشباب (فائزون مناصفة).',
                ),
                'jury' => $this->juryForYear('2023'),
                'winners' => [
                    $this->winner(
                        'Coupinates (ex-aequo)',
                        'Rhafes Inas, Lamrani Basma, Draia Ibtissam.',
                        'Rhafes Inas, Lamrani Basma, Draia Ibtissam.',
                        'Rhafes Inas, Lamrani Basma, Draia Ibtissam.',
                    ),
                    $this->winner(
                        'Creators (ex-aequo)',
                        'Sekrati Kawtar, Boulboul Asma, Riad Omar.',
                        'Sekrati Kawtar, Boulboul Asma, Riad Omar.',
                        'Sekrati Kawtar, Boulboul Asma, Riad Omar.',
                    ),
                ],
            ],
            [
                'year' => '2024',
                'edition_label' => $this->label(4, 2024),
                'theme' => $this->triple(
                    'Theme: inclusion of people with disabilities and use of artificial intelligence.',
                    'Thème : inclusion des personnes en situation de handicap et usage de l’intelligence artificielle.',
                    'الموضوع: إدماج ذوي الإعاقة واستخدام الذكاء الاصطناعي.',
                ),
                'jury' => $this->juryForYear('2024'),
                'winners' => [
                    $this->winner(
                        'Yassine El Fataoui',
                        'Winning spot praised for emotion and highlighting social inclusion.',
                        'Spot lauréat salué pour son émotion et sa mise en avant de l’inclusion sociale.',
                        'إعلان فائز بُني على العاطفة وإبراز الإدماج الاجتماعي.',
                    ),
                ],
            ],
            [
                'year' => '2025',
                'edition_label' => $this->label(5, 2025),
                'theme' => $this->triple(
                    'Theme: volunteering for the 2030 World Cup. Bootcamp Marrakech (10–13 Sept. 2025), 7 finalists; program included children from Douar Shems’y (Al Haouz).',
                    'Thème : bénévolat pour la Coupe du Monde 2030. Bootcamp Marrakech (10–13 sept. 2025), 7 finalistes ; enfants de Douar Shems’y (Al Haouz).',
                    'الموضوع: التطوع لكأس العالم 2030. معسكر مراكش (10–13 سبتمبر 2025)، 7 متأهلين؛ أطفال دوار شمسي (الحوز).',
                ),
                'jury' => $this->juryForYear('2025'),
                'winners' => [
                    $this->winner(
                        'Mohamed Saïd El Bekkali',
                        'Winner of the 5th Tililab edition.',
                        'Lauréat de la 5e édition Tililab.',
                        'فائز بالدورة الخامسة لتيليلاب.',
                    ),
                ],
            ],
            [
                'year' => '2026',
                'edition_label' => $this->label(6, 2026),
                'theme' => $this->triple(
                    'Current edition — applications are open until the national final.',
                    'Édition en cours — les candidatures sont ouvertes jusqu’à la finale nationale.',
                    'الدورة الحالية — الترشيحات مفتوحة حتى النهائي الوطني.',
                ),
                'jury' => $this->juryForYear('2025'),
                'winners' => [],
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
     * @return array{full_name: string, bio: array{en: string, fr: string, ar: string}, photo_path: null}
     */
    private function winner(string $name, string $bioEn, string $bioFr, string $bioAr): array
    {
        return [
            'full_name' => $name,
            'bio' => ['en' => $bioEn, 'fr' => $bioFr, 'ar' => $bioAr],
            'photo_path' => null,
        ];
    }

    /**
     * @return array<int, array{full_name: string, bio: array{en: string, fr: string, ar: string}, photo_path: null}>
     */
    private function juror(string $name, string $roleEn, string $roleFr, string $roleAr): array
    {
        return [
            'full_name' => $name,
            'bio' => ['en' => $roleEn, 'fr' => $roleFr, 'ar' => $roleAr],
            'photo_path' => null,
        ];
    }

    private function ceremonyVideoUrl(string $year): ?string
    {
        static $byYear = null;

        if ($byYear === null) {
            $path = __DIR__.'/data/tililab_ceremony_videos.php';
            $byYear = is_file($path) ? require $path : [];
        }

        $url = $byYear[$year] ?? null;

        return is_string($url) && $url !== '' ? $url : null;
    }
}
