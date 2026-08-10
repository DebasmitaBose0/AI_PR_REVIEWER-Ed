import { Suspense } from 'react';
import { getReviewAnalyticsAction } from '@/module/review/actions/analytics';
import { ReviewAnalyticsSummary } from '@/module/review/components/review-analytics-summary';
import { ReviewScoreChart } from '@/module/review/components/review-score-chart';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'PR Quality Analytics | AI PR Reviewer',
  description: 'Track aggregate code quality, review velocities, and quality score distributions.',
};

export default async function AnalyticsPage() {
  const result = await getReviewAnalyticsAction();

  if (!result.success || !result.data) {
    return (
      <div className="container max-w-6xl py-8 space-y-6">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          Failed to load analytics: {result.error || 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">PR Quality Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          High-level insights into review quality scores, throughput, and repository health.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <ReviewAnalyticsSummary data={result.data} />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <ReviewScoreChart distribution={result.data.qualityDistribution} />
        </Suspense>
      </div>
    </div>
  );
}
