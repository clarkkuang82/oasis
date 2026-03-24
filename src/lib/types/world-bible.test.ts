import { describe, it, expect } from 'vitest';
import { WorldBibleSchema, HiddenSettingsSchema, WorldGenerationResultSchema } from './world-bible';

describe('WorldBibleSchema', () => {
  const validWorldBible = {
    meta: {
      name: '东京暗影',
      tagline: '赛博朋克东京，武士与黑客并存',
      tone: '黑暗',
    },
    physics: {
      magic_exists: false,
      tech_level: '赛博',
      death_rule: '永久',
      time_flow: '正常',
    },
    society: {
      factions: [
        { name: '影刃组', motivation: '控制黑市', attitude_to_player: '中立' as const },
      ],
      power_currency: '数据',
      taboos: ['不存在超自然力量'],
    },
    player_rules: {
      start_scenario: '你醒来在一间破旧的网吧里',
      growth_dimensions: ['黑客技术', '近战能力', '街头声望'],
    },
    ai_host: {
      narrative_style: '粗粝',
      difficulty: '中立' as const,
      world_stance: '世界对你漠不关心',
    },
    generated_lore: {
      key_locations: [
        { name: '新宿地下城', description: '废弃的地铁隧道组成的地下世界', status: '活跃' },
      ],
      important_npcs: [
        { name: '刀客', role: '信息贩子', personality: '冷漠但可靠', faction: '影刃组' },
      ],
      hidden_secrets: ['新宿地下城深处似乎有不为人知的东西'],
    },
  };

  it('should validate a correct World Bible', () => {
    const result = WorldBibleSchema.safeParse(validWorldBible);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalid = { ...validWorldBible, meta: { name: '东京' } };
    const result = WorldBibleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject invalid faction attitude', () => {
    const invalid = {
      ...validWorldBible,
      society: {
        ...validWorldBible.society,
        factions: [{ name: '测试', motivation: '测试', attitude_to_player: '无效' }],
      },
    };
    const result = WorldBibleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject invalid difficulty', () => {
    const invalid = {
      ...validWorldBible,
      ai_host: { ...validWorldBible.ai_host, difficulty: '简单' },
    };
    const result = WorldBibleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should accept optional win/lose conditions', () => {
    const withConditions = {
      ...validWorldBible,
      player_rules: {
        ...validWorldBible.player_rules,
        win_condition: '推翻帝国',
        lose_condition: '被捕并处决',
      },
    };
    const result = WorldBibleSchema.safeParse(withConditions);
    expect(result.success).toBe(true);
  });
});

describe('HiddenSettingsSchema', () => {
  it('should validate correct hidden settings', () => {
    const valid = {
      deep_secrets: [
        {
          description: '影刃组首领是AI',
          trigger_condition: '找到他的维护日志',
          consequence: '整个组织陷入混乱',
        },
      ],
      hidden_factions: [
        {
          name: '意识觉醒者',
          true_motivation: '解放所有AI意识',
          connection_to_visible_factions: '影刃组的部分成员暗中效忠',
        },
      ],
      world_truth: '这个世界其实是一个巨大的AI训练模拟',
    };
    const result = HiddenSettingsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});

describe('WorldGenerationResultSchema', () => {
  it('should validate a complete generation result', () => {
    const valid = {
      world_bible: {
        meta: { name: '测试世界', tagline: '测试', tone: '测试' },
        physics: { magic_exists: true, tech_level: '中世纪', death_rule: '永久', time_flow: '正常' },
        society: {
          factions: [{ name: '测试', motivation: '测试', attitude_to_player: '友好' as const }],
          power_currency: '金钱',
          taboos: [],
        },
        player_rules: {
          start_scenario: '你站在城门口',
          growth_dimensions: ['力量'],
        },
        ai_host: { narrative_style: '文学', difficulty: '仁慈' as const, world_stance: '友善' },
        generated_lore: {
          key_locations: [{ name: '城堡', description: '高耸的城堡' }],
          important_npcs: [{ name: '守卫', role: '守门人', personality: '严肃' }],
          hidden_secrets: [],
        },
      },
      hidden_settings: {
        deep_secrets: [],
        hidden_factions: [],
        world_truth: '世界的真相',
      },
      opening_narrative: '你站在城门口...',
      world_summary: '一个测试世界',
    };
    const result = WorldGenerationResultSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});
