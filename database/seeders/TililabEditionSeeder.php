<?php

namespace Database\Seeders;

use App\Models\TililabEdition;
use Illuminate\Database\Seeder;

class TililabEditionSeeder extends Seeder
{
    public function run(): void
    {
        TililabEdition::query()->whereNotIn('year', ['2021', '2022', '2023', '2024', '2025'])->delete();

        foreach ($this->editions() as $row) {
            $year = (int) $row['year'];

            TililabEdition::query()->updateOrCreate(
                ['year' => (string) $year],
                [
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
                ],
            );
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
                'jury' => [],
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
                'jury' => [],
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
                'jury' => $this->juryFifthTililaEdition(),
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
                'jury' => $this->jurySixthTililaEdition(),
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
                'jury' => $this->jurySeventhTililaEdition(),
                'winners' => [
                    $this->winner(
                        'Mohamed Saïd El Bekkali',
                        'Winner of the 5th Tililab edition.',
                        'Lauréat de la 5e édition Tililab.',
                        'فائز بالدورة الخامسة لتيليلاب.',
                    ),
                ],
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

    /** 5th Tililab (2025) — same as 7th Trophée Tilila */
    private function jurySeventhTililaEdition(): array
    {
        return [
            $this->juror('Hind Bensari', 'Director', 'Réalisatrice', 'مخرجة'),
            $this->juror('Fihr Kettani', 'Cultural entrepreneur', 'Entrepreneur culturel', 'رائد أعمال ثقافي'),
            $this->juror('Idir Ouguindi', 'Associative activist & inclusive development consultant', 'Militant associatif & consultant développement inclusif', 'ناشط جمعوي ومستشار تنمية شاملة'),
            $this->juror('Ghita El Kholti', 'Creative director', 'Directrice de création', 'مديرة إبداعية'),
            $this->juror('Mounia Lamkimel', 'Actress', 'Actrice', 'ممثلة'),
            $this->juror('Abdellah Tourabi', 'Journalist & TV presenter', 'Journaliste & présentateur TV', 'صحفي ومقدم تلفزيوني'),
        ];
    }

    /** 4th Tililab (2024) — same as 6th Trophée Tilila */
    private function jurySixthTililaEdition(): array
    {
        return [
            $this->juror('Sanaa Akroud', 'Producer, director, actress', 'Productrice, réalisatrice, actrice', 'منتجة، مخرجة، ممثلة'),
            $this->juror('Rabii Kati', 'Actor', 'Acteur', 'ممثل'),
            $this->juror('Zhor Fassi Fihri', 'Director, producer', 'Réalisatrice, productrice', 'مخرجة، منتجة'),
            $this->juror('Mohamed Achaour', 'Director, screenwriter, producer', 'Réalisateur, scénariste, producteur', 'مخرج، كاتب سيناريو، منتج'),
            $this->juror('Siham El Mechtani El Idrissi', 'Marketing & innovation expert', 'Experte marketing & innovation', 'خبيرة تسويق وابتكار'),
            $this->juror('Ali Boujena', 'Marketing & communication expert — among other jury members', 'Expert marketing & communication — parmi d’autres membres du jury', 'خبير تسويق واتصال — ضمن أعضاء لجنة التحكيم'),
        ];
    }

    /** 3rd Tililab (2023) — aligned with 5th Trophée Tilila */
    private function juryFifthTililaEdition(): array
    {
        return [
            $this->juror('Nabil Ayouch', 'Director & producer', 'Réalisateur & producteur', 'مخرج ومنتج'),
            $this->juror('Latefa Ahrrare', 'Actress', 'Actrice', 'ممثلة'),
            $this->juror('Amal Chafai', 'Actress', 'Actrice', 'ممثلة'),
            $this->juror('Basma El Hijri', 'Director', 'Réalisatrice', 'مخرجة'),
            $this->juror('Nawal El Aidaoui', 'Journalist & presenter', 'Journaliste & présentatrice', 'صحفية ومقدمة'),
            $this->juror('Nawfel Bensari', 'Director', 'Réalisateur', 'مخرج'),
        ];
    }
}
