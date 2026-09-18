<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use App\Models\PointsTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSolutionController extends Controller
{
    /**
     * Display listing of proposed community solutions.
     */
    public function index(Request $request)
    {
        $type = $request->query('type', 'all');
        $search = $request->query('search', '');

        $query = Contribution::with(['problem', 'user']);

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('content', 'LIKE', "%{$search}%")
                  ->orWhere('contributor_name', 'LIKE', "%{$search}%");
            });
        }

        $solutions = $query->orderBy('helpful_count', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Solutions/Index', [
            'solutions' => $solutions,
            'filters' => [
                'type' => $type,
                'search' => $search,
            ],
            'metrics' => [
                'total_solutions' => Contribution::count(),
            ],
        ]);
    }

    /**
     * Mark solution as accepted and award points.
     */
    public function accept(Request $request, $id)
    {
        $solution = Contribution::findOrFail($id);
        $solution->increment('helpful_count', 5);

        if ($solution->user_id) {
            PointsTransaction::create([
                'user_id' => $solution->user_id,
                'points' => 50,
                'event_type' => 'solution_verified',
                'description' => "Verified community solution for '{$solution->title}'",
            ]);

            User::where('id', $solution->user_id)->increment('points', 50);
        }

        return back()->with('success', "Solution marked as community-verified (+50 pts awarded).");
    }

    /**
     * Delete inappropriate or spam solution.
     */
    public function destroy($id)
    {
        $solution = Contribution::findOrFail($id);
        $title = $solution->title;
        $solution->delete();

        return back()->with('success', "Solution '{$title}' removed.");
    }
}
