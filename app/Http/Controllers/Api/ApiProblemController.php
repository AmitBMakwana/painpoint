<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Problem;
use App\Models\ProblemContact;
use App\Models\ProblemMedia;
use App\Models\Support;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ApiProblemController extends Controller
{
    /**
     * List approved problems with filtering, search, and pagination for mobile apps.
     */
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category', 'all');
        $search = $request->query('search', '');
        $urgency = $request->query('urgency', 'all');
        $sortBy = $request->query('sort', 'trending');

        $query = Problem::where('status', 'Approved')
            ->where('is_published', true)
            ->withCount(['supports', 'contributions']);

        if ($category !== 'all' && !empty($category)) {
            $query->where('category_slug', $category);
        }

        if ($urgency !== 'all' && !empty($urgency)) {
            $query->where('urgency', $urgency);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('city', 'LIKE', "%{$search}%");
            });
        }

        // Sorting
        switch ($sortBy) {
            case 'most_supported':
                $query->orderBy('support_count', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'pinned':
                $query->orderBy('is_pinned', 'desc')->orderBy('pin_order', 'asc');
                break;
            case 'trending':
            default:
                $query->orderBy('is_pinned', 'desc')
                      ->orderBy('support_count', 'desc')
                      ->orderBy('created_at', 'desc');
                break;
        }

        $perPage = min((int) $request->query('per_page', 15), 50);
        $problems = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $problems->items(),
            'meta' => [
                'current_page' => $problems->currentPage(),
                'last_page' => $problems->lastPage(),
                'per_page' => $problems->perPage(),
                'total' => $problems->total(),
                'has_more' => $problems->hasMorePages(),
            ],
        ]);
    }

    /**
     * Get detailed problem statement, top 3 solutions, and metadata.
     */
    public function show(string $identifier): JsonResponse
    {
        $problem = Problem::where('slug', $identifier)
            ->orWhere('public_id', $identifier)
            ->orWhere('id', $identifier)
            ->with([
                'media',
                'links',
                'contributions' => function ($q) {
                    $q->with('user')->orderBy('helpful_count', 'desc');
                },
            ])
            ->first();

        if (!$problem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Problem not found.',
            ], 404);
        }

        // Deterministic Top 3 Solutions
        $topSolutions = $problem->contributions->take(3);

        return response()->json([
            'status' => 'success',
            'problem' => $problem,
            'top_solutions' => $topSolutions,
            'all_solutions_count' => $problem->contributions->count(),
            'supports_count' => $problem->support_count,
        ]);
    }

    /**
     * Public problem submission from mobile app (no login required).
     */
    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:10', 'max:255'],
            'description' => ['required', 'string', 'min:30'],
            'category_slug' => ['required', 'string'],
            'urgency' => ['nullable', 'string', 'in:Low,Medium,High,Critical'],
            'scale' => ['nullable', 'string', 'in:Individual,Team,Organization,City,National,Global'],
            'frequency' => ['nullable', 'string', 'in:Rarely,Weekly,Daily,Continuous'],
            'country' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'locality' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'submission_type' => ['required', 'string', 'in:anonymous,identified'],
            'voice_transcript' => ['nullable', 'string'],
            // Contact details if identified
            'contact_name' => ['nullable', 'string', 'max:150'],
            'contact_mobile' => ['nullable', 'string', 'max:25'],
            'contact_email' => ['nullable', 'email', 'max:150'],
            'contact_address' => ['nullable', 'string', 'max:255'],
            'contact_city' => ['nullable', 'string', 'max:100'],
            'contact_postal_code' => ['nullable', 'string', 'max:20'],
            'contact_additional_info' => ['nullable', 'string', 'max:500'],
            'links' => ['nullable', 'array'],
        ]);

        $categoryName = Str::title(str_replace('-', ' ', $validated['category_slug']));

        // Generate Public ID: PRB-YYYY-XXXX
        $publicId = 'PRB-' . date('Y') . '-' . strtoupper(Str::random(4));
        $baseSlug = Str::slug($validated['title']);
        $slug = $baseSlug . '-' . strtolower(Str::random(4));

        $problem = Problem::create([
            'user_id' => $request->user()?->id,
            'public_id' => $publicId,
            'slug' => $slug,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'voice_transcript' => $validated['voice_transcript'] ?? null,
            'category_slug' => $validated['category_slug'],
            'category_name' => $categoryName,
            'urgency' => $validated['urgency'] ?? 'Medium',
            'scale' => $validated['scale'] ?? 'City',
            'frequency' => $validated['frequency'] ?? 'Daily',
            'country' => $validated['country'] ?? 'India',
            'state' => $validated['state'] ?? null,
            'city' => $validated['city'] ?? $validated['contact_city'] ?? null,
            'locality' => $validated['locality'] ?? null,
            'postal_code' => $validated['postal_code'] ?? $validated['contact_postal_code'] ?? null,
            'status' => 'Pending',
            'submission_type' => $validated['submission_type'],
            'is_published' => false,
            'support_count' => 1,
            'contribution_count' => 0,
        ]);

        // Save submitter identity if provided
        if ($validated['submission_type'] === 'identified') {
            ProblemContact::create([
                'problem_id' => $problem->id,
                'name' => $validated['contact_name'] ?? null,
                'mobile' => $validated['contact_mobile'] ?? null,
                'email' => $validated['contact_email'] ?? null,
                'address' => $validated['contact_address'] ?? null,
                'city' => $validated['contact_city'] ?? $validated['city'] ?? null,
                'postal_code' => $validated['contact_postal_code'] ?? $validated['postal_code'] ?? null,
                'additional_info' => $validated['contact_additional_info'] ?? null,
            ]);
        }

        // Handle uploaded media files (images, audio, docs)
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $path = $file->store('problems/media', 'public');
                $mime = $file->getClientMimeType();
                $type = str_contains($mime, 'image') ? 'image' : (str_contains($mime, 'video') ? 'video' : 'document');

                ProblemMedia::create([
                    'problem_id' => $problem->id,
                    'file_path' => '/storage/' . $path,
                    'file_type' => $type,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $mime,
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Problem submitted successfully and queued for curation.',
            'problem' => [
                'id' => $problem->id,
                'public_id' => $problem->public_id,
                'slug' => $problem->slug,
                'title' => $problem->title,
                'status' => $problem->status,
                'submission_type' => $problem->submission_type,
            ],
        ], 201);
    }

    /**
     * Increment "I experience this too" support count.
     */
    public function support(Request $request, int $id): JsonResponse
    {
        $problem = Problem::findOrFail($id);

        Support::create([
            'problem_id' => $problem->id,
            'user_id' => $request->user()?->id,
            'session_token' => Str::random(32),
        ]);

        $problem->increment('support_count');

        return response()->json([
            'status' => 'success',
            'message' => 'Problem support recorded.',
            'support_count' => $problem->fresh()->support_count,
        ]);
    }

    /**
     * Leaderboard endpoint for mobile card-stack and podium.
     */
    public function leaderboard(): JsonResponse
    {
        $pinnedProblems = Problem::where('status', 'Approved')
            ->where('is_pinned', true)
            ->orderBy('pin_order', 'asc')
            ->take(3)
            ->get();

        $topRanked = Problem::where('status', 'Approved')
            ->orderBy('support_count', 'desc')
            ->take(15)
            ->get();

        return response()->json([
            'status' => 'success',
            'pinned_problems' => $pinnedProblems,
            'top_ranked' => $topRanked,
        ]);
    }

    /**
     * Categories / domains list.
     */
    public function categories(): JsonResponse
    {
        $categories = [
            ['slug' => 'healthcare', 'name' => 'Healthcare & MedTech', 'icon' => 'HeartPulse'],
            ['slug' => 'education', 'name' => 'Education & EdTech', 'icon' => 'GraduationCap'],
            ['slug' => 'infrastructure', 'name' => 'Civic Infrastructure & Smart Cities', 'icon' => 'Building2'],
            ['slug' => 'fintech', 'name' => 'Fintech & Financial Inclusion', 'icon' => 'Wallet'],
            ['slug' => 'agriculture', 'name' => 'Agriculture & Agritech', 'icon' => 'Sprout'],
            ['slug' => 'sustainability', 'name' => 'Sustainability & CleanTech', 'icon' => 'Leaf'],
            ['slug' => 'workplace', 'name' => 'Workplace & Remote Work', 'icon' => 'Briefcase'],
            ['slug' => 'accessibility', 'name' => 'Accessibility & Inclusion', 'icon' => 'Eye'],
            ['slug' => 'ecommerce', 'name' => 'E-Commerce & Logistics', 'icon' => 'ShoppingBag'],
            ['slug' => 'community', 'name' => 'Community & Social Impact', 'icon' => 'Users'],
        ];

        return response()->json([
            'status' => 'success',
            'categories' => $categories,
        ]);
    }
}
