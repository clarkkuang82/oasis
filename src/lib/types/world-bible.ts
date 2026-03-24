import { z } from 'zod';

// --- Zod Schemas (for AI output validation) ---

export const FactionSchema = z.object({
  name: z.string(),
  motivation: z.string(),
  attitude_to_player: z.enum(['友好', '中立', '敌对']),
});

export const WorldBibleSchema = z.object({
  meta: z.object({
    name: z.string(),
    tagline: z.string(),
    tone: z.string(),
  }),

  physics: z.object({
    magic_exists: z.boolean(),
    tech_level: z.string(),
    death_rule: z.string(),
    time_flow: z.string(),
  }),

  society: z.object({
    factions: z.array(FactionSchema),
    power_currency: z.string(),
    taboos: z.array(z.string()),
  }),

  player_rules: z.object({
    start_scenario: z.string(),
    growth_dimensions: z.array(z.string()),
    win_condition: z.string().optional(),
    lose_condition: z.string().optional(),
  }),

  ai_host: z.object({
    narrative_style: z.string(),
    difficulty: z.enum(['仁慈', '中立', '残酷']),
    world_stance: z.string(),
  }),

  generated_lore: z.object({
    key_locations: z.array(z.object({
      name: z.string(),
      description: z.string(),
      status: z.string().optional(),
    })),
    important_npcs: z.array(z.object({
      name: z.string(),
      role: z.string(),
      personality: z.string(),
      faction: z.string().optional(),
    })),
    hidden_secrets: z.array(z.string()),
  }),
});

export const HiddenSettingsSchema = z.object({
  deep_secrets: z.array(z.object({
    description: z.string(),
    trigger_condition: z.string(),
    consequence: z.string(),
  })),
  hidden_factions: z.array(z.object({
    name: z.string(),
    true_motivation: z.string(),
    connection_to_visible_factions: z.string(),
  })),
  world_truth: z.string(),
});

export const WorldGenerationResultSchema = z.object({
  world_bible: WorldBibleSchema,
  hidden_settings: HiddenSettingsSchema,
  opening_narrative: z.string(),
  world_summary: z.string(),
});

// --- TypeScript Types (inferred from Zod) ---

export type Faction = z.infer<typeof FactionSchema>;
export type WorldBible = z.infer<typeof WorldBibleSchema>;
export type HiddenSettings = z.infer<typeof HiddenSettingsSchema>;
export type WorldGenerationResult = z.infer<typeof WorldGenerationResultSchema>;

export interface World {
  id: string;
  name: string;
  tagline: string;
  worldBible: WorldBible;
  hiddenSettings: HiddenSettings;
  openingNarrative: string;
  worldSummary: string;
  createdBy: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
}
