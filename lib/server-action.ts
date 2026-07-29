import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AuthError, toErrorResponse, toSuccessResponse, type ActionResponse } from './app-error';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export async function requireSession(): Promise<SessionUser> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new AuthError();
  }
  return {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    image: session.user.image,
  };
}

export async function safeAction<T>(fn: () => Promise<T>): Promise<ActionResponse<T>> {
  try {
    const result = await fn();
    return toSuccessResponse(result);
  } catch (error) {
    console.error(
      `[Action Error] ${error instanceof Error ? error.message : 'Unknown error'}`,
      error,
    );
    return toErrorResponse(error);
  }
}

export async function safeAuthAction<T>(
  fn: (user: SessionUser) => Promise<T>
): Promise<ActionResponse<T>> {
  return safeAction(async () => {
    const user = await requireSession();
    return fn(user);
  });
}
