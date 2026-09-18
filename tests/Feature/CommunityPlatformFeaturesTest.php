<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Problem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CommunityPlatformFeaturesTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_view_public_problem_submission_page_without_login(): void
    {
        $response = $this->get('/submit-problem');
        $response->assertStatus(200);
    }

    public function test_anyone_can_submit_problem_anonymously(): void
    {
        $payload = [
            'title' => 'City Hospital Oxygen Pressure Telemetry Disconnects During Shift Turnover',
            'description' => 'The central ICU telemetry gateway drops data packets during nursing shift handovers, causing unmonitored alarms for up to 12 minutes.',
            'category_slug' => 'healthcare',
            'language_code' => 'en',
            'urgency' => 'critical',
            'scale' => 'regional',
            'frequency' => 'daily',
            'country' => 'India',
            'city' => 'Surat',
            'submission_type' => 'anonymous',
        ];

        $response = $this->post('/submit-problem', $payload);
        $response->assertRedirect();

        $this->assertDatabaseHas('problems', [
            'title' => 'City Hospital Oxygen Pressure Telemetry Disconnects During Shift Turnover',
            'submission_type' => 'anonymous',
            'status' => 'pending',
            'country' => 'India',
            'city' => 'Surat',
        ]);
    }

    public function test_anyone_can_submit_problem_with_contact_identity(): void
    {
        $payload = [
            'title' => 'Groundwater Borewell Depletion in Sector 9 Agricultural Zone',
            'description' => 'Over 80 smallholder vegetable growers have experienced 45-meter drops in aquifer levels over 2 seasons due to unmetered industrial extraction.',
            'category_slug' => 'agriculture',
            'language_code' => 'en',
            'urgency' => 'high',
            'scale' => 'community',
            'frequency' => 'daily',
            'country' => 'India',
            'state' => 'Gujarat',
            'city' => 'Vadodara',
            'postal_code' => '390001',
            'submission_type' => 'identified',
            'contact' => [
                'name' => 'Kishore Patel',
                'mobile' => '+91 99887 76655',
                'email' => 'kishore.patel@farmers.in',
                'address' => 'Sector 9 Farm Co-op, Vadodara, Gujarat',
                'city' => 'Vadodara',
                'postal_code' => '390001',
                'additional_info' => 'Secretary, Vadodara Vegetable Growers Guild',
            ],
        ];

        $response = $this->post('/submit-problem', $payload);
        $response->assertRedirect();

        $problem = Problem::where('title', 'Groundwater Borewell Depletion in Sector 9 Agricultural Zone')->first();
        $this->assertNotNull($problem);
        $this->assertEquals('identified', $problem->submission_type);

        $this->assertDatabaseHas('problem_contacts', [
            'problem_id' => $problem->id,
            'name' => 'Kishore Patel',
            'mobile' => '+91 99887 76655',
            'email' => 'kishore.patel@farmers.in',
        ]);
    }

    public function test_realtime_duplicate_checker_endpoint(): void
    {
        $response = $this->get('/api/problems/check-duplicates?q=Pediatric');
        $response->assertStatus(200);
        $response->assertJsonStructure(['results']);
    }

    public function test_leaderboard_page_renders_successfully(): void
    {
        $response = $this->get('/leaderboard');
        $response->assertStatus(200);
    }

    public function test_card_swipe_explore_page_renders_successfully(): void
    {
        $response = $this->get('/explore/swipe');
        $response->assertStatus(200);
    }

    public function test_support_problem_endpoint_increments_count(): void
    {
        $problem = Problem::create([
            'public_id' => 'PRB-TEST-SUPP',
            'slug' => 'test-supp',
            'title' => 'Test Support Increment Problem',
            'description' => 'A valid test problem description here for testing increment.',
            'category_slug' => 'healthcare',
            'category_name' => 'Healthcare & MedTech',
            'status' => 'approved',
            'support_count' => 10,
        ]);
        $initialCount = $problem->support_count;

        $response = $this->post("/api/problems/{$problem->id}/support");
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        $this->assertEquals($initialCount + 1, $problem->fresh()->support_count);
    }

    public function test_admin_authentication_and_dashboard_access(): void
    {
        $admin = Admin::firstOrCreate(
            ['email' => 'testadmin@painpoint.com'],
            [
                'name' => 'Test Admin',
                'password' => Hash::make('secret123'),
                'role' => 'Super Admin',
            ]
        );

        $loginResponse = $this->post('/admin/login', [
            'email' => 'testadmin@painpoint.com',
            'password' => 'secret123',
        ]);
        $loginResponse->assertRedirect(route('admin.dashboard'));

        $this->actingAs($admin, 'admin')
            ->get('/admin/dashboard')
            ->assertStatus(200);
    }

    public function test_admin_can_approve_and_pin_problem(): void
    {
        $admin = Admin::firstOrCreate(
            ['email' => 'testadmin@painpoint.com'],
            [
                'name' => 'Test Admin',
                'password' => Hash::make('secret123'),
                'role' => 'Super Admin',
            ]
        );

        $problem = Problem::create([
            'public_id' => 'PRB-TEST-001',
            'slug' => 'test-unapproved-problem',
            'title' => 'Unapproved Problem Waiting For Review',
            'description' => 'A detailed description of the unapproved issue that needs admin approval.',
            'category_slug' => 'infrastructure',
            'category_name' => 'Civic Infrastructure & Smart Cities',
            'status' => 'pending',
            'submission_type' => 'anonymous',
        ]);

        $this->actingAs($admin, 'admin')
            ->post("/admin/problems/{$problem->id}/approve")
            ->assertSessionHas('success');

        $this->assertEquals('approved', $problem->fresh()->status);

        // Pin problem
        $this->actingAs($admin, 'admin')
            ->post("/admin/problems/{$problem->id}/pin", [
                'is_pinned' => true,
                'pin_order' => 1,
            ])
            ->assertSessionHas('success');

        $this->assertTrue($problem->fresh()->is_pinned);
        $this->assertEquals(1, $problem->fresh()->pin_order);
    }
}
