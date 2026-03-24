import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './index';
import { saveWorld, getWorld, getAllWorlds, deleteWorld } from './worlds';
import { saveCharacter, getCharacter, getCharactersByWorld } from './characters';
import { saveEvent, getRecentEvents, saveMessage, getSessionMessages } from './events';
import type { World } from '@/lib/types/world-bible';
import type { Character } from '@/lib/types/character';
import type { GameEvent, SessionMessage } from '@/lib/types/game-state';

function makeWorld(overrides: Partial<World> = {}): World {
  return {
    id: 'test-world-1',
    name: '测试世界',
    tagline: '一个测试',
    worldBible: {
      meta: { name: '测试世界', tagline: '测试', tone: '黑暗' },
      physics: { magic_exists: true, tech_level: '中世纪', death_rule: '永久', time_flow: '正常' },
      society: {
        factions: [{ name: '骑士团', motivation: '守护', attitude_to_player: '友好' }],
        power_currency: '金钱',
        taboos: [],
      },
      player_rules: { start_scenario: '开始', growth_dimensions: ['力量'] },
      ai_host: { narrative_style: '文学', difficulty: '中立', world_stance: '中立' },
      generated_lore: { key_locations: [], important_npcs: [], hidden_secrets: [] },
    },
    hiddenSettings: {
      deep_secrets: [],
      hidden_factions: [],
      world_truth: '真相',
    },
    openingNarrative: '你醒来...',
    worldSummary: '测试世界',
    createdBy: 'local',
    isPublic: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe('IndexedDB - Worlds', () => {
  beforeEach(async () => {
    await db.worlds.clear();
  });

  it('should save and retrieve a world', async () => {
    const world = makeWorld();
    await saveWorld(world);
    const retrieved = await getWorld('test-world-1');
    expect(retrieved).toBeDefined();
    expect(retrieved!.name).toBe('测试世界');
    expect(retrieved!.worldBible.meta.tone).toBe('黑暗');
  });

  it('should list all worlds sorted by createdAt desc', async () => {
    await saveWorld(makeWorld({ id: 'w1', createdAt: 1000 }));
    await saveWorld(makeWorld({ id: 'w2', createdAt: 2000 }));
    await saveWorld(makeWorld({ id: 'w3', createdAt: 3000 }));
    const worlds = await getAllWorlds();
    expect(worlds).toHaveLength(3);
    expect(worlds[0].id).toBe('w3');
    expect(worlds[2].id).toBe('w1');
  });

  it('should delete a world', async () => {
    await saveWorld(makeWorld());
    await deleteWorld('test-world-1');
    const retrieved = await getWorld('test-world-1');
    expect(retrieved).toBeUndefined();
  });
});

describe('IndexedDB - Characters', () => {
  beforeEach(async () => {
    await db.characters.clear();
  });

  it('should save and retrieve a character', async () => {
    const char: Character = {
      id: 'char-1',
      worldId: 'w1',
      playerId: 'p1',
      name: '暗影刀客',
      concept: '落魄的前帝国侦探',
      background: '曾经辉煌',
      traits: ['执着', '酗酒'],
      secret: '我其实是反派的儿子',
      startingResources: { gold: 10 },
      createdAt: Date.now(),
    };
    await saveCharacter(char);
    const retrieved = await getCharacter('char-1');
    expect(retrieved!.name).toBe('暗影刀客');
    expect(retrieved!.secret).toBe('我其实是反派的儿子');
  });

  it('should find characters by world', async () => {
    await saveCharacter({
      id: 'c1', worldId: 'w1', playerId: 'p1', name: 'A',
      concept: '', background: '', traits: [], secret: '',
      startingResources: {}, createdAt: Date.now(),
    });
    await saveCharacter({
      id: 'c2', worldId: 'w1', playerId: 'p2', name: 'B',
      concept: '', background: '', traits: [], secret: '',
      startingResources: {}, createdAt: Date.now(),
    });
    await saveCharacter({
      id: 'c3', worldId: 'w2', playerId: 'p1', name: 'C',
      concept: '', background: '', traits: [], secret: '',
      startingResources: {}, createdAt: Date.now(),
    });
    const w1Chars = await getCharactersByWorld('w1');
    expect(w1Chars).toHaveLength(2);
  });
});

describe('IndexedDB - Events & Messages', () => {
  beforeEach(async () => {
    await db.events.clear();
    await db.messages.clear();
  });

  it('should save and retrieve recent events', async () => {
    for (let i = 0; i < 5; i++) {
      const event: GameEvent = {
        id: `evt-${i}`,
        worldId: 'w1',
        sessionId: 's1',
        characterId: 'c1',
        action: `行动 ${i}`,
        consequence: `后果 ${i}`,
        worldBiblePatch: null,
        worldTime: `Day ${i}`,
        createdAt: Date.now() + i,
      };
      await saveEvent(event);
    }
    const events = await getRecentEvents('w1', 3);
    expect(events).toHaveLength(3);
  });

  it('should save and retrieve session messages', async () => {
    const msg: SessionMessage = {
      sessionId: 's1',
      characterId: 'c1',
      role: 'player',
      content: '我向北走',
      createdAt: Date.now(),
    };
    await saveMessage(msg);
    const messages = await getSessionMessages('s1');
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe('我向北走');
  });
});
