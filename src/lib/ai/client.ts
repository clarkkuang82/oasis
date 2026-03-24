import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getAIClient(apiKey?: string): Anthropic {
  const key = apiKey || process.env.ANTHROPIC_API_KEY || '';
  if (!key) {
    throw new Error('ANTHROPIC_API_KEY is required. Set it in .env.local or pass it directly.');
  }
  if (!client) {
    client = new Anthropic({ apiKey: key });
  }
  return client;
}
