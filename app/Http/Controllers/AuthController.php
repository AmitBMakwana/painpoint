<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Problem;
use App\Models\Support;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show registration page.
     */
    public function showRegister()
    {
        if (Auth::check()) {
            return redirect()->intended('/explore');
        }

        return Inertia::render('Auth/Register');
    }

    /**
     * Handle user registration.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::defaults()],
        ]);

        $baseUsername = Str::slug($validated['name']);
        $username = $baseUsername ?: 'user' . rand(1000, 9999);
        $counter = 1;
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter++;
        }

        $user = User::create([
            'name' => $validated['name'],
            'username' => $username,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'Community Member',
            'reputation' => 10,
            'points' => 50,
            'headline' => 'Community Member & Problem Hunter',
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended('/explore')->with('success', "Welcome to PainPoint, {$user->name}!");
    }

    /**
     * Show login page.
     */
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->intended('/explore');
        }

        return Inertia::render('Auth/Login');
    }

    /**
     * Handle authentication.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/explore')->with('success', 'Logged in successfully.');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Handle logout.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('info', 'You have been signed out.');
    }

    /**
     * View user profile by username or current authenticated user.
     */
    public function showProfile($username = null)
    {
        if ($username) {
            $user = User::where('username', $username)->first();
        } else {
            $user = Auth::user();
        }

        // If still null, redirect to login
        if (!$user) {
            return redirect()->route('login')->with('info', 'Please sign in to view your profile.');
        }

        $isOwner = Auth::check() && Auth::id() === $user->id;

        // User's submitted problems
        $userProblems = Problem::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // User's contributed solutions
        $userSolutions = Contribution::where('user_id', $user->id)
            ->with('problem')
            ->orderBy('created_at', 'desc')
            ->get();

        // Saved / supported problems
        $savedProblems = Problem::whereHas('supports', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('Profile/Show', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role ?? 'Community Member',
                'reputation' => (int) ($user->reputation ?? 10),
                'points' => (int) ($user->points ?? 50),
                'headline' => $user->headline ?? 'Community Problem Solver',
                'bio' => $user->bio ?? 'Active contributor discovering friction and building community solutions.',
                'avatar_url' => $user->avatar_url,
                'created_at' => $user->created_at ? $user->created_at->format('M Y') : '2026',
            ],
            'isOwner' => $isOwner,
            'userProblems' => $userProblems,
            'userSolutions' => $userSolutions,
            'savedProblems' => $savedProblems,
            'defaultTab' => request('tab', request()->routeIs('profile.saved') ? 'saved' : 'problems'),
        ]);
    }

    /**
     * Update profile details.
     */
    public function updateProfile(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'headline' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }
}
