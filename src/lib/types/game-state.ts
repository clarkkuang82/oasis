export interface PlayerState {
  id: string;
  characterId: string;
  worldId: string;
  sessionId: string;
  hp: number;
  location: string;
  inventory: InventoryItem[];
  storyFlags: Record<string, unknown>;
  updatedAt: number;
}

export interface InventoryItem {
  name: string;
  description: string;
  quantity: number;
}

export interface GameEvent {
  id: string;
  worldId: string;
  sessionId: string;
  characterId: string;
  action: string;
  consequence: string;
  worldBiblePatch: Record<string, unknown> | null;
  worldTime: string;
  createdAt: number;
}

export interface SessionMessage {
  id?: number;
  sessionId: string;
  characterId: string;
  role: 'player' | 'master' | 'system';
  content: string;
  createdAt: number;
}

export interface GameSession {
  id: string;
  worldId: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface WorldStateSnapshot {
  worldId: string;
  version: number;
  activePlayers: { characterId: string; name: string; location: string }[];
  summary: string;
  lastUpdated: number;
}
