<?php

namespace App\Domain\Problems;

use App\Models\Problem;
use App\Models\ProblemContact;
use App\Models\ProblemLink;
use App\Models\ProblemMedia;
use App\Models\PointsTransaction;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProblemSubmissionService
{
    /**
     * Submit a problem anonymously or with contact details.
     *
     * @param array $validated
     * @param array<UploadedFile> $files
     * @param int|null $authUserId
     * @return Problem
     */
    public function submit(array $validated, array $files = [], ?int $authUserId = null): Problem
    {
        return DB::transaction(function () use ($validated, $files, $authUserId) {
            $year = date('Y');
            $randomSuffix = strtoupper(Str::random(5));
            $publicId = "PRB-{$year}-{$randomSuffix}";

            // Ensure unique public_id
            while (Problem::where('public_id', $publicId)->exists()) {
                $randomSuffix = strtoupper(Str::random(5));
                $publicId = "PRB-{$year}-{$randomSuffix}";
            }

            $slugBase = Str::slug($validated['title']);
            $slug = $slugBase ?: 'problem-' . strtolower($randomSuffix);
            $slugCount = Problem::where('slug', 'LIKE', "{$slug}%")->count();
            if ($slugCount > 0) {
                $slug .= '-' . ($slugCount + 1);
            }

            $categoryMap = [
                'healthcare' => 'Healthcare & MedTech',
                'education' => 'Education & EdTech',
                'infrastructure' => 'Civic Infrastructure & Smart Cities',
                'fintech' => 'Fintech & Financial Inclusion',
                'agriculture' => 'Agriculture & Agritech',
                'sustainability' => 'Sustainability & CleanTech',
                'workplace' => 'Workplace & Remote Work',
                'accessibility' => 'Accessibility & Inclusion',
                'ecommerce' => 'E-Commerce & Logistics',
                'community' => 'Community & Social Impact',
                'consumer' => 'Consumer & Everyday Living',
                'technology' => 'Developer Tools & Cloud',
            ];

            $categorySlug = $validated['category_slug'] ?? 'community';
            $categoryName = $categoryMap[$categorySlug] ?? ucfirst($categorySlug);

            $submissionType = $validated['submission_type'] ?? 'anonymous';
            $status = 'pending'; // Requires admin review by default

            $problem = Problem::create([
                'public_id' => $publicId,
                'slug' => $slug,
                'language_code' => $validated['language_code'] ?? 'en',
                'category_slug' => $categorySlug,
                'category_name' => $categoryName,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'voice_transcript' => $validated['voice_transcript'] ?? null,
                'voice_recording_url' => $validated['voice_recording_url'] ?? null,
                'country' => $validated['country'] ?? null,
                'state' => $validated['state'] ?? null,
                'city' => $validated['city'] ?? null,
                'locality' => $validated['locality'] ?? null,
                'postal_code' => $validated['postal_code'] ?? null,
                'affected_group' => $validated['affected_group'] ?? null,
                'scale' => $validated['scale'] ?? 'regional',
                'frequency' => $validated['frequency'] ?? 'daily',
                'urgency' => $validated['urgency'] ?? 'medium',
                'status' => $status,
                'submission_type' => $submissionType,
                'user_id' => $authUserId,
                'support_count' => 1, // Submitter is first supporter
                'contribution_count' => 0,
                'comment_count' => 0,
                'views_count' => 1,
                'is_pinned' => false,
                'is_featured' => false,
            ]);

            // Save Contact Information if identified
            if ($submissionType === 'identified' && !empty($validated['contact'])) {
                $contact = $validated['contact'];
                $addressParts = array_filter([
                    $contact['address_line1'] ?? $contact['address'] ?? null,
                    $contact['address_line2'] ?? null,
                    $contact['state'] ?? null,
                    $contact['country'] ?? null,
                ]);

                ProblemContact::create([
                    'problem_id' => $problem->id,
                    'name' => $contact['name'] ?? null,
                    'mobile' => $contact['mobile'] ?? $contact['phone'] ?? null,
                    'email' => $contact['email'] ?? null,
                    'address' => !empty($addressParts) ? implode(', ', $addressParts) : null,
                    'city' => $contact['city'] ?? $problem->city,
                    'postal_code' => $contact['postal_code'] ?? $contact['pin'] ?? $problem->postal_code,
                    'additional_info' => $contact['organization'] ?? $contact['additional_info'] ?? null,
                ]);
            }

            // Save Links if provided
            if (!empty($validated['links']) && is_array($validated['links'])) {
                foreach ($validated['links'] as $linkData) {
                    if (is_array($linkData) && !empty($linkData['url'])) {
                        ProblemLink::create([
                            'problem_id' => $problem->id,
                            'url' => $linkData['url'],
                            'title' => $linkData['title'] ?? null,
                            'description' => $linkData['description'] ?? null,
                        ]);
                    } elseif (is_string($linkData) && !empty(trim($linkData))) {
                        ProblemLink::create([
                            'problem_id' => $problem->id,
                            'url' => trim($linkData),
                            'title' => 'Reference Link',
                        ]);
                    }
                }
            }

            // Save Media Uploads
            if (!empty($files)) {
                foreach ($files as $file) {
                    if ($file instanceof UploadedFile) {
                        $path = $file->store("problems/{$problem->public_id}", 'public');
                        $mime = $file->getMimeType();
                        $type = 'document';
                        if (str_starts_with($mime, 'image/')) {
                            $type = 'image';
                        } elseif (str_starts_with($mime, 'video/')) {
                            $type = 'video';
                        } elseif (str_starts_with($mime, 'audio/')) {
                            $type = 'voice';
                        }

                        ProblemMedia::create([
                            'problem_id' => $problem->id,
                            'type' => $type,
                            'url' => Storage::url($path),
                            'file_name' => $file->getClientOriginalName(),
                            'file_size' => $file->getSize(),
                            'mime_type' => $mime,
                            'title' => $file->getClientOriginalName(),
                        ]);
                    }
                }
            }

            // Award points if authenticated user submitted
            if ($authUserId) {
                PointsTransaction::create([
                    'user_id' => $authUserId,
                    'points' => 25,
                    'event_type' => 'problem_submitted',
                    'description' => "Submitted problem '{$problem->title}'",
                ]);

                User::where('id', $authUserId)->increment('points', 25);
            }

            return $problem->load(['contact', 'media', 'links']);
        });
    }
}
