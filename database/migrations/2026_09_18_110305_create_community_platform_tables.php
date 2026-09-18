<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Dedicated Administrators Table
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('role')->default('Admin'); // Super Admin, Admin, Moderator
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Comprehensive Problems Table
        Schema::create('problems', function (Blueprint $table) {
            $table->id();
            $table->string('public_id')->unique(); // e.g. PRB-2026-001248
            $table->string('slug')->unique();
            $table->string('language_code')->default('en'); // en, hi, gu, es, fr, ar, etc.
            $table->string('category_slug')->index();
            $table->string('category_name');
            $table->string('title');
            $table->longText('description');
            
            // Voice submission artifacts
            $table->text('voice_transcript')->nullable();
            $table->string('voice_recording_url')->nullable();

            // Location
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable()->index();
            $table->string('locality')->nullable();
            $table->string('postal_code')->nullable();

            // Impact & Scale
            $table->string('affected_group')->nullable(); // Individual, Community, City, Business, Government, Environment
            $table->string('scale')->nullable(); // Personal, Local, City, Regional, National, Global
            $table->string('frequency')->nullable(); // One-time, Daily, Weekly, Monthly, Occasionally, Continuous
            $table->string('urgency')->default('Medium'); // Low, Medium, High, Critical

            // Status & Moderation
            $table->string('status')->default('Pending Review')->index(); // Draft, Pending Review, Approved, Rejected, Needs More Info, Solved, Archived
            $table->string('submission_type')->default('Anonymous'); // Anonymous vs Identified
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            
            // Counters
            $table->integer('support_count')->default(0);
            $table->integer('contribution_count')->default(0);
            $table->integer('comment_count')->default(0);
            $table->integer('views_count')->default(0);

            // Curation & Pinning
            $table->boolean('is_pinned')->default(false)->index();
            $table->integer('pin_order')->default(0);
            $table->boolean('is_featured')->default(false)->index();
            $table->text('rejection_reason')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });

        // 3. Private Problem Contacts (Isolated from Public Discovery)
        Schema::create('problem_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')->constrained('problems')->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->string('mobile')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->text('additional_info')->nullable();
            $table->timestamps();
        });

        // 4. Problem Media (Images, Videos, Documents)
        Schema::create('problem_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')->constrained('problems')->cascadeOnDelete();
            $table->string('type'); // image, video, document, voice
            $table->text('url');
            $table->string('file_name')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('mime_type')->nullable();
            $table->string('title')->nullable();
            $table->timestamps();
        });

        // 5. Problem External Links
        Schema::create('problem_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')->constrained('problems')->cascadeOnDelete();
            $table->text('url');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 6. Supports ("❤️ Support This Problem")
        Schema::create('supports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')->constrained('problems')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('session_token')->nullable()->index();
            $table->timestamps();

            $table->unique(['problem_id', 'user_id']);
        });

        // 7. Community Contributions
        Schema::create('contributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('problem_id')->constrained('problems')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('contributor_name')->default('Anonymous Solver');
            $table->string('type'); // solution, evidence, research, resource, root_cause, volunteer
            $table->string('title');
            $table->longText('content');
            $table->integer('helpful_count')->default(0);
            $table->timestamps();
        });

        // 8. Contributor Points Transactions for Leaderboard
        Schema::create('points_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('points');
            $table->string('event_type'); // problem_submitted, evidence_added, helpful_solution, support_given
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('points_transactions');
        Schema::dropIfExists('contributions');
        Schema::dropIfExists('supports');
        Schema::dropIfExists('problem_links');
        Schema::dropIfExists('problem_media');
        Schema::dropIfExists('problem_contacts');
        Schema::dropIfExists('problems');
        Schema::dropIfExists('admins');
    }
};
