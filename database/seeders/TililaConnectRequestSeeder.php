<?php

namespace Database\Seeders;

use App\Models\TililaConnectRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TililaConnectRequestSeeder extends Seeder
{
    /**
     * Demo connect requests aligned with database/database.sqlite.
     */
    public function run(): void
    {
        $rows = [
            [
                'request_type' => 'interview',
                'full_name' => 'Oumaima El Fassi',
                'email' => 'oumaima.elfassi@example.org',
                'phone' => '+212 6 00 00 00 00',
                'organization' => '2M (Editorial)',
                'message' => 'We would like to book an interview with an expert on women leadership & innovation. Please share 2-3 profiles available this week.',
                'locale' => 'fr',
                'ip' => '127.0.0.1',
                'user_agent' => 'Seeder',
                'created_at' => '2026-05-17 16:24:36',
                'updated_at' => '2026-05-17 16:24:36',
            ],
            [
                'request_type' => 'speaker_panel',
                'full_name' => 'Sarah Benali',
                'email' => 'sarah.benali@example.org',
                'phone' => null,
                'organization' => 'University Club',
                'message' => 'We’re organizing a panel on inclusive governance and would love a Tilila expert speaker. Event date: next month.',
                'locale' => 'en',
                'ip' => '127.0.0.1',
                'user_agent' => 'Seeder',
                'created_at' => '2026-05-19 16:24:36',
                'updated_at' => '2026-05-19 16:24:36',
            ],
            [
                'request_type' => 'network',
                'full_name' => 'Khadija A.',
                'email' => 'khadija.network@example.org',
                'phone' => '+33 6 00 00 00 00',
                'organization' => 'Diaspora Network',
                'message' => 'Interested in joining the Tilila network and getting introduced to experts for upcoming collaborations.',
                'locale' => 'ar',
                'ip' => '127.0.0.1',
                'user_agent' => 'Seeder',
                'created_at' => '2026-05-20 14:24:36',
                'updated_at' => '2026-05-20 14:24:36',
            ],
        ];

        TililaConnectRequest::query()->delete();

        foreach ($rows as $row) {
            $createdAt = Carbon::parse($row['created_at']);
            $updatedAt = Carbon::parse($row['updated_at']);

            TililaConnectRequest::query()->create([
                'request_type' => $row['request_type'],
                'full_name' => $row['full_name'],
                'email' => $row['email'],
                'phone' => $row['phone'],
                'organization' => $row['organization'],
                'message' => $row['message'],
                'locale' => $row['locale'],
                'ip' => $row['ip'],
                'user_agent' => $row['user_agent'],
                'created_at' => $createdAt,
                'updated_at' => $updatedAt,
            ]);
        }
    }
}
