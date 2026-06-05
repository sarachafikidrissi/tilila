<?php

use App\Http\Controllers\Expert\ArticleController;
use App\Http\Controllers\Expert\ContactRequestController;
use App\Http\Controllers\Expert\DashboardController;
use App\Http\Controllers\Expert\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('contact-requests', [ContactRequestController::class, 'index'])->name('contact-requests.index');
Route::patch('contact-requests/{contactRequest}', [ContactRequestController::class, 'update'])->name('contact-requests.update');
Route::get('network', [DashboardController::class, 'network'])->name('network');
Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');

Route::get('articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('articles/create', [ArticleController::class, 'create'])->name('articles.create');
Route::post('articles', [ArticleController::class, 'store'])->name('articles.store');
Route::get('articles/{article}/edit', [ArticleController::class, 'edit'])->name('articles.edit');
Route::patch('articles/{article}', [ArticleController::class, 'update'])->name('articles.update');
Route::delete('articles/{article}', [ArticleController::class, 'destroy'])->name('articles.destroy');
