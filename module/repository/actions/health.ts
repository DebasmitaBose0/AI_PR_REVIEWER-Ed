'use server';

import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { checkWebhookHealth } from '@/module/github/lib/webhook-health';

export interface RepositoryHealthStatus {
  repositoryId: string;
  name: string;
  owner: string;
  hasWebhook: boolean;
  webhookActive: boolean;
  lastDelivery: string | null;
  lastResponse: number | null;
}

export async function checkRepositoryHealthAction(repositoryId: string): Promise<{
  success: boolean;
  data?: RepositoryHealthStatus;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: 'Unauthorized user session' };
    }

    const repo = await prisma.repository.findFirst({
      where: { id: repositoryId, userid: session.user.id },
    });

    if (!repo) {
      return { success: false, error: 'Repository not found' };
    }

    const health = await checkWebhookHealth(repo.owner, repo.name);

    return {
      success: true,
      data: {
        repositoryId: repo.id,
        name: repo.name,
        owner: repo.owner,
        hasWebhook: health.exists,
        webhookActive: health.active,
        lastDelivery: health.lastDelivery,
        lastResponse: health.lastResponse,
      },
    };
  } catch (error) {
    console.error('Error checking repository health:', error);
    return { success: false, error: 'Failed to evaluate repository health status' };
  }
}
