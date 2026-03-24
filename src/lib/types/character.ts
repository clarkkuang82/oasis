export interface Character {
  id: string;
  worldId: string;
  playerId: string;
  name: string;
  concept: string;
  background: string;
  traits: string[];
  secret: string;
  startingResources: Record<string, unknown>;
  createdAt: number;
}
