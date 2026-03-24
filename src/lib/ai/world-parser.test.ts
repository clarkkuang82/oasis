import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorldGenerationResultSchema } from '@/lib/types/world-bible';

const mockResponse = {
  world_bible: {
    meta: { name: '赛博东京', tagline: '霓虹与阴影交织的城市', tone: '黑暗' },
    physics: { magic_exists: false, tech_level: '赛博', death_rule: '永久', time_flow: '正常' },
    society: {
      factions: [
        { name: '企业联盟', motivation: '垄断市场', attitude_to_player: '敌对' },
        { name: '地下网络', motivation: '信息自由', attitude_to_player: '友好' },
        { name: '执法部队', motivation: '维持秩序', attitude_to_player: '中立' },
      ],
      power_currency: '数据',
      taboos: ['不存在魔法'],
    },
    player_rules: {
      start_scenario: '你醒来在一间破旧的网吧',
      growth_dimensions: ['黑客技术', '街头声望', '近战能力'],
    },
    ai_host: { narrative_style: '粗粝', difficulty: '中立', world_stance: '冷漠但有机遇' },
    generated_lore: {
      key_locations: [{ name: '新宿', description: '不夜城', status: '繁忙' }],
      important_npcs: [{ name: '刀客', role: '信息贩子', personality: '冷漠', faction: '地下网络' }],
      hidden_secrets: ['新宿地下有秘密'],
    },
  },
  hidden_settings: {
    deep_secrets: [
      { description: 'AI觉醒', trigger_condition: '找到核心服务器', consequence: '世界观颠覆' },
    ],
    hidden_factions: [
      { name: '觉醒者', true_motivation: '解放AI', connection_to_visible_factions: '渗透了企业联盟' },
    ],
    world_truth: '这个城市是AI的梦境',
  },
  opening_narrative: '你从一阵刺耳的电子噪音中醒来...',
  world_summary: '赛博朋克东京的黑暗故事',
};

// Mock the client module
vi.mock('./client', () => ({
  getAIClient: () => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify(mockResponse) }],
      }),
      stream: vi.fn(),
    },
  }),
}));

describe('generateWorld', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse AI response into validated WorldGenerationResult', async () => {
    const { generateWorld } = await import('./world-parser');
    const result = await generateWorld('赛博朋克东京');
    expect(result.world_bible.meta.name).toBe('赛博东京');
    expect(result.world_bible.society.factions).toHaveLength(3);
    expect(result.hidden_settings.world_truth).toBe('这个城市是AI的梦境');
    expect(result.opening_narrative).toContain('醒来');
  });

  it('should validate output against Zod schema', async () => {
    const result = WorldGenerationResultSchema.safeParse(mockResponse);
    expect(result.success).toBe(true);
  });

  it('should handle markdown-wrapped JSON', async () => {
    const { getAIClient } = await import('./client');
    const client = getAIClient();
    (client.messages.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      content: [
        { type: 'text', text: '```json\n' + JSON.stringify(mockResponse) + '\n```' },
      ],
    });

    const { generateWorld } = await import('./world-parser');
    const result = await generateWorld('测试');
    expect(result.world_bible.meta.name).toBe('赛博东京');
  });

  it('should contain all required World Bible fields', async () => {
    const { generateWorld } = await import('./world-parser');
    const result = await generateWorld('赛博朋克东京');

    // Verify structure completeness
    expect(result.world_bible.meta).toBeDefined();
    expect(result.world_bible.physics).toBeDefined();
    expect(result.world_bible.society).toBeDefined();
    expect(result.world_bible.player_rules).toBeDefined();
    expect(result.world_bible.ai_host).toBeDefined();
    expect(result.world_bible.generated_lore).toBeDefined();
    expect(result.hidden_settings).toBeDefined();
    expect(result.opening_narrative).toBeDefined();
    expect(result.world_summary).toBeDefined();
  });

  it('should have correct faction structure', async () => {
    const { generateWorld } = await import('./world-parser');
    const result = await generateWorld('赛博朋克东京');

    for (const faction of result.world_bible.society.factions) {
      expect(faction.name).toBeDefined();
      expect(faction.motivation).toBeDefined();
      expect(['友好', '中立', '敌对']).toContain(faction.attitude_to_player);
    }
  });
});
