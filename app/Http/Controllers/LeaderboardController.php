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
     * Display the problem-wise community leaderboard.
     * Shows problems on top based on number of interacting people and contributions.
     */
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'interactions'); // interactions, contributions, supports
        $category = $request->query('category', 'all');

        $problemQuery = Problem::with(['contact', 'user'])
            ->where(function ($q) {
                $q->where('status', 'approved')
                  ->orWhere('status', 'Approved');
            });

        if ($category !== 'all') {
            $problemQuery->where('category_slug', $category);
        }

        if ($sort === 'contributions') {
            $problemQuery->orderBy('contribution_count', 'desc')
                         ->orderBy('support_count', 'desc');
        } elseif ($sort === 'supports') {
            $problemQuery->orderBy('support_count', 'desc')
                         ->orderBy('contribution_count', 'desc');
        } else {
            // Default: Combined community interaction and contribution weight
            $problemQuery->orderByRaw('(support_count * 2 + contribution_count * 5 + comment_count) DESC');
        }

        $problems = $problemQuery->take(30)->get();

        $rankedProblems = $problems->map(function ($p, $index) {
            $rank = $index + 1;
            $interactionScore = ($p->support_count * 2) + ($p->contribution_count * 5) + $p->comment_count;

            $badge = null;
            if ($rank === 1) {
                $badge = '🥇 #1 Most Impacted Problem';
            } elseif ($rank === 2) {
                $badge = '🥈 #2 Critical Concern';
            } elseif ($rank === 3) {
                $badge = '🥉 #3 High Urgency';
            }

            return [
                'rank' => $rank,
                'id' => $p->id,
                'public_id' => $p->public_id,
                'slug' => $p->slug,
                'title' => $p->title,
                'description' => $p->description,
                'category_slug' => $p->category_slug,
                'category_name' => $p->category_name,
                'urgency' => $p->urgency,
                'scale' => $p->scale,
                'frequency' => $p->frequency,
                'country' => $p->country,
                'state' => $p->state,
                'city' => $p->city,
                'support_count' => (int) $p->support_count,
                'contribution_count' => (int) $p->contribution_count,
                'comment_count' => (int) $p->comment_count,
                'views_count' => (int) $p->views_count,
                'interaction_score' => $interactionScore,
                'is_pinned' => (bool) $p->is_pinned,
                'pin_order' => $p->pin_order,
                'badge' => $badge,
                'created_at' => $p->created_at ? $p->created_at->diffForHumans() : 'Recently',
            ];
        });

        // Top Contributors for secondary tab
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
            ->take(20)
            ->get()
            ->map(function ($user, $index) {
                return [
                    'rank' => $index + 1,
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'role' => $user->role,
                    'avatar_url' => $user->avatar_url,
                    'points' => (int) $user->points,
                    'reputation' => (int) $user->reputation,
                    'problems_count' => (int) $user->problems_count,
                    'solutions_count' => (int) $user->solutions_count,
                ];
            });

        $categories = [
            ['slug' => 'all', 'name' => 'All Categories'],
            ['slug' => 'healthcare', 'name' => 'Healthcare'],
            ['slug' => 'education', 'name' => 'Education'],
            ['slug' => 'agriculture', 'name' => 'Agriculture'],
            ['slug' => 'infrastructure', 'name' => 'Civic Infrastructure'],
            ['slug' => 'fintech', 'name' => 'Fintech'],
            ['slug' => 'accessibility', 'name' => 'Accessibility'],
        ];

        return Inertia::render('Leaderboard', [
            'rankedProblems' => $rankedProblems,
            'rankedUsers' => $users,
            'currentSort' => $sort,
            'currentCategory' => $category,
            'categories' => $categories,
            'communityStats' => [
                'totalInteractions' => Problem::sum('support_count'),
                'totalSolutions' => Problem::sum('contribution_count') ?: Contribution::count(),
                'totalProblems' => Problem::where('status', 'approved')->orWhere('status', 'Approved')->count(),
            ],
        ]);
    }
}
