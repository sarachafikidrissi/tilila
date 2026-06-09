<?php

namespace Database\Seeders;

use App\Models\Expert;
use App\Models\User;
use Illuminate\Database\Seeder;

class ExpertSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->rows() as $row) {
            $user = User::query()->updateOrCreate(
                ['email' => $row['email']],
                [
                    'name' => $row['name']['fr'],
                    'password' => 'password',
                    'password_set_at' => now(),
                    'role' => 'expert',
                    'email_verified_at' => now(),
                ],
            );

            Expert::query()->updateOrCreate(
                ['email' => $row['email']],
                [...$row, 'user_id' => $user->id],
            );
        }
    }

    private function rows(): array
    {
        return [
            [
                'name' => ['fr' => 'Test Expert', 'ar' => '', 'en' => ''],
                'title' => [
                    'fr' => 'Test Title',
                    'ar' => '',
                    'en' => '',
                ],
                'email' => 'test.expert@example.com',
                'last_activity_at' => now(),
                'status' => 'published',
                'expertise' => [],
            ],

        ];
    }
}
