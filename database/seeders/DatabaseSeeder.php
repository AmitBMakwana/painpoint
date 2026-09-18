<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Contribution;
use App\Models\PointsTransaction;
use App\Models\Problem;
use App\Models\ProblemContact;
use App\Models\ProblemLink;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Admin Account
        Admin::firstOrCreate(
            ['email' => 'admin@painpoint.com'],
            [
                'name' => 'PainPoint Platform Admin',
                'password' => Hash::make('password123'),
                'role' => 'Super Admin',
            ]
        );

        // 2. Seed Community Users & Contributors
        $usersData = [
            [
                'name' => 'Dr. Aris Thorne',
                'username' => 'aristhorne',
                'email' => 'aris@medtech.org',
                'role' => 'Principal Bio-Systems Architect',
                'reputation' => 1420,
                'points' => 3850,
                'headline' => 'Medical device engineer solving ER triage congestion & diagnostic delays',
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Priya Sharma',
                'username' => 'priyasharma',
                'email' => 'priya@eduflow.in',
                'role' => 'Adaptive Learning Specialist',
                'reputation' => 1180,
                'points' => 3120,
                'headline' => 'Architecting offline-first digital classrooms for rural primary schools',
                'avatar_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Carlos Rivera',
                'username' => 'carlosrivera',
                'email' => 'carlos@agritech.co',
                'role' => 'Agri-Logistics Engineer',
                'reputation' => 960,
                'points' => 2740,
                'headline' => 'Building solar cold chain networks to stop smallholder harvest loss',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Elena Rostova',
                'username' => 'elenarostova',
                'email' => 'elena@cleancity.eu',
                'role' => 'Municipal Systems Fellow',
                'reputation' => 820,
                'points' => 2290,
                'headline' => 'Urban water telemetry & smart stormwater infrastructure researcher',
                'avatar_url' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Kenji Sato',
                'username' => 'kenjisato',
                'email' => 'kenji@accessibility.jp',
                'role' => 'Accessibility Advocate & Engineer',
                'reputation' => 740,
                'points' => 1980,
                'headline' => 'Designing multi-modal transit kiosks for screen-reader and haptic users',
                'avatar_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
            ],
        ];

        $createdUsers = [];
        foreach ($usersData as $u) {
            $user = User::firstOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'username' => $u['username'],
                    'password' => Hash::make('password123'),
                    'role' => $u['role'],
                    'reputation' => $u['reputation'],
                    'points' => $u['points'],
                    'headline' => $u['headline'],
                    'avatar_url' => $u['avatar_url'],
                ]
            );
            $createdUsers[] = $user;
        }

        // 3. Seed Realistic Problems with Pinned Top 3 & Community Data
        $problemsData = [
            [
                'public_id' => 'PRB-2026-MED01',
                'title' => 'Emergency Room Pediatric Triage Overcrowding Due to Manual Paper Charting',
                'slug' => 'emergency-room-pediatric-triage-overcrowding',
                'category_slug' => 'healthcare',
                'category_name' => 'Healthcare & MedTech',
                'language_code' => 'en',
                'description' => 'In urban district hospitals, ER nurses spend 14+ minutes per critical patient on paper forms before digital entry. This creates a bottleneck where pediatric patients with respiratory distress wait an average of 42 minutes for physician evaluation.',
                'country' => 'United States',
                'state' => 'Illinois',
                'city' => 'Chicago',
                'locality' => 'Cook County Health District',
                'postal_code' => '60612',
                'affected_group' => 'Triage Nurses, Pediatric Patients, ER Doctors',
                'scale' => 'Regional',
                'frequency' => 'Daily',
                'urgency' => 'Critical',
                'status' => 'Approved',
                'submission_type' => 'Identified',
                'support_count' => 1248,
                'contribution_count' => 38,
                'is_pinned' => true,
                'pin_order' => 1,
                'is_featured' => true,
                'user_id' => $createdUsers[0]->id,
                'contact' => [
                    'name' => 'Dr. Aris Thorne',
                    'email' => 'aris@medtech.org',
                    'mobile' => '+1 (312) 555-0192',
                    'address' => 'Cook County Health District, IL, United States',
                    'city' => 'Chicago',
                    'postal_code' => '60612',
                    'additional_info' => 'Illinois Emergency Medicine Network - Director of Pediatric Intake',
                ],
                'links' => [
                    ['url' => 'https://pediatrics.aappublications.org', 'title' => 'AAP Pediatric Emergency Standards Whitepaper'],
                ],
            ],
            [
                'public_id' => 'PRB-2026-EDU02',
                'title' => 'Complete Broadband Blackout Halts Digital STEM Curricula for 12,000 Rural Pupils',
                'slug' => 'broadband-blackout-halts-rural-stem-curricula',
                'category_slug' => 'education',
                'category_name' => 'Education & EdTech',
                'language_code' => 'en',
                'description' => 'Over 45 government secondary schools in undulating plateau districts lack consistent cellular 4G/5G signals. Cloud-based education platforms fail completely without persistent connection, blocking interactive math simulations.',
                'country' => 'India',
                'state' => 'Maharashtra',
                'city' => 'Gadchiroli',
                'locality' => 'Eastern District Block 4',
                'postal_code' => '442605',
                'affected_group' => 'Rural Secondary Students, Science Teachers',
                'scale' => 'Regional',
                'frequency' => 'Daily',
                'urgency' => 'High',
                'status' => 'Approved',
                'submission_type' => 'Identified',
                'support_count' => 892,
                'contribution_count' => 24,
                'is_pinned' => true,
                'pin_order' => 2,
                'is_featured' => true,
                'user_id' => $createdUsers[1]->id,
                'contact' => [
                    'name' => 'Priya Sharma',
                    'email' => 'priya@eduflow.in',
                    'mobile' => '+91 98230 45678',
                    'address' => 'Eastern District Block 4, Maharashtra, India',
                    'city' => 'Gadchiroli',
                    'postal_code' => '442605',
                    'additional_info' => 'Vidya Bloom Rural Initiative - Regional EdTech Lead',
                ],
                'links' => [
                    ['url' => 'https://unesdoc.unesco.org', 'title' => 'UNESCO Offline Education Report'],
                ],
            ],
            [
                'public_id' => 'PRB-2026-AGR03',
                'title' => 'High-Heat Tomato & Chili Post-Harvest Spoilage Due to Inaccessible Cold Storage',
                'slug' => 'tomato-chili-post-harvest-spoilage-cold-storage',
                'category_slug' => 'agriculture',
                'category_name' => 'Agriculture & Agritech',
                'language_code' => 'en',
                'description' => 'Smallholder farmers lose between 32% and 40% of delicate fruit crops within 36 hours of harvest because commercial chilling centers charge prohibitive bulk minimums and sit over 60 km from farm gates.',
                'country' => 'Mexico',
                'state' => 'Sinaloa',
                'city' => 'Culiacán',
                'locality' => 'Valle de San Lorenzo',
                'postal_code' => '80000',
                'affected_group' => 'Independent Smallholder Farmers, Co-op Leaders',
                'scale' => 'Community',
                'frequency' => 'Daily',
                'urgency' => 'High',
                'status' => 'Approved',
                'submission_type' => 'Identified',
                'support_count' => 645,
                'contribution_count' => 19,
                'is_pinned' => true,
                'pin_order' => 3,
                'is_featured' => true,
                'user_id' => $createdUsers[2]->id,
                'contact' => [
                    'name' => 'Carlos Rivera',
                    'email' => 'carlos@agritech.co',
                    'mobile' => '+52 667 890 1234',
                    'address' => 'Valle de San Lorenzo, Sinaloa, Mexico',
                    'city' => 'Culiacán',
                    'postal_code' => '80000',
                    'additional_info' => 'Cooperativa Agrícola Del Valle - Supply Chain Manager',
                ],
                'links' => [
                    ['url' => 'https://fao.org', 'title' => 'FAO Food Loss Prevention Guidelines'],
                ],
            ],
            [
                'public_id' => 'PRB-2026-CIV04',
                'title' => 'Unmonitored Flash Flooding at Subterranean Pedestrian Underpasses',
                'slug' => 'flash-flooding-subterranean-pedestrian-underpasses',
                'category_slug' => 'infrastructure',
                'category_name' => 'Civic Infrastructure & Smart Cities',
                'language_code' => 'en',
                'description' => 'Heavy summer downpours submerge central railway subway crossings by up to 1.2 meters in under 20 minutes with zero automated signage, stranding wheelchair commuters and daily workers.',
                'country' => 'Germany',
                'state' => 'North Rhine-Westphalia',
                'city' => 'Cologne',
                'locality' => 'Ehrenfeld / Hansaring',
                'postal_code' => '50672',
                'affected_group' => 'Daily Commuters, Wheelchair Users, Cyclists',
                'scale' => 'Community',
                'frequency' => 'Occasionally',
                'urgency' => 'Critical',
                'status' => 'Pending Review',
                'submission_type' => 'Anonymous',
                'support_count' => 312,
                'contribution_count' => 8,
                'is_pinned' => false,
                'is_featured' => false,
                'user_id' => null,
            ],
            [
                'public_id' => 'PRB-2026-ACC05',
                'title' => 'Touchscreen Public Kiosks Lack Tactile & Audio Alternatives for Visually Impaired',
                'slug' => 'touchscreen-kiosks-lack-tactile-audio-accessibility',
                'category_slug' => 'accessibility',
                'category_name' => 'Accessibility & Inclusion',
                'language_code' => 'en',
                'description' => 'Modern subway ticketing machines, self-checkout registers, and hospital check-in terminals have transitioned entirely to flat, smooth touchscreens with no tactile markers or working 3.5mm audio jacks.',
                'country' => 'Japan',
                'state' => 'Tokyo',
                'city' => 'Tokyo',
                'locality' => 'Shinjuku & Shibuya Hubs',
                'postal_code' => '160-0022',
                'affected_group' => 'Visually Impaired Citizens, Elderly Transit Users',
                'scale' => 'Global',
                'frequency' => 'Daily',
                'urgency' => 'High',
                'status' => 'Approved',
                'submission_type' => 'Identified',
                'support_count' => 520,
                'contribution_count' => 15,
                'is_pinned' => false,
                'is_featured' => false,
                'user_id' => $createdUsers[4]->id,
            ],
            [
                'public_id' => 'PRB-2026-FIN06',
                'title' => 'Cross-Border Remittance Fees Devour 11% of Migrant Construction Earnings',
                'slug' => 'cross-border-remittance-fees-devour-earnings',
                'category_slug' => 'fintech',
                'category_name' => 'Fintech & Financial Inclusion',
                'language_code' => 'en',
                'description' => 'Informal foreign workers sending $150 monthly to families in Southeast Asia lose up to $18 per transaction through hidden FX spread and manual payout agency markups.',
                'country' => 'United Arab Emirates',
                'state' => 'Dubai',
                'city' => 'Dubai',
                'locality' => 'Al Quoz Industrial',
                'postal_code' => '00000',
                'affected_group' => 'Migrant Workers, Overseas Beneficiaries',
                'scale' => 'Global',
                'frequency' => 'Monthly',
                'urgency' => 'Medium',
                'status' => 'Approved',
                'submission_type' => 'Anonymous',
                'support_count' => 430,
                'contribution_count' => 11,
                'is_pinned' => false,
                'is_featured' => false,
                'user_id' => null,
            ],
        ];

        foreach ($problemsData as $pData) {
            $contact = $pData['contact'] ?? null;
            $links = $pData['links'] ?? [];
            unset($pData['contact'], $pData['links']);

            $problem = Problem::firstOrCreate(
                ['public_id' => $pData['public_id']],
                $pData
            );

            if ($contact && !$problem->contact) {
                ProblemContact::create(array_merge($contact, ['problem_id' => $problem->id]));
            }

            if (!empty($links) && $problem->links()->count() === 0) {
                foreach ($links as $l) {
                    ProblemLink::create(array_merge($l, ['problem_id' => $problem->id]));
                }
            }
        }
    }
}
