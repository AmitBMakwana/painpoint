<?php

namespace Tests\Feature;

use App\Models\Problem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MobileApiDrivenTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_ping_endpoint(): void
    {
        $response = $this->getJson('/api/v1/ping');
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'api_version' => 'v1',
                'mobile_ready' => true,
            ]);
    }

    public function test_mobile_can_fetch_categories(): void
    {
        $response = $this->getJson('/api/v1/categories');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'categories' => [
                    '*' => ['slug', 'name'],
                ],
            ]);
    }

    public function test_mobile_user_can_submit_problem_without_login(): void
    {
        $response = $this->postJson('/api/v1/problems/submit', [
            'title' => 'Mobile App Problem Statement Test',
            'description' => 'This is a long description describing an urgent mobile reported challenge in healthcare.',
            'category_slug' => 'healthcare',
            'urgency' => 'High',
            'scale' => 'City',
            'frequency' => 'Daily',
            'submission_type' => 'identified',
            'contact_name' => 'Mobile Submitter',
            'contact_mobile' => '+91 98765 43210',
            'contact_email' => 'mobilesubmitter@example.com',
            'contact_city' => 'Mumbai',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'problem' => [
                    'title' => 'Mobile App Problem Statement Test',
                    'status' => 'Pending',
                    'submission_type' => 'identified',
                ],
            ]);

        $this->assertDatabaseHas('problems', [
            'title' => 'Mobile App Problem Statement Test',
            'status' => 'Pending',
        ]);

        $this->assertDatabaseHas('problem_contacts', [
            'name' => 'Mobile Submitter',
            'mobile' => '+91 98765 43210',
        ]);
    }

    public function test_mobile_can_fetch_problems_list(): void
    {
        Problem::create([
            'public_id' => 'PRB-2026-LIVE',
            'title' => 'Approved Live Problem Statement',
            'slug' => 'approved-live-problem-statement',
            'description' => 'A valid problem statement available on the public mobile feed.',
            'category_slug' => 'healthcare',
            'category_name' => 'Healthcare & MedTech',
            'urgency' => 'High',
            'scale' => 'City',
            'frequency' => 'Daily',
            'status' => 'Approved',
            'submission_type' => 'anonymous',
            'is_published' => true,
            'support_count' => 5,
        ]);

        $response = $this->getJson('/api/v1/problems');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => ['id', 'public_id', 'title', 'support_count'],
                ],
                'meta' => ['current_page', 'total'],
            ]);
    }

    public function test_mobile_user_can_support_problem(): void
    {
        $problem = Problem::create([
            'public_id' => 'PRB-2026-SUPP',
            'title' => 'Problem to Support from Mobile',
            'slug' => 'problem-to-support-from-mobile',
            'description' => 'Valid problem statement description for supporting.',
            'category_slug' => 'healthcare',
            'category_name' => 'Healthcare',
            'urgency' => 'High',
            'scale' => 'City',
            'frequency' => 'Daily',
            'status' => 'Approved',
            'submission_type' => 'anonymous',
            'is_published' => true,
            'support_count' => 10,
        ]);

        $response = $this->postJson("/api/v1/problems/{$problem->id}/support");
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'support_count' => 11,
            ]);

        $this->assertEquals(11, $problem->fresh()->support_count);
    }

    public function test_mobile_user_auth_register_and_login(): void
    {
        // Register
        $regResponse = $this->postJson('/api/v1/auth/register', [
            'name' => 'Dev Mobile User',
            'email' => 'devuser@mobile.com',
            'password' => 'secret12345',
            'headline' => 'React Native Developer',
        ]);

        $regResponse->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'name' => 'Dev Mobile User',
                    'email' => 'devuser@mobile.com',
                ],
            ]);

        // Login
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'devuser@mobile.com',
            'password' => 'secret12345',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'name' => 'Dev Mobile User',
                    'email' => 'devuser@mobile.com',
                ],
            ]);
    }
}
