<?php

namespace App\Support;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ParticipantFileStorage
{
    public const DISK = 'local';

    public static function store(UploadedFile $file, string $directory): string
    {
        return $file->store($directory, self::DISK);
    }

    public static function delete(?string $path): void
    {
        if ($path === null || $path === '' || str_contains($path, '..')) {
            return;
        }

        foreach ([self::DISK, 'public'] as $disk) {
            $filesystem = Storage::disk($disk);
            if ($filesystem->exists($path)) {
                $filesystem->delete($path);
            }
        }
    }

    /**
     * @param  list<string|null>  $paths
     */
    public static function deleteMany(array $paths): void
    {
        foreach ($paths as $path) {
            self::delete($path);
        }
    }

    public static function resolveDisk(?string $path): ?Filesystem
    {
        if ($path === null || $path === '' || str_contains($path, '..')) {
            return null;
        }

        foreach ([self::DISK, 'public'] as $diskName) {
            $disk = Storage::disk($diskName);
            if ($disk->exists($path)) {
                return $disk;
            }
        }

        return null;
    }
}
