'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnalyticsSummary } from '../actions/analytics';

interface ReviewScoreChartProps {
  distribution: AnalyticsSummary['qualityDistribution'];
}

export function ReviewScoreChart({ distribution }: ReviewScoreChartProps) {
  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">PR Quality Score Breakdown</CardTitle>
        <CardDescription>
          Distribution of automated review scores across connected repositories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {distribution.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.scoreRange} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground/90">{item.scoreRange}</span>
                <span className="text-muted-foreground">
                  {item.count} PRs ({percentage}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/50">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
