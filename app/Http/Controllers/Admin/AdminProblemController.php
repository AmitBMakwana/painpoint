<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Problem;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminProblemController extends Controller
{
    /**
     * Display listing of problems for moderation.
     */
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');
        $category = $request->query('category', 'all');

        $query = Problem::with(['contact', 'media', 'links', 'user']);

        if ($status !== 'all') {
            if ($status === 'pinned') {
                $query->where('is_pinned', true);
            } else {
                $query->where('status', $status);
            }
        }

        if ($category !== 'all') {
            $query->where('category_slug', $category);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('public_id', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('city', 'LIKE', "%{$search}%")
                  ->orWhereHas('contact', function ($cq) use ($search) {
                      $cq->where('name', 'LIKE', "%{$search}%")
                         ->orWhere('email', 'LIKE', "%{$search}%")
                         ->orWhere('phone', 'LIKE', "%{$search}%");
                  });
            });
        }

        $problems = $query->orderBy('is_pinned', 'desc')
            ->orderBy('pin_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Problems/Index', [
            'problems' => $problems,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'category' => $category,
            ],
            'counts' => [
                'all' => Problem::count(),
                'pending' => Problem::where('status', 'pending')->count(),
                'approved' => Problem::where('status', 'approved')->count(),
                'rejected' => Problem::where('status', 'rejected')->count(),
                'pinned' => Problem::where('is_pinned', true)->count(),
            ],
        ]);
    }

    /**
     * Approve problem.
     */
    public function approve(Request $request, $id)
    {
        $problem = Problem::findOrFail($id);
        $problem->update([
            'status' => 'approved',
            'approved_at' => now(),
            'rejection_reason' => null,
            'admin_notes' => $request->input('admin_notes', $problem->admin_notes),
        ]);

        return back()->with('success', "Problem #{$problem->public_id} approved successfully.");
    }

    /**
     * Reject problem with a reason.
     */
    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $problem = Problem::findOrFail($id);
        $problem->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['reason'],
            'admin_notes' => $validated['admin_notes'] ?? $problem->admin_notes,
        ]);

        return back()->with('info', "Problem #{$problem->public_id} marked as rejected.");
    }

    /**
     * Pin problem to top with pin order (e.g. 1, 2, 3).
     */
    public function pin(Request $request, $id)
    {
        $problem = Problem::findOrFail($id);
        $isPinned = $request->boolean('is_pinned', !$problem->is_pinned);
        $pinOrder = $request->input('pin_order', 1);

        $problem->update([
            'is_pinned' => $isPinned,
            'pin_order' => $isPinned ? (int) $pinOrder : null,
        ]);

        $statusMsg = $isPinned ? "pinned with order #{$pinOrder}" : 'unpinned';
        return back()->with('success', "Problem #{$problem->public_id} {$statusMsg}.");
    }

    /**
     * Toggle featured status.
     */
    public function feature(Request $request, $id)
    {
        $problem = Problem::findOrFail($id);
        $isFeatured = $request->boolean('is_featured', !$problem->is_featured);

        $problem->update([
            'is_featured' => $isFeatured,
        ]);

        $statusMsg = $isFeatured ? 'featured on community spotlight' : 'removed from spotlight';
        return back()->with('success', "Problem #{$problem->public_id} {$statusMsg}.");
    }

    /**
     * Delete problem.
     */
    public function destroy($id)
    {
        $problem = Problem::findOrFail($id);
        $ref = $problem->public_id;
        $problem->delete();

        return back()->with('success', "Problem #{$ref} deleted permanently.");
    }
}
