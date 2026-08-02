import { unstable_cache } from 'next/cache';

export async function getCachedData<T>(
  fetcher: () => Promise<T>,
  keyParts: string[],
  options: { revalidate?: number; tags?: string[] } = {},
): Promise<T> {
  const cachedFn = unstable_cache(fetcher, keyParts, {
    revalidate: options.revalidate || 60,
    tags: options.tags || [],
  });

  return cachedFn();
}
