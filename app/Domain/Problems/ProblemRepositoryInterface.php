<?php

namespace App\Domain\Problems;

interface ProblemRepositoryInterface
{
    public function getTrending(int $limit = 10): array;
    public function getBySlug(string $slug): ?array;
    public function getByDomain(string $domainSlug, int $page = 1): array;
}
