/**
 * Send a notification to a Slack incoming webhook
 */
export async function sendSlackNotification(webhookUrl: string, message: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  if (!webhookUrl || typeof webhookUrl !== 'string') {
    return { success: false, error: 'Invalid webhook URL provided' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Slack API HTTP ${response.status}: ${text}`);
    }

    return { success: true };
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error('[Slack Notification Error]:', errMessage);
    return { success: false, error: errMessage };
  }
}
