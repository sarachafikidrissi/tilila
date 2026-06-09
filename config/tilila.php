<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Tilila Awards — Best Of highlight video
    |--------------------------------------------------------------------------
    |
    | Absolute path to the ceremony highlight reel served on /tilila.
    | Override via TILILA_BEST_OF_VIDEO_PATH in .env when deploying.
    |
    */

    'best_of_video_path' => env(
        'TILILA_BEST_OF_VIDEO_PATH',
        'D:\\Tilila\\Vidéos\\BEST of .mov',
    ),

    'teaser_video_path' => env(
        'TILILA_TEASER_VIDEO_PATH',
        'D:\\Tilila\\Vidéos\\Teaser - Tilila 2022.mp4',
    ),

];
