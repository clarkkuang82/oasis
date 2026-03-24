import Dexie, { type Table } from 'dexie';
import type { World } from '@/lib/types/world-bible';
import type { Character } from '@/lib/types/character';
import type {
  PlayerState,
  GameEvent,
  SessionMessage,
  GameSession,
} from '@/lib/types/game-state';

export class OasisDB extends Dexie {
  worlds!: Table<World>;
  characters!: Table<Character>;
  gameSessions!: Table<GameSession>;
  playerStates!: Table<PlayerState>;
  events!: Table<GameEvent>;
  messages!: Table<SessionMessage>;

  constructor() {
    super('oasis');
    this.version(1).stores({
      worlds: 'id, name, createdBy, createdAt',
      characters: 'id, worldId, playerId, name',
      gameSessions: 'id, worldId, isActive',
      playerStates: 'id, characterId, worldId, sessionId',
      events: 'id, worldId, sessionId, createdAt',
      messages: '++id, sessionId, createdAt',
    });
  }
}

export const db = new OasisDB();
