<?php

namespace Database\Seeders;

use App\Models\ProgramNews;
use App\Models\ProgramTestimonial;
use Illuminate\Database\Seeder;

class ProgramContentSeeder extends Seeder
{
    public function run(): void
    {
        ProgramTestimonial::query()->updateOrCreate(
            ['name' => 'Lauréat Tilila Awards', 'program' => 'tilila'],
            [
                'quote' => [
                    'fr' => 'Les Tilila Awards nous ont permis de valoriser notre engagement pour une communication plus inclusive.',
                    'en' => 'Tilila Awards helped us highlight our commitment to more inclusive communication.',
                    'ar' => 'ساعدتنا تيليلا أووردز على إبراز التزامنا بتواصل أكثر شمولية.',
                ],
                'role' => ['fr' => 'Annonceur', 'en' => 'Advertiser', 'ar' => 'معلن'],
                'edition_year' => 2025,
                'sort' => 1,
                'is_published' => true,
            ],
        );

        ProgramTestimonial::query()->updateOrCreate(
            ['name' => 'Participant Tililab', 'program' => 'tililab'],
            [
                'quote' => [
                    'fr' => 'Tililab a été une expérience formatrice unique, entre mentorat et création intensive.',
                    'en' => 'Tililab was a unique training experience combining mentoring and intensive creation.',
                    'ar' => 'كانت تيليلاب تجربة تكوينية فريدة تجمع بين الإرشاد والإبداع المكثف.',
                ],
                'role' => ['fr' => 'Jeune créateur·rice', 'en' => 'Young creator', 'ar' => 'مبدع شاب'],
                'edition_year' => 2025,
                'sort' => 1,
                'is_published' => true,
            ],
        );

        ProgramNews::query()->updateOrCreate(
            ['slug' => 'ouverture-candidatures-tilila-awards-2026'],
            [
                'program' => 'tilila',
                'title' => [
                    'fr' => 'Ouverture des candidatures Tilila Awards 2026',
                    'en' => 'Tilila Awards 2026 applications now open',
                    'ar' => 'فتح الترشحات لتيليلا أووردز 2026',
                ],
                'excerpt' => [
                    'fr' => 'Les annonceurs marocains peuvent déposer leurs campagnes via le formulaire en ligne.',
                    'en' => 'Moroccan advertisers can submit campaigns through the online form.',
                    'ar' => 'يمكن للمعلنين المغاربة تقديم حملاتهم عبر الاستمارة الإلكترونية.',
                ],
                'body' => [
                    'fr' => 'Consultez le règlement intégral et soumettez votre candidature avant la date limite annoncée pour l’édition en cours.',
                    'en' => 'Read the full regulations and submit before the deadline for the current edition.',
                    'ar' => 'اطلعوا على النظام الكامل وقدّموا ترشحكم قبل الموعد النهائي للدورة الحالية.',
                ],
                'published_at' => now(),
                'is_published' => true,
            ],
        );
    }
}
