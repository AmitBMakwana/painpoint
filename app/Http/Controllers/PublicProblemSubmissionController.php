<?php

namespace App\Http\Controllers;

use App\Domain\Problems\ProblemSubmissionService;
use App\Models\Problem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PublicProblemSubmissionController extends Controller
{
    protected ProblemSubmissionService $submissionService;

    public function __construct(ProblemSubmissionService $submissionService)
    {
        $this->submissionService = $submissionService;
    }

    /**
     * Show the public submission page.
     */
    public function create(Request $request)
    {
        $categories = [
            ['slug' => 'healthcare', 'name' => 'Healthcare & MedTech', 'icon' => 'HeartPulse'],
            ['slug' => 'education', 'name' => 'Education & EdTech', 'icon' => 'GraduationCap'],
            ['slug' => 'infrastructure', 'name' => 'Civic Infrastructure & Smart Cities', 'icon' => 'Building2'],
            ['slug' => 'fintech', 'name' => 'Fintech & Financial Inclusion', 'icon' => 'Wallet'],
            ['slug' => 'agriculture', 'name' => 'Agriculture & Agritech', 'icon' => 'Sprout'],
            ['slug' => 'sustainability', 'name' => 'Sustainability & CleanTech', 'icon' => 'Leaf'],
            ['slug' => 'workplace', 'name' => 'Workplace & Remote Work', 'icon' => 'Briefcase'],
            ['slug' => 'accessibility', 'name' => 'Accessibility & Inclusion', 'icon' => 'Accessibility'],
            ['slug' => 'ecommerce', 'name' => 'E-Commerce & Logistics', 'icon' => 'Truck'],
            ['slug' => 'community', 'name' => 'Community & Social Impact', 'icon' => 'Users'],
            ['slug' => 'consumer', 'name' => 'Consumer & Everyday Living', 'icon' => 'Sparkles'],
            ['slug' => 'technology', 'name' => 'Developer Tools & Cloud', 'icon' => 'Code2'],
        ];

        $supportedLanguages = [
            ['code' => 'en', 'name' => 'English', 'flag' => '🇺🇸'],
            ['code' => 'hi', 'name' => 'हिन्दी (Hindi)', 'flag' => '🇮🇳'],
            ['code' => 'gu', 'name' => 'ગુજરાતી (Gujarati)', 'flag' => '🇮🇳'],
            ['code' => 'es', 'name' => 'Español (Spanish)', 'flag' => '🇪🇸'],
            ['code' => 'fr', 'name' => 'Français (French)', 'flag' => '🇫🇷'],
            ['code' => 'de', 'name' => 'Deutsch (German)', 'flag' => '🇩🇪'],
            ['code' => 'ar', 'name' => 'العربية (Arabic)', 'flag' => '🇸🇦'],
        ];

        return Inertia::render('Problems/PublicSubmit', [
            'categories' => $categories,
            'supportedLanguages' => $supportedLanguages,
            'initialCategory' => $request->query('category', 'community'),
            'isAuthenticated' => Auth::check(),
            'currentUser' => Auth::user(),
        ]);
    }

    /**
     * Handle submission without authentication required.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:8', 'max:255'],
            'description' => ['required', 'string', 'min:20', 'max:10000'],
            'category_slug' => ['required', 'string', 'max:100'],
            'language_code' => ['nullable', 'string', 'max:10'],
            'voice_transcript' => ['nullable', 'string', 'max:10000'],
            'country' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'locality' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'affected_group' => ['nullable', 'string', 'max:255'],
            'scale' => ['nullable', 'in:individual,team,community,regional,global'],
            'frequency' => ['nullable', 'in:hourly,daily,weekly,monthly,occasional'],
            'urgency' => ['nullable', 'in:low,medium,high,critical'],
            'submission_type' => ['required', 'in:anonymous,identified'],
            
            // Optional contact fields
            'contact.name' => ['nullable', 'string', 'max:255'],
            'contact.email' => ['nullable', 'email', 'max:255'],
            'contact.phone' => ['nullable', 'string', 'max:50'],
            'contact.mobile' => ['nullable', 'string', 'max:50'],
            'contact.organization' => ['nullable', 'string', 'max:255'],
            'contact.role_title' => ['nullable', 'string', 'max:255'],
            'contact.address' => ['nullable', 'string', 'max:500'],
            'contact.address_line1' => ['nullable', 'string', 'max:255'],
            'contact.address_line2' => ['nullable', 'string', 'max:255'],
            'contact.city' => ['nullable', 'string', 'max:100'],
            'contact.state' => ['nullable', 'string', 'max:100'],
            'contact.postal_code' => ['nullable', 'string', 'max:20'],
            'contact.country' => ['nullable', 'string', 'max:100'],
            'contact.preferred_contact_method' => ['nullable', 'in:email,phone,whatsapp,any'],
            'contact.allow_public_attribution' => ['nullable', 'boolean'],
            'contact.additional_info' => ['nullable', 'string', 'max:1000'],

            // Media & links
            'links' => ['nullable', 'array', 'max:10'],
            'links.*.url' => ['nullable', 'url', 'max:1000'],
            'links.*.title' => ['nullable', 'string', 'max:255'],
            'files' => ['nullable', 'array', 'max:5'],
            'files.*' => ['nullable', 'file', 'max:20480'], // 20MB limit per file
        ]);

        $files = $request->file('files', []);
        $authUserId = Auth::id();

        $problem = $this->submissionService->submit($validated, $files, $authUserId);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Problem submitted successfully.',
                'problem' => $problem,
                'reference_id' => $problem->public_id,
            ], 201);
        }

        return redirect()->route('problems.submitted', ['reference' => $problem->public_id])
            ->with('success', "Problem submitted successfully! Reference ID: {$problem->public_id}");
    }

    /**
     * Confirmation view after submission.
     */
    public function submitted(Request $request)
    {
        $reference = $request->query('reference');
        $problem = Problem::where('public_id', $reference)->first();

        return Inertia::render('Problems/SubmittedConfirmation', [
            'referenceId' => $reference,
            'problem' => $problem,
        ]);
    }

    /**
     * Real-time duplicate checker as user types title.
     */
    public function checkDuplicates(Request $request)
    {
        $query = $request->query('q', '');
        if (strlen($query) < 3) {
            return response()->json(['results' => []]);
        }

        $results = Problem::where(function ($q) use ($query) {
            $q->where('title', 'LIKE', "%{$query}%")
              ->orWhere('description', 'LIKE', "%{$query}%");
        })
        ->select('id', 'public_id', 'slug', 'title', 'category_name', 'support_count', 'status')
        ->take(5)
        ->get();

        return response()->json(['results' => $results]);
    }
}
