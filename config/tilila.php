<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Tilila Awards — highlight videos (public disk)
    |--------------------------------------------------------------------------
    |
    | Paths relative to storage/app/public (served at /storage/…).
    | Override via .env when deploying.
    |
    */

    'teaser_video_path' => env(
        'TILILA_TEASER_VIDEO_PATH',
        'tilila/media/teaser-2022.mp4',
    ),

    'best_of_video_path' => env(
        'TILILA_BEST_OF_VIDEO_PATH',
        'tilila/media/best-of-ceremony-2022.mp4',
    ),

];
