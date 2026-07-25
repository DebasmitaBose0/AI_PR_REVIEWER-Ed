/**
 * Send a notification to a Slack incoming webhook
 */
export async function sendSlackNotification(webhookUrl: string, message: any) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    return { success: false, error };
  }
}
