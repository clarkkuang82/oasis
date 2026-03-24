import { getAIClient } from './client';
import { WORLD_GEN_SYSTEM_PROMPT, WORLD_GEN_USER_PROMPT } from './prompts/world-gen';
import { WorldGenerationResultSchema, type WorldGenerationResult } from '@/lib/types/world-bible';

export async function generateWorld(
  userInput: string,
  apiKey?: string
): Promise<WorldGenerationResult> {
  const client = getAIClient(apiKey);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: WORLD_GEN_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: WORLD_GEN_USER_PROMPT(userInput),
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('AI returned no text content');
  }

  // Extract JSON from the response (handle possible markdown code blocks)
  let jsonStr = textContent.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);
  const validated = WorldGenerationResultSchema.parse(parsed);
  return validated;
}

export async function* generateWorldStream(
  userInput: string,
  apiKey?: string
): AsyncGenerator<{ type: 'text'; text: string } | { type: 'done'; result: WorldGenerationResult }> {
  const client = getAIClient(apiKey);

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: WORLD_GEN_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: WORLD_GEN_USER_PROMPT(userInput),
      },
    ],
  });

  let fullText = '';

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullText += event.delta.text;
      yield { type: 'text', text: event.delta.text };
    }
  }

  // Parse the complete response
  let jsonStr = fullText.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);
  const validated = WorldGenerationResultSchema.parse(parsed);
  yield { type: 'done', result: validated };
}
