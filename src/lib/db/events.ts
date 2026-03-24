import { db } from './index';
import type { GameEvent, SessionMessage } from '@/lib/types/game-state';

export async function saveEvent(event: GameEvent): Promise<void> {
  await db.events.put(event);
}

export async function getRecentEvents(worldId: string, limit = 20): Promise<GameEvent[]> {
  return db.events
    .where('worldId')
    .equals(worldId)
    .reverse()
    .limit(limit)
    .toArray();
}

export async function saveMessage(message: SessionMessage): Promise<number> {
  return db.messages.add(message);
}

export async function getSessionMessages(
  sessionId: string,
  limit = 50
): Promise<SessionMessage[]> {
  return db.messages
    .where('sessionId')
    .equals(sessionId)
    .limit(limit)
    .toArray();
}
