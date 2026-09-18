<?php

namespace App\Domain\AI;

interface AIProviderInterface
{
    /**
     * Classify problem domain, category, tags, and audience.
     */
    public function classifyProblem(string $title, string $description): array;

    /**
     * Detect semantic duplicate problems without blocking user submission.
     */
    public function detectDuplicates(string $title, string $description, array $existingCandidates): array;

    /**
     * Analyze solution fit and relevance against the target problem.
     * Generates an auditable, versioned signal without overriding deterministic ranking.
     */
    public function analyzeSolutionFit(string $problemSummary, string $solutionSummary): array;
}
