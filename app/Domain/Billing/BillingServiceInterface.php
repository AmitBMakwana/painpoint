<?php

namespace App\Domain\Billing;

interface BillingServiceInterface
{
    public function getUserSubscriptionTier(int $userId): string; // 'free' | 'pro' | 'founder' | 'business'
    public function canAccessFeature(int $userId, string $featureKey): bool;
}
