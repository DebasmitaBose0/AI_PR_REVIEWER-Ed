'use server';

import { getUserTier, canConnectRepository, canCreateReview } from './subscription';

export interface RateLimitCheckResult {
  allowed: boolean;
  reason?: string;
  tier: 'FREE' | 'PRO';
}

export async function checkRepositoryRateLimit(userId: string): Promise<RateLimitCheckResult> {
  const tier = await getUserTier(userId);
  const allowed = await canConnectRepository(userId);

  if (!allowed) {
    return {
      allowed: false,
      reason: 'Free tier limit reached for connected repositories (Max: 5). Please upgrade to Pro for unlimited repositories.',
      tier,
    };
  }

  return { allowed: true, tier };
}

export async function checkReviewRateLimit(userId: string, repositoryId: string): Promise<RateLimitCheckResult> {
  const tier = await getUserTier(userId);
  const allowed = await canCreateReview(userId, repositoryId);

  if (!allowed) {
    return {
      allowed: false,
      reason: 'Free tier limit reached for reviews on this repository (Max: 5/repo). Please upgrade to Pro for unlimited reviews.',
      tier,
    };
  }

  return { allowed: true, tier };
}
