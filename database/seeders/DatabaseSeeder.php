<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::query()->updateOrCreate(
            [
                'email' => 'test@example.com',
                'role' => 'admin',
            ],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
            ],
        );

        // $this->call(ExpertSeeder::class);
        $this->call(OpportunitySeeder::class);
        $this->call(EventSeeder::class);
        $this->call(TililaEditionSeeder::class);
        $this->call(TililabEditionSeeder::class);
        $this->call(MediaItemSeeder::class);
        $this->call(MediaSidebarSettingSeeder::class);
        $this->call(TililaConnectRequestSeeder::class);
        $this->call(NewsletterSubscriptionSeeder::class);
    }
}
