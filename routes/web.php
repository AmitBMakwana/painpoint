<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminProblemController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\ProblemSwipeController;
use App\Http\Controllers\PublicProblemSubmissionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// -----------------------------------------------------------------------------
// Public Platform Discovery Routes
// -----------------------------------------------------------------------------
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/explore', function () {
    return Inertia::render('Explore', [
        'initialQuery' => request('q', ''),
        'initialDomain' => request('domain', 'all'),
    ]);
})->name('explore');

Route::get('/explore/swipe', [ProblemSwipeController::class, 'index'])->name('explore.swipe');
Route::post('/api/problems/{id}/support', [ProblemSwipeController::class, 'support'])->name('problems.support');

Route::get('/trending', function () {
    return Inertia::render('Trending');
})->name('trending');

Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');

Route::get('/domains', function () {
    return Inertia::render('Domains/Index');
})->name('domains.index');

Route::get('/domains/{slug}', function ($slug) {
    return Inertia::render('Domains/Show', ['slug' => $slug]);
})->name('domains.show');

// -----------------------------------------------------------------------------
// Public / Anonymous Problem Submission (NO LOGIN REQUIRED)
// -----------------------------------------------------------------------------
Route::get('/submit-problem', [PublicProblemSubmissionController::class, 'create'])->name('problems.public-create');
Route::post('/submit-problem', [PublicProblemSubmissionController::class, 'store'])->name('problems.public-store');
Route::get('/submit-problem/confirmation', [PublicProblemSubmissionController::class, 'submitted'])->name('problems.submitted');
Route::get('/api/problems/check-duplicates', [PublicProblemSubmissionController::class, 'checkDuplicates'])->name('problems.check-duplicates');

// Legacy route redirect or fallback
Route::get('/problems/create', function () {
    return redirect()->route('problems.public-create');
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

// -----------------------------------------------------------------------------
// Standard User Authentication Routes
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Admin Moderation Suite (Separate Admin Auth & Dashboard)
// -----------------------------------------------------------------------------
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    Route::middleware('auth:admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/problems', [AdminProblemController::class, 'index'])->name('problems.index');
        Route::post('/problems/{id}/approve', [AdminProblemController::class, 'approve'])->name('problems.approve');
        Route::post('/problems/{id}/reject', [AdminProblemController::class, 'reject'])->name('problems.reject');
        Route::post('/problems/{id}/pin', [AdminProblemController::class, 'pin'])->name('problems.pin');
        Route::post('/problems/{id}/feature', [AdminProblemController::class, 'feature'])->name('problems.feature');
        Route::delete('/problems/{id}', [AdminProblemController::class, 'destroy'])->name('problems.destroy');
    });
});
