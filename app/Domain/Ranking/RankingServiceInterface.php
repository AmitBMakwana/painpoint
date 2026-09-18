<?php

namespace App\Domain\Ranking;

interface RankingServiceInterface
{
    /**
     * Deterministically calculate ranking score based on:
     * - Net community upvotes
     * - Practitioner validation agreement
     * - Discussion helpfulness ratio
     * - Recency decay factor
     * - Versioned AI problem-fit signal (supporting weight only)
     */
    public function calculateSolutionScore(int $solutionId): float;

    /**
     * Compute and snapshot Top 3 community-validated solutions for a given problem.
     * Uses strict deterministic tie-breakers (score -> helpful votes -> validation -> ID).
     */
    public function rankProblemSolutions(int $problemId, int $limit = 3): array;
}
