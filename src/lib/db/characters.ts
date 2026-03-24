import { db } from './index';
import type { Character } from '@/lib/types/character';

export async function saveCharacter(character: Character): Promise<void> {
  await db.characters.put(character);
}

export async function getCharacter(id: string): Promise<Character | undefined> {
  return db.characters.get(id);
}

export async function getCharactersByWorld(worldId: string): Promise<Character[]> {
  return db.characters.where('worldId').equals(worldId).toArray();
}
