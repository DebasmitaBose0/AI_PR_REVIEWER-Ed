export interface SlackReviewPayload {
  repositoryName: string;
  prTitle: string;
  prNumber: number;
  prUrl: string;
  qualityScore?: number | null;
  reviewSummary: string;
}

export async function sendSlackReviewNotification(
  webhookUrl: string,
  payload: SlackReviewPayload,
): Promise<{ success: boolean; error?: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('https://hooks.slack.com/')) {
    return { success: false, error: 'Invalid or missing Slack webhook URL' };
  }

  const scoreText = payload.qualityScore !== undefined && payload.qualityScore !== null
    ? `*Quality Score:* ${payload.qualityScore}/100\n`
    : '';

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `🤖 AI PR Review Completed: ${payload.repositoryName}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*PR #${payload.prNumber}:* <${payload.prUrl}|${payload.prTitle}>\n${scoreText}*Summary:* ${payload.reviewSummary.slice(0, 300)}...`,
      },
    },
  ];

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Slack HTTP ${response.status}: ${errorText}` };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to dispatch Slack notification' };
  }
}
