<?php

namespace Database\Seeders;

use App\Models\Opportunity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OpportunitySeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'type' => 'panel_discussion',
                'status' => 'open',
                'title' => [
                    'en' => 'Women in Tech: Breaking Barriers',
                    'fr' => 'Femmes dans la tech : briser les barrières',
                    'ar' => 'النساء في التكنولوجيا: كسر الحواجز',
                ],
                'org' => ['en' => 'Technopark', 'fr' => 'Technopark', 'ar' => 'Technopark'],
                'location' => ['en' => 'Casablanca, Morocco', 'fr' => 'Casablanca, Maroc', 'ar' => 'الدار البيضاء، المغرب'],
                'excerpt' => [
                    'en' => 'Seeking panelists for a discussion on innovation, inclusion, and leadership.',
                    'fr' => 'Recherche de panélistes pour une discussion sur l’innovation, l’inclusion et le leadership.',
                    'ar' => 'نبحث عن متحدثات لنقاش حول الابتكار والإدماج والقيادة.',
                ],
                'deadline' => '2023-11-15',
                'views' => 24,
                'applications_count' => 24,
                'applications_limit' => 50,
            ],
            [
                'type' => 'media_call',
                'status' => 'open',
                'title' => [
                    'en' => 'Climate Change Impact Report Interview',
                    'fr' => 'Entretien sur l’impact du changement climatique',
                    'ar' => 'مقابلة حول أثر التغير المناخي',
                ],
                'org' => ['en' => '2M TV Channel', 'fr' => 'Chaîne 2M', 'ar' => 'قناة 2M'],
                'location' => ['en' => 'Rabat, Morocco', 'fr' => 'Rabat, Maroc', 'ar' => 'الرباط، المغرب'],
                'excerpt' => [
                    'en' => 'Looking for an expert to discuss the latest climate change findings.',
                    'fr' => 'Nous recherchons une experte pour discuter des dernières conclusions sur le changement climatique.',
                    'ar' => 'نبحث عن خبيرة لمناقشة أحدث نتائج التغير المناخي.',
                ],
                'deadline' => '2023-10-30',
                'views' => 12,
                'applications_count' => 12,
                'applications_limit' => 15,
            ],
            [
                'type' => 'grant',
                'status' => 'filled',
                'title' => [
                    'en' => 'Annual Research Grant 2024',
                    'fr' => 'Subvention annuelle de recherche 2024',
                    'ar' => 'منحة البحث السنوية 2024',
                ],
                'org' => ['en' => 'Ministry of Culture', 'fr' => 'Ministère de la Culture', 'ar' => 'وزارة الثقافة'],
                'location' => ['en' => 'Morocco', 'fr' => 'Maroc', 'ar' => 'المغرب'],
                'excerpt' => [
                    'en' => 'Funding program supporting research projects led by women.',
                    'fr' => 'Programme de financement soutenant des projets de recherche dirigés par des femmes.',
                    'ar' => 'برنامج تمويل لدعم مشاريع بحث تقودها النساء.',
                ],
                'deadline' => '2023-12-31',
                'views' => 156,
                'applications_count' => 156,
                'applications_limit' => null,
            ],
        ];

        foreach ($rows as $row) {
            $row['slug'] = Str::slug((string) ($row['title']['en'] ?? 'opportunity')) ?: 'opportunity';

            Opportunity::query()->updateOrCreate(
                ['slug' => $row['slug']],
                $row
            );
        }
    }
}
