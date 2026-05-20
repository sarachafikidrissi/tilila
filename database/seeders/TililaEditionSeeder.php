<?php

namespace Database\Seeders;

use App\Models\TililaEdition;
use Illuminate\Database\Seeder;

class TililaEditionSeeder extends Seeder
{
    /**
     * Trophée Tilila edition facts — aligned with resources/js/pages/user/tilila/data/tilila-editions-history.js
     */
    public function run(): void
    {
        TililaEdition::query()->where('year', '2020')->delete();

        $editions = [
            [
                'year' => '2018',
                'edition_label' => [
                    'en' => '1st edition (2018)',
                    'fr' => '1re édition (2018)',
                    'ar' => 'الدورة الأولى (2018)',
                ],
                'theme' => [
                    'en' => 'First edition dedicated to advertising that most respectfully promotes the image of women.',
                    'fr' => 'Première édition consacrée à la publicité la plus respectueuse et valorisante de l’image des femmes.',
                    'ar' => 'دورة أولى مكرّسة للإعلان الأكثر احتراماً وتقديراً لصورة المرأة.',
                ],
                'cover_image_path' => 'assets/trophee.png',
                'lines' => [
                    [
                        'en' => 'Grand Prix — MIO (Ama Detergent). Agency: RAPP.',
                        'fr' => 'Grand Prix — MIO (Ama Détergent). Agence : RAPP.',
                        'ar' => 'الجائزة الكبرى — MIO (أما ديتيرجنت). الوكالة: RAPP.',
                    ],
                    [
                        'en' => 'Prize: a media campaign worth 1 million dirhams on 2M.',
                        'fr' => 'Prix : une campagne média d’une valeur d’un million de dirhams sur 2M.',
                        'ar' => 'الجائزة: حملة إعلامية بقيمة مليون درهم على قناة 2M.',
                    ],
                ],
            ],
            [
                'year' => '2019',
                'edition_label' => [
                    'en' => '2nd edition (2019)',
                    'fr' => '2e édition (2019)',
                    'ar' => 'الدورة الثانية (2019)',
                ],
                'theme' => [
                    'en' => 'Award ceremony: 10 October 2019 — Casablanca',
                    'fr' => 'Remise des prix : 10 octobre 2019 — Casablanca',
                    'ar' => 'حفل التتويج: 10 أكتوبر 2019 — الدار البيضاء',
                ],
                'cover_image_path' => 'assets/trophee.png',
                'lines' => [
                    [
                        'en' => '1st prize — MDJS (Marocaine des Jeux et des Sports), campaign “Faire gagner le sport”.',
                        'fr' => '1er prix — MDJS (Marocaine des Jeux et des Sports), campagne « Faire gagner le sport ».',
                        'ar' => 'الجائزة الأولى — MDJS (الشركة المغربية للألعاب والرياضة)، حملة « جعل الرياضة تفوز ».',
                    ],
                    [
                        'en' => '2nd prize (ex-aequo) — MIO (Ama Detergent) and Maxis (Mutandis).',
                        'fr' => '2e prix (ex-aequo) — MIO (Ama Détergent) et Maxis (Mutandis).',
                        'ar' => 'الجائزة الثانية (مناصفة) — MIO (أما ديتيرجنت) وMaxis (ميوتانديس).',
                    ],
                ],
            ],
            [
                'year' => '2021',
                'edition_label' => [
                    'en' => '3rd edition (2021)',
                    'fr' => '3e édition (2021)',
                    'ar' => 'الدورة الثالثة (2021)',
                ],
                'theme' => [
                    'en' => 'Award ceremony: 25 November 2021 — Casablanca',
                    'fr' => 'Remise des prix : 25 novembre 2021 — Casablanca',
                    'ar' => 'حفل التتويج: 25 نونبر 2021 — الدار البيضاء',
                ],
                'cover_image_path' => 'assets/trophee.png',
                'lines' => [
                    [
                        'en' => 'Prix du Jury — OFPPT (Office for Vocational Training). Agency: DDB Zone Bleue.',
                        'fr' => 'Prix du Jury — OFPPT (Office de la formation professionnelle et de la promotion du travail). Agence : DDB Zone Bleue.',
                        'ar' => 'جائزة لجنة التحكيم — OFPPT (مكتب التكوين المهني وإنعاش الشغل). الوكالة: DDB Zone Bleue.',
                    ],
                    [
                        'en' => 'Prix Coup de Cœur — COPAG. Agency: The Next Clic.',
                        'fr' => 'Prix Coup de Cœur — COPAG. Agence : The Next Clic.',
                        'ar' => 'جائزة القلب — COPAG. الوكالة: The Next Clic.',
                    ],
                    [
                        'en' => 'Prix d’Honneur — MIO. Agency: RAPP.',
                        'fr' => 'Prix d’Honneur — MIO. Agence : RAPP.',
                        'ar' => 'جائزة الشرف — MIO. الوكالة: RAPP.',
                    ],
                ],
            ],
            [
                'year' => '2022',
                'edition_label' => [
                    'en' => '4th edition (2022)',
                    'fr' => '4e édition (2022)',
                    'ar' => 'الدورة الرابعة (2022)',
                ],
                'theme' => [
                    'en' => 'Award ceremony: 13 October 2022 — Casablanca',
                    'fr' => 'Remise des prix : 13 octobre 2022 — Casablanca',
                    'ar' => 'حفل التتويج: 13 أكتوبر 2022 — الدار البيضاء',
                ],
                'cover_image_path' => 'assets/trophee.png',
                'lines' => [
                    [
                        'en' => 'Prix du Jury — Royal Moroccan Armed Forces (FAR). Agency: Boomerang Communication.',
                        'fr' => 'Prix du Jury — Forces armées royales (FAR). Agence : Boomerang Communication.',
                        'ar' => 'جائزة لجنة التحكيم — القوات المسلحة الملكية. الوكالة: Boomerang Communication.',
                    ],
                    [
                        'en' => 'Prix Coup de Cœur — Casabus-Alsa. Agency: Initiative Digital.',
                        'fr' => 'Prix Coup de Cœur — Casabus-Alsa. Agence : Initiative Digital.',
                        'ar' => 'جائزة القلب — Casabus-Alsa. الوكالة: Initiative Digital.',
                    ],
                    [
                        'en' => 'Prix d’Honneur — MDJS. Agency: Initiative Digital.',
                        'fr' => 'Prix d’Honneur — MDJS. Agence : Initiative Digital.',
                        'ar' => 'جائزة الشرف — MDJS. الوكالة: Initiative Digital.',
                    ],
                    [
                        'en' => 'Other shortlisted campaigns included Inwi, Merendina, Always, Addoha, Wafa Assurance, Aïcha, and Société Générale.',
                        'fr' => 'Parmi les campagnes remarquées : Inwi, Merendina, Always, Addoha, Wafa Assurance, Aïcha, Société Générale.',
                        'ar' => 'من بين الحملات البارزة: Inwi وMerendina وAlways وAddoha وWafa Assurance وAïcha وSociété Générale.',
                    ],
                ],
            ],
            [
                'year' => '2023',
                'edition_label' => [
                    'en' => '5th edition (2023)',
                    'fr' => '5e édition (2023)',
                    'ar' => 'الدورة الخامسة (2023)',
                ],
                'theme' => [
                    'en' => 'Theme: “For advertising that truly brings us together” — run alongside Tililab, the creative bootcamp for young talents promoting parity and inclusion.',
                    'fr' => 'Thème : « Pour une pub qui nous rassemble vraiment » — en lien avec Tililab, bootcamp créatif pour jeunes talents autour de la parité et de l’inclusion.',
                    'ar' => 'الشعار: « من أجل إعلان يجمعنا حقاً » — بالتوازي مع تيليلاب، معسكر إبداعي للشباب حول المساواة والإدماج.',
                ],
                'cover_image_path' => 'assets/tilila/editions/edition-2023.png',
                'lines' => [],
            ],
            [
                'year' => '2024',
                'edition_label' => [
                    'en' => '6th edition (2024)',
                    'fr' => '6e édition (2024)',
                    'ar' => 'الدورة السادسة (2024)',
                ],
                'theme' => [
                    'en' => 'Stronger focus on inclusion — including people with disabilities in advertising — and on fighting gender stereotypes.',
                    'fr' => 'Accent renforcé sur l’inclusion — notamment des personnes en situation de handicap dans la publicité — et sur la lutte contre les stéréotypes de genre.',
                    'ar' => 'تركيز أقوى على الإدماج—بمن فيهم الأشخاص ذوو الإعاقة في الإعلان—ومحاربة الصور النمطية حول النوع الاجتماعي.',
                ],
                'cover_image_path' => 'assets/tilila/editions/edition-2024.png',
                'lines' => [
                    [
                        'en' => 'Prix du Jury — Royal Air Maroc (main winner).',
                        'fr' => 'Prix du Jury — Royal Air Maroc (grand lauréat).',
                        'ar' => 'جائزة لجنة التحكيم — الخطوط الملكية المغربية (الفائز الرئيسي).',
                    ],
                ],
            ],
            [
                'year' => '2025',
                'edition_label' => [
                    'en' => '7th edition (2025)',
                    'fr' => '7e édition (2025)',
                    'ar' => 'الدورة السابعة (2025)',
                ],
                'theme' => [
                    'en' => 'Theme: rural women — pillars of society, often under-represented in advertising.',
                    'fr' => 'Thème : la femme rurale — pilier de la société, souvent peu visible dans la publicité.',
                    'ar' => 'الموضوع: المرأة الريفية—ركيزة في المجتمع، قليلة التمثيل في الإعلان.',
                ],
                'cover_image_path' => 'assets/tilila/editions/edition-2025.png',
                'lines' => [
                    [
                        'en' => 'Prix du Jury — Ain Atlas × Agency Klem.',
                        'fr' => 'Prix du Jury — Ain Atlas × agence Klem.',
                        'ar' => 'جائزة لجنة التحكيم — Ain Atlas × وكالة Klem.',
                    ],
                    [
                        'en' => 'Prix d’Honneur — Sonasid × Agency Shem’s.',
                        'fr' => 'Prix d’Honneur — Sonasid × agence Shem’s.',
                        'ar' => 'جائزة الشرف — Sonasid × وكالة Shem’s.',
                    ],
                    [
                        'en' => 'Prix Coup de Cœur — Lio × Agency Creative Labs.',
                        'fr' => 'Prix Coup de Cœur — Lio × agence Creative Labs.',
                        'ar' => 'جائزة القلب — Lio × وكالة Creative Labs.',
                    ],
                    [
                        'en' => 'Prix Tilila Digital — Ain Atlas × ID36.',
                        'fr' => 'Prix Tilila Digital — Ain Atlas × ID36.',
                        'ar' => 'جائزة تيليلا الرقمية — Ain Atlas × ID36.',
                    ],
                ],
            ],
        ];

        foreach ($editions as $index => $row) {
            $year = (int) $row['year'];

            TililaEdition::query()->updateOrCreate(
                ['year' => (string) $year],
                [
                    'edition_label' => $row['edition_label'],
                    'theme' => $row['theme'],
                    'cover_image_path' => $row['cover_image_path'],
                    'winners' => $this->linesToWinners($row['lines']),
                    'jury' => [],
                    'gallery_images' => [],
                    'has_gallery' => false,
                    'winners_url' => null,
                    'jury_url' => null,
                    'gallery_url' => null,
                    'sort' => $year - 2017,
                ],
            );
        }
    }

    /**
     * @param  array<int, array{en: string, fr: string, ar: string}>  $lines
     * @return array<int, array{full_name: string, bio: array{en: string, fr: string, ar: string}, photo_path: null}>
     */
    private function linesToWinners(array $lines): array
    {
        $winners = [];

        foreach ($lines as $line) {
            $en = trim((string) ($line['en'] ?? ''));
            if ($en === '') {
                continue;
            }

            $winners[] = [
                'full_name' => mb_strlen($en) > 120 ? mb_substr($en, 0, 117).'…' : $en,
                'bio' => [
                    'en' => $line['en'] ?? '',
                    'fr' => $line['fr'] ?? '',
                    'ar' => $line['ar'] ?? '',
                ],
                'photo_path' => null,
            ];
        }

        return $winners;
    }
}
