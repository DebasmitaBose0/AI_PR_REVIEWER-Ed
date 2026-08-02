'use client';

import { Component, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CustomErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive/30 bg-destructive/5 my-4">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle className="text-base font-semibold">
                {this.props.fallbackTitle || 'Component Error'}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              An unexpected error occurred while rendering this section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs font-mono bg-background/50 p-2 rounded border text-muted-foreground overflow-x-auto">
              {this.state.error?.message || 'Unknown render error'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
