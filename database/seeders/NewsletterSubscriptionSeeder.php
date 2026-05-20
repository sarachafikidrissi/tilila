<?php

namespace Database\Seeders;

use App\Models\NewsletterSubscription;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class NewsletterSubscriptionSeeder extends Seeder
{
    /**
     * Demo subscriptions aligned with database/database.sqlite.
     */
    public function run(): void
    {
        $rows = [
            [
                'email' => 'newsletter.fr@example.org',
                'locale' => 'fr',
                'subscribed_at' => '2026-04-20 16:24:36',
            ],
            [
                'email' => 'newsletter.en@example.org',
                'locale' => 'en',
                'subscribed_at' => '2026-05-13 16:24:36',
            ],
            [
                'email' => 'newsletter.ar@example.org',
                'locale' => 'ar',
                'subscribed_at' => '2026-05-20 15:24:36',
            ],
            [
                'email' => 'boujjarr@gmail.com',
                'locale' => 'en',
                'subscribed_at' => '2026-05-20 16:44:43',
            ],
        ];

        foreach ($rows as $row) {
            $subscribedAt = Carbon::parse($row['subscribed_at']);

            NewsletterSubscription::query()->updateOrCreate(
                ['email' => $row['email']],
                [
                    'locale' => $row['locale'],
                    'subscribed_at' => $subscribedAt,
                ],
            );
        }
    }
}
