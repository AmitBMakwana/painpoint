<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Problem;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    /**
     * Display the community leaderboard.
     */
    public function index(Request $request)
    {
        $timeframe = $request->query('timeframe', 'all_time');

        $users = User::select('id', 'name', 'username', 'role', 'avatar_url', 'reputation', 'points', 'created_at')
            ->withCount([
                'problems as problems_count' => function ($query) {
                    $query->where('status', 'approved');
                },
                'contributions as solutions_count' => function ($query) {
                    $query->where('status', 'published');
                },
            ])
            ->orderBy('points', 'desc')
            ->orderBy('reputation', 'desc')
            ->take(50)
            ->get();

        // Calculate badges and rank numbers
        $rankedUsers = $users->map(function ($user, $index) {
            $rank = $index + 1;
            $badge = null;
            if ($rank === 1) {
                $badge = '🥇 Grand Architect';
            } elseif ($rank === 2) {
                $badge = '🥈 Master Builder';
            } elseif ($rank === 3) {
                $badge = '🥉 Lead Problem Solver';
            } elseif ($rank <= 10) {
                $badge = '⭐ Elite Contributor';
            } else {
                $badge = '🚀 Active Explorer';
            }

            return [
                'rank' => $rank,
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
                'badge' => $badge,
                'points' => (int) $user->points,
                'reputation' => (int) $user->reputation,
                'problems_count' => (int) $user->problems_count,
                'solutions_count' => (int) $user->solutions_count,
                'joined_at' => $user->created_at->format('M Y'),
            ];
        });

        // Top 3 pinned problems for spotlight
        $topProblems = Problem::where('is_pinned', true)
            ->orWhere('status', 'approved')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('pin_order', 'asc')
            ->orderBy('support_count', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('Leaderboard', [
            'rankedUsers' => $rankedUsers,
            'topProblems' => $topProblems,
            'timeframe' => $timeframe,
            'communityStats' => [
                'totalMembers' => User::count(),
                'totalProblems' => Problem::where('status', 'approved')->count(),
                'totalSolutions' => Contribution::count(),
            ],
        ]);
    }
}
