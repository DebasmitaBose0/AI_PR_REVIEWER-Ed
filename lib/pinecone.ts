import { Pinecone } from '@pinecone-database/pinecone';
import { getPineconeIndexName } from './env';

const pineconeApiKey = process.env.PINECONE_DB_API_KEY || '';
const pineconeIndexName = getPineconeIndexName();

const pinecone = new Pinecone({
  apiKey: pineconeApiKey,
});

export const pineconeindex = pinecone.index(pineconeIndexName);

export function getPineconeIndex(customIndexName?: string) {
  if (customIndexName) {
    return pinecone.index(customIndexName);
  }
  return pineconeindex;
}

export async function queryVectorStore(
  vector: number[],
  topK: number = 5,
  filter?: Record<string, unknown>
) {
  const index = getPineconeIndex();
  const clampedTopK = Math.min(Math.max(1, topK), 20);

  return index.query({
    vector,
    topK: clampedTopK,
    includeMetadata: true,
    filter,
  });
}
