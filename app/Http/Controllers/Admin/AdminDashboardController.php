<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use App\Models\Problem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Display admin overview dashboard.
     */
    public function index()
    {
        $metrics = [
            'total_problems' => Problem::count(),
            'pending_review' => Problem::where('status', 'pending')->count(),
            'approved_problems' => Problem::where('status', 'approved')->count(),
            'pinned_problems' => Problem::where('is_pinned', true)->count(),
            'total_users' => User::count(),
            'total_contributions' => Contribution::count(),
        ];

        $pendingProblems = Problem::with(['contact', 'media'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        $pinnedProblems = Problem::where('is_pinned', true)
            ->orderBy('pin_order', 'asc')
            ->take(5)
            ->get();

        $recentProblems = Problem::with(['contact'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'adminUser' => Auth::guard('admin')->user(),
            'metrics' => $metrics,
            'pendingProblems' => $pendingProblems,
            'pinnedProblems' => $pinnedProblems,
            'recentProblems' => $recentProblems,
        ]);
    }
}
