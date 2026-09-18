<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ApiAuthController extends Controller
{
    /**
     * Mobile user registration.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'headline' => ['nullable', 'string', 'max:255'],
        ]);

        $baseUsername = Str::slug($validated['name']);
        $username = $baseUsername . '-' . rand(100, 999);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $username,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'Community Member',
            'reputation' => 0,
            'points' => 20, // Welcome signup bonus
            'headline' => $validated['headline'] ?? 'Community Member & Problem Solver',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Registration successful.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'points' => $user->points,
                'headline' => $user->headline,
            ],
        ], 201);
    }

    /**
     * Mobile user login.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password credentials.',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'reputation' => $user->reputation,
                'points' => $user->points,
                'headline' => $user->headline,
                'bio' => $user->bio,
            ],
        ]);
    }

    /**
     * Get authenticated user profile details.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated.',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'user' => $user->loadCount(['problems', 'contributions', 'supports']),
        ]);
    }
}
