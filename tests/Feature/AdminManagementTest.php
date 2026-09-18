<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Contribution;
use App\Models\Problem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed basic admin
        Admin::create([
            'name' => 'Root Admin',
            'email' => 'admin@painpoint.com',
            'password' => bcrypt('password123'),
            'role' => 'Super Admin',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_view_users_management_page(): void
    {
        $admin = Admin::where('email', 'admin@painpoint.com')->first();
        $user = User::factory()->create([
            'role' => 'Community Member',
            'points' => 100,
        ]);

        $response = $this->actingAs($admin, 'admin')->get('/admin/users');
        $response->assertStatus(200);
    }

    public function test_admin_can_update_user_role_and_points(): void
    {
        $admin = Admin::where('email', 'admin@painpoint.com')->first();
        $user = User::factory()->create([
            'role' => 'Community Member',
            'points' => 10,
        ]);

        $response = $this->actingAs($admin, 'admin')->put("/admin/users/{$user->id}", [
            'role' => 'Moderator',
            'points' => 250,
            'reputation' => 150,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'role' => 'Moderator',
            'points' => 250,
        ]);
    }

    public function test_admin_can_view_and_verify_solutions(): void
    {
        $admin = Admin::where('email', 'admin@painpoint.com')->first();
        $user = User::factory()->create(['points' => 50]);

        $problem = Problem::create([
            'public_id' => 'PRB-TEST01',
            'title' => 'Test Problem Title',
            'slug' => 'test-problem-title',
            'description' => 'Test problem statement description for moderation tests.',
            'category_id' => 1,
            'category_slug' => 'healthcare',
            'category_name' => 'Healthcare',
            'urgency' => 'High',
            'scale' => 'National',
            'frequency' => 'Daily',
            'status' => 'approved',
            'submission_type' => 'anonymous',
            'is_published' => true,
        ]);

        $solution = Contribution::create([
            'problem_id' => $problem->id,
            'user_id' => $user->id,
            'type' => 'product',
            'title' => 'Open Source Ventilator',
            'content' => 'Low-cost rapid deployment design.',
            'contributor_name' => $user->name,
            'helpful_count' => 10,
        ]);

        $response = $this->actingAs($admin, 'admin')->get('/admin/solutions');
        $response->assertStatus(200);

        // Verify solution awards +50 points
        $acceptResponse = $this->actingAs($admin, 'admin')->post("/admin/solutions/{$solution->id}/accept");
        $acceptResponse->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'points' => 100, // 50 original + 50 reward
        ]);
    }

    public function test_admin_can_view_settings_overview(): void
    {
        $admin = Admin::where('email', 'admin@painpoint.com')->first();
        $response = $this->actingAs($admin, 'admin')->get('/admin/settings');
        $response->assertStatus(200);
    }
}
