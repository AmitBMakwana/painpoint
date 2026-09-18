<?php

namespace App\Domain\Reputation;

interface ReputationServiceInterface
{
    public function awardPoints(int $userId, string $event, int $points): int;
    public function getUserReputation(int $userId): int;
}
