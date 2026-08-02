export interface ContextOptimizationOptions {
  maxTokenEstimate?: number;
  maxFiles?: number;
}

export function optimizeRAGContext(
  retrievedSnippets: string[],
  options: ContextOptimizationOptions = {},
): string[] {
  const maxTokenEstimate = options.maxTokenEstimate || 12000;
  const maxFiles = options.maxFiles || 8;

  let currentTokens = 0;
  const optimized: string[] = [];

  for (const snippet of retrievedSnippets.slice(0, maxFiles)) {
    // Rough estimate: 1 word ≈ 1.33 tokens
    const estimatedTokens = Math.ceil(snippet.split(/\s+/).length * 1.33);

    if (currentTokens + estimatedTokens > maxTokenEstimate) {
      const remainingCapacity = maxTokenEstimate - currentTokens;
      if (remainingCapacity > 500) {
        // Truncate snippet
        const charLimit = Math.floor(remainingCapacity * 3);
        optimized.push(`${snippet.slice(0, charLimit)}\n...[Truncated due to context limit]`);
      }
      break;
    }

    optimized.push(snippet);
    currentTokens += estimatedTokens;
  }

  return optimized;
}
