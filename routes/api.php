<?php

use App\Http\Controllers\Api\ApiAuthController;
use App\Http\Controllers\Api\ApiProblemController;
use App\Http\Controllers\Api\ApiSolutionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PainPoint Mobile & Public RESTful API (v1)
|--------------------------------------------------------------------------
|
| Fully API-driven endpoints for iOS, Android (React Native / Flutter),
| third-party integrations, and headless clients.
|
*/

Route::prefix('v1')->group(function () {

    // -------------------------------------------------------------------------
    // Mobile Authentication & Identity
    // -------------------------------------------------------------------------
    Route::prefix('auth')->group(function () {
        Route::post('/register', [ApiAuthController::class, 'register']);
        Route::post('/login', [ApiAuthController::class, 'login']);
        Route::get('/me', [ApiAuthController::class, 'me']);
    });

    // -------------------------------------------------------------------------
    // Problem Discovery & Submission (Public & Mobile Driven)
    // -------------------------------------------------------------------------
    Route::get('/problems', [ApiProblemController::class, 'index']);
    Route::get('/problems/leaderboard', [ApiProblemController::class, 'leaderboard']);
    Route::get('/problems/{identifier}', [ApiProblemController::class, 'show']);
    Route::post('/problems/submit', [ApiProblemController::class, 'submit']); // No login required
    Route::post('/problems/{id}/support', [ApiProblemController::class, 'support']); // "I experience this too"

    // -------------------------------------------------------------------------
    // Solutions & Crowdsourced Innovations
    // -------------------------------------------------------------------------
    Route::get('/problems/{problemId}/solutions', [ApiSolutionController::class, 'index']);
    Route::post('/problems/{problemId}/solutions', [ApiSolutionController::class, 'store']);
    Route::post('/solutions/{id}/vote', [ApiSolutionController::class, 'vote']);

    // -------------------------------------------------------------------------
    // Categories / Domains Taxonomy
    // -------------------------------------------------------------------------
    Route::get('/categories', [ApiProblemController::class, 'categories']);

    // -------------------------------------------------------------------------
    // Health & System Ping
    // -------------------------------------------------------------------------
    Route::get('/ping', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'platform' => 'PainPoint Engine v1.0',
            'api_version' => 'v1',
            'mobile_ready' => true,
        ]);
    });
});
