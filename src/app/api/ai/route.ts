import { NextRequest, NextResponse } from 'next/server';
import { generateWorld } from '@/lib/ai/world-parser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, prompt, apiKey } = body;

    if (action === 'generate-world') {
      if (!prompt || typeof prompt !== 'string') {
        return NextResponse.json(
          { error: '请提供世界描述' },
          { status: 400 }
        );
      }

      const result = await generateWorld(prompt, apiKey);

      return NextResponse.json({
        success: true,
        data: {
          worldBible: result.world_bible,
          hiddenSettings: result.hidden_settings,
          openingNarrative: result.opening_narrative,
          worldSummary: result.world_summary,
        },
      });
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('AI API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
