'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsSummary } from '../actions/analytics';
import { Award, CheckCircle2, Clock, FileCode, AlertTriangle } from 'lucide-react';

interface ReviewAnalyticsSummaryProps {
  data: AnalyticsSummary;
}

export function ReviewAnalyticsSummary({ data }: ReviewAnalyticsSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Award className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.avgQualityScore} / 100</div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {data.completedReviews} automated reviews
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total PR Reviews</CardTitle>
          <FileCode className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalReviews}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {data.recentReviewsCount} reviews processed in last 7 days
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed vs Pending</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {data.completedReviews}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {data.pendingReviews} pending queue
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed Reviews</CardTitle>
          <AlertTriangle className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {data.failedReviews}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {data.totalReviews > 0
              ? `${Math.round((data.failedReviews / data.totalReviews) * 100)}% failure rate`
              : '0% failure rate'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
