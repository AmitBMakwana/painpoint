<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Contribution;
use App\Models\Problem;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    /**
     * Display platform configuration and category overview.
     */
    public function index()
    {
        $categories = [
            ['slug' => 'healthcare', 'name' => 'Healthcare & MedTech', 'problems_count' => Problem::where('category_slug', 'healthcare')->count()],
            ['slug' => 'education', 'name' => 'Education & EdTech', 'problems_count' => Problem::where('category_slug', 'education')->count()],
            ['slug' => 'infrastructure', 'name' => 'Civic Infrastructure & Smart Cities', 'problems_count' => Problem::where('category_slug', 'infrastructure')->count()],
            ['slug' => 'fintech', 'name' => 'Fintech & Financial Inclusion', 'problems_count' => Problem::where('category_slug', 'fintech')->count()],
            ['slug' => 'agriculture', 'name' => 'Agriculture & Agritech', 'problems_count' => Problem::where('category_slug', 'agriculture')->count()],
            ['slug' => 'sustainability', 'name' => 'Sustainability & CleanTech', 'problems_count' => Problem::where('category_slug', 'sustainability')->count()],
            ['slug' => 'workplace', 'name' => 'Workplace & Remote Work', 'problems_count' => Problem::where('category_slug', 'workplace')->count()],
            ['slug' => 'accessibility', 'name' => 'Accessibility & Inclusion', 'problems_count' => Problem::where('category_slug', 'accessibility')->count()],
            ['slug' => 'ecommerce', 'name' => 'E-Commerce & Logistics', 'problems_count' => Problem::where('category_slug', 'ecommerce')->count()],
            ['slug' => 'community', 'name' => 'Community & Social Impact', 'problems_count' => Problem::where('category_slug', 'community')->count()],
        ];

        return Inertia::render('Admin/Settings', [
            'categories' => $categories,
            'systemStats' => [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'database_driver' => config('database.default'),
                'total_problems' => Problem::count(),
                'total_solutions' => Contribution::count(),
                'total_users' => User::count(),
                'total_admins' => Admin::count(),
            ],
        ]);
    }
}
