import type { Character } from './character';
import type { PlayerState, WorldStateSnapshot, GameEvent } from './game-state';

export type P2PMessage =
  | { type: 'join'; playerId: string; character: Character }
  | { type: 'action'; playerId: string; input: string }
  | { type: 'narrative'; targetPlayerId: string | 'all'; text: string; isStreaming?: boolean }
  | { type: 'state_update'; worldState: WorldStateSnapshot }
  | { type: 'player_state'; playerId: string; state: PlayerState }
  | { type: 'world_event'; event: GameEvent }
  | { type: 'player_left'; playerId: string }
  | { type: 'error'; message: string };

export interface RoomInfo {
  roomId: string;
  worldId: string;
  worldName: string;
  hostId: string;
  playerCount: number;
  maxPlayers: number;
}
