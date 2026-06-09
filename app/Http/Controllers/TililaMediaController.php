<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TililaMediaController extends Controller
{
    public function teaser(Request $request): BinaryFileResponse
    {
        return $this->streamConfiguredVideo('teaser_video_path');
    }

    public function bestOf(Request $request): BinaryFileResponse
    {
        return $this->streamConfiguredVideo('best_of_video_path');
    }

    private function streamConfiguredVideo(string $configKey): BinaryFileResponse
    {
        $path = (string) config("tilila.{$configKey}");

        if ($path === '' || ! is_readable($path)) {
            abort(404);
        }

        $mime = match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
            'mp4' => 'video/mp4',
            'webm' => 'video/webm',
            default => 'video/quicktime',
        };

        return response()->file($path, [
            'Content-Type' => $mime,
            'Accept-Ranges' => 'bytes',
        ]);
    }
}
