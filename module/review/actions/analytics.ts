'use server';

import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export interface AnalyticsSummary {
  totalReviews: number;
  avgQualityScore: number;
  completedReviews: number;
  pendingReviews: number;
  failedReviews: number;
  recentReviewsCount: number;
  qualityDistribution: {
    scoreRange: string;
    count: number;
  }[];
}

export async function getReviewAnalyticsAction(repositoryId?: string): Promise<{
  success: boolean;
  data?: AnalyticsSummary;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: 'Unauthorized user session' };
    }

    const whereClause: Record<string, unknown> = {
      repository: {
        userid: session.user.id,
      },
    };

    if (repositoryId) {
      whereClause.repositoryId = repositoryId;
    }

    const [totalReviews, completedReviews, pendingReviews, failedReviews, reviewsWithScores] =
      await Promise.all([
        prisma.review.count({ where: whereClause }),
        prisma.review.count({ where: { ...whereClause, status: 'completed' } }),
        prisma.review.count({ where: { ...whereClause, status: 'pending' } }),
        prisma.review.count({ where: { ...whereClause, status: 'failed' } }),
        prisma.review.findMany({
          where: {
            ...whereClause,
            qualityScore: { not: null },
          },
          select: { qualityScore: true, createdAt: true },
        }),
      ]);

    const totalScore = reviewsWithScores.reduce((acc: number, curr: { qualityScore: number | null }) => acc + (curr.qualityScore || 0), 0);
    const avgQualityScore =
      reviewsWithScores.length > 0 ? Math.round((totalScore / reviewsWithScores.length) * 10) / 10 : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentReviewsCount = reviewsWithScores.filter(
      (r: { createdAt: Date }) => new Date(r.createdAt) >= sevenDaysAgo,
    ).length;

    const buckets: Record<string, number> = {
      '90-100 (Excellent)': 0,
      '75-89 (Good)': 0,
      '50-74 (Needs Work)': 0,
      '0-49 (Poor)': 0,
    };

    reviewsWithScores.forEach((r: { qualityScore: number | null }) => {
      const score = r.qualityScore || 0;
      if (score >= 90) buckets['90-100 (Excellent)']++;
      else if (score >= 75) buckets['75-89 (Good)']++;
      else if (score >= 50) buckets['50-74 (Needs Work)']++;
      else buckets['0-49 (Poor)']++;
    });

    const qualityDistribution = Object.entries(buckets).map(([scoreRange, count]) => ({
      scoreRange,
      count,
    }));

    return {
      success: true,
      data: {
        totalReviews,
        avgQualityScore,
        completedReviews,
        pendingReviews,
        failedReviews,
        recentReviewsCount,
        qualityDistribution,
      },
    };
  } catch (error) {
    console.error('Error fetching review analytics:', error);
    return { success: false, error: 'Failed to retrieve review analytics metrics' };
  }
}
