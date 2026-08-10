'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRepositorySlackWebhook } from '../actions';
import { toast } from 'sonner';
import { Loader2, MessageSquare } from 'lucide-react';

interface SlackWebhookDialogProps {
  repositoryId: string;
  repositoryName: string;
  initialWebhookUrl?: string | null;
}

export function SlackWebhookDialog({
  repositoryId,
  repositoryName,
  initialWebhookUrl,
}: SlackWebhookDialogProps) {
  const [open, setOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl || '');
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (url: string | null) => {
      return await updateRepositorySlackWebhook(repositoryId, url);
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({
          queryKey: ['connected-repositories'],
        });
        toast.success('Slack Webhook updated successfully');
        setOpen(false);
      } else {
        toast.error(result?.error || 'Failed to update Slack Webhook');
      }
    },
    onError: (error: Error) => {
      console.error('Failed to update Slack Webhook:', error);
      toast.error('Failed to update Slack Webhook');
    },
  });

  const handleSave = () => {
    updateMutation.mutate(webhookUrl.trim() === '' ? null : webhookUrl.trim());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2 gap-2">
          <MessageSquare className="h-4 w-4" />
          Slack
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Slack Notifications</DialogTitle>
          <DialogDescription>
            Configure a Slack Webhook URL to receive notifications when AI PR Reviews are completed for <strong>{repositoryName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="webhookUrl" className="text-right">
              Webhook URL
            </Label>
            <Input
              id="webhookUrl"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
