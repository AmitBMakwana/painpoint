<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    /**
     * Display listing of platform users.
     */
    public function index(Request $request)
    {
        $role = $request->query('role', 'all');
        $search = $request->query('search', '');

        $query = User::withCount([
            'problems as problems_count',
            'contributions as solutions_count',
            'supports as supports_count',
        ]);

        if ($role !== 'all') {
            $query->where('role', $role);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('username', 'LIKE', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $roles = [
            'Super Admin',
            'Admin',
            'Moderator',
            'Principal Bio-Systems Architect',
            'Adaptive Learning Specialist',
            'Agri-Logistics Engineer',
            'Municipal Systems Fellow',
            'Accessibility Advocate & Engineer',
            'Community Member',
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'role' => $role,
                'search' => $search,
            ],
            'availableRoles' => $roles,
            'metrics' => [
                'total_users' => User::count(),
                'admins_count' => User::where('role', 'LIKE', '%Admin%')->count(),
                'members_count' => User::where('role', 'Community Member')->count(),
            ],
        ]);
    }

    /**
     * Update user role and reputation points.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'role' => ['required', 'string', 'max:100'],
            'points' => ['nullable', 'integer', 'min:0'],
            'reputation' => ['nullable', 'integer', 'min:0'],
        ]);

        $user->update([
            'role' => $validated['role'],
            'points' => $validated['points'] ?? $user->points,
            'reputation' => $validated['reputation'] ?? $user->reputation,
        ]);

        return back()->with('success', "User {$user->name} profile and role updated.");
    }

    /**
     * Delete user permanently.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $name = $user->name;
        $user->delete();

        return back()->with('success', "User {$name} deleted.");
    }
}
