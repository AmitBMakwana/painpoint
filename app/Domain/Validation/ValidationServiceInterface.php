<?php

namespace App\Domain\Validation;

interface ValidationServiceInterface
{
    public function recordValidation(int $problemId, int $userId, string $vote, ?string $frequency = null, ?int $painLevel = null): array;
    public function getValidationSummary(int $problemId): array;
}
