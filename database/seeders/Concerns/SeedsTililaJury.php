<?php

namespace Database\Seeders\Concerns;

trait SeedsTililaJury
{
    /**
     * @return array<int, array{full_name: string, bio: array{en: string, fr: string, ar: string}, photo_path: null}>
     */
    protected function juryForYear(string $year): array
    {
        static $byYear = null;

        if ($byYear === null) {
            $path = dirname(__DIR__).'/data/tilila_jury_by_year.php';
            $byYear = is_file($path) ? require $path : [];
        }

        $members = $byYear[$year] ?? [];

        return array_map(
            fn (array $member) => $this->juror(
                $member['name'],
                $member['en'],
                $member['fr'],
                $member['ar'],
            ),
            $members,
        );
    }
}
