import { z } from "zod";

export const webhookPayloadSchema = z.object({
  action: z.string(),
  number: z.number().int().positive(),
  repository: z.object({
    owner: z.object({
      login: z.string().min(1),
    }),
    name: z.string().min(1),
  }),
});

export type WebhookPayloadValidated = z.infer<typeof webhookPayloadSchema>;

export function parseWebhookPayload(body: unknown): WebhookPayloadValidated | null {
  const result = webhookPayloadSchema.safeParse(body);
  if (result.success) {
    return result.data;
  }
  return null;
}
