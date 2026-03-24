import { db } from './index';
import type { World } from '@/lib/types/world-bible';

export async function saveWorld(world: World): Promise<void> {
  await db.worlds.put(world);
}

export async function getWorld(id: string): Promise<World | undefined> {
  return db.worlds.get(id);
}

export async function getAllWorlds(): Promise<World[]> {
  return db.worlds.orderBy('createdAt').reverse().toArray();
}

export async function deleteWorld(id: string): Promise<void> {
  await db.worlds.delete(id);
}
