<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use App\Models\Problem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiSolutionController extends Controller
{
    /**
     * List all solutions for a given problem.
     */
    public function index(int $problemId): JsonResponse
    {
        $problem = Problem::findOrFail($problemId);

        $solutions = Contribution::where('problem_id', $problem->id)
            ->with('user')
            ->orderBy('helpful_count', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'problem_id' => $problem->id,
            'solutions' => $solutions,
        ]);
    }

    /**
     * Submit a community solution for a problem from mobile.
     */
    public function store(Request $request, int $problemId): JsonResponse
    {
        $problem = Problem::findOrFail($problemId);

        $validated = $request->validate([
            'type' => ['required', 'string', 'in:workaround,product,concept'],
            'title' => ['required', 'string', 'min:5', 'max:255'],
            'content' => ['required', 'string', 'min:20'],
            'contributor_name' => ['nullable', 'string', 'max:100'],
            'contributor_role' => ['nullable', 'string', 'max:100'],
        ]);

        $user = $request->user();

        $solution = Contribution::create([
            'problem_id' => $problem->id,
            'user_id' => $user?->id,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'contributor_name' => $validated['contributor_name'] ?? ($user?->name ?? 'Anonymous Architect'),
            'contributor_role' => $validated['contributor_role'] ?? ($user?->role ?? 'Community Contributor'),
            'helpful_count' => 0,
        ]);

        $problem->increment('contribution_count');

        return response()->json([
            'status' => 'success',
            'message' => 'Solution proposal submitted successfully.',
            'solution' => $solution,
        ], 201);
    }

    /**
     * Vote on a community solution.
     */
    public function vote(Request $request, int $id): JsonResponse
    {
        $solution = Contribution::findOrFail($id);
        $solution->increment('helpful_count');

        return response()->json([
            'status' => 'success',
            'message' => 'Upvote recorded.',
            'helpful_count' => $solution->fresh()->helpful_count,
        ]);
    }
}
