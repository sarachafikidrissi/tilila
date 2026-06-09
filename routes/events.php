<?php

use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;

Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{id}', [EventController::class, 'show'])->whereNumber('id')->name('events.show');
Route::post('/events/{id}/register', [EventController::class, 'register'])
    ->middleware('throttle:public-forms')
    ->whereNumber('id')
    ->name('events.register');
