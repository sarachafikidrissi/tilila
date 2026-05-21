<?php

use App\Http\Controllers\NewsletterSubscriptionController;
use Illuminate\Support\Facades\Route;

// create routes group protected by admin middlware
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    
});
