<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Experience Routes
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/explore', function () {
    return Inertia::render('Explore', [
        'initialQuery' => request('q', ''),
        'initialDomain' => request('domain', 'all'),
    ]);
})->name('explore');

Route::get('/trending', function () {
    return Inertia::render('Trending');
})->name('trending');

Route::get('/domains', function () {
    return Inertia::render('Domains/Index');
})->name('domains.index');

Route::get('/domains/{slug}', function ($slug) {
    return Inertia::render('Domains/Show', ['slug' => $slug]);
})->name('domains.show');

Route::get('/problems/create', function () {
    return Inertia::render('Problems/Create');
})->name('problems.create');

Route::get('/problems/{slug}', function ($slug) {
    return Inertia::render('Problems/Show', ['slug' => $slug]);
})->name('problems.show');

Route::get('/solutions', function () {
    return Inertia::render('Solutions/Index');
})->name('solutions.index');

Route::get('/pricing', function () {
    return Inertia::render('Pricing');
})->name('pricing');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// User Profile Routes
Route::get('/profile/{username?}', [AuthController::class, 'showProfile'])->name('profile.view');
Route::get('/app/profile', [AuthController::class, 'showProfile'])->name('profile.show');
Route::get('/app/saved', function () {
    return Inertia::render('Profile/Show', ['defaultTab' => 'saved']);
})->name('profile.saved');
