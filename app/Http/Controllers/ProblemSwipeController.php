<?php

namespace App\Http\Controllers;

use App\Models\Problem;
use App\Models\Support;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProblemSwipeController extends Controller
{
    /**
     * Display card swipe discovery interface.
     */
    public function index(Request $request)
    {
        $problems = Problem::with(['media'])
            ->where(function ($query) {
                $query->where('status', 'approved')
                      ->orWhere('status', 'pending'); // Show pending if early stage
            })
            ->orderBy('is_pinned', 'desc')
            ->orderBy('pin_order', 'asc')
            ->orderBy('support_count', 'desc')
            ->take(30)
            ->get()
            ->map(function ($p) {
                $cover = $p->media->firstWhere('is_cover', true) ?? $p->media->first();
                return [
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
                    'city' => $p->city,
                    'state' => $p->state,
                    'country' => $p->country,
                    'support_count' => (int) $p->support_count,
                    'is_pinned' => (bool) $p->is_pinned,
                    'pin_order' => $p->pin_order,
                    'cover_image' => $cover ? $cover->file_path : null,
                    'created_at' => $p->created_at ? $p->created_at->diffForHumans() : 'Recently',
                ];
            });

        return Inertia::render('Problems/SwipeExplore', [
            'initialCards' => $problems,
            'isAuthenticated' => Auth::check(),
        ]);
    }

    /**
     * Support a problem (swiping right or clicking I experience this).
     */
    public function support(Request $request, $id)
    {
        $problem = Problem::findOrFail($id);
        $userId = Auth::id();
        $sessionToken = session()->getId();

        // Check duplicate support
        $alreadySupported = Support::where('problem_id', $problem->id)
            ->where(function ($q) use ($userId, $sessionToken) {
                if ($userId) {
                    $q->where('user_id', $userId);
                } else {
                    $q->where('session_token', $sessionToken);
                }
            })
            ->exists();

        if (!$alreadySupported) {
            Support::create([
                'problem_id' => $problem->id,
                'user_id' => $userId,
                'session_token' => $sessionToken,
            ]);

            $problem->increment('support_count');
        }

        return response()->json([
            'success' => true,
            'supported' => true,
            'support_count' => $problem->fresh()->support_count,
            'message' => 'Your validation has been recorded!',
        ]);
    }
}
