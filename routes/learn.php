<?php

use App\Http\Controllers\LearnController;
use App\Http\Controllers\OpportunityController;
use Illuminate\Support\Facades\Route;

Route::get('/learn', [LearnController::class, 'index'])->name('learn.index');
Route::get('/learn/academy', [LearnController::class, 'academy'])->name('learn.academy');
Route::get('/learn/resources', [LearnController::class, 'resources'])->name('learn.resources');
Route::get('/learn/offers', [LearnController::class, 'offers'])->name('learn.offers');
Route::get('/learn/agenda', [LearnController::class, 'agenda'])->name('learn.agenda');

Route::get('/learn/opportunities', [OpportunityController::class, 'index'])->name('learn.opportunities.index');
Route::get('/learn/opportunities/{opportunity}', [OpportunityController::class, 'show'])->name('learn.opportunities.show');
Route::post('/learn/opportunities/{opportunity}/apply', [OpportunityController::class, 'apply'])
    ->middleware('throttle:public-uploads')
    ->name('learn.opportunities.apply');
