/** Character Minter Type Definitions */

export const ARCHETYPES = [
  'Void Paladin',
  'Techno-Cleric',
  'Psyker Sorcerer',
  'Gene-Enhanced Barbarian',
  'Cyber-Necromancer',
  'Warp Assassin',
] as const;

export const RACES = [
  'Augmented Human',
  'Void Elf',
  'Chaos-Touched Mutant',
  'Bio-Engineered Knight',
  'Machine-Bound Undead',
] as const;

export const ALLEGIANCES = ['Order', 'Chaos', 'Neutral'] as const;

export const ARMOR_TIERS = ['Relic', 'Sanctified', 'Corrupted', 'Heretical'] as const;

export type Archetype = (typeof ARCHETYPES)[number];
export type Race = (typeof RACES)[number];
export type Allegiance = (typeof ALLEGIANCES)[number];
export type ArmorTier = (typeof ARMOR_TIERS)[number];

export interface CharacterStats {
  strength: number;
  faith: number;
  psyPower: number;
  machineAffinity: number;
  corruption: number;
  luck: number;
}

export interface Character {
  id: string;
  name: string;
  archetype: Archetype;
  race: Race;
  allegiance: Allegiance;
  armorTier: ArmorTier;
  stats: CharacterStats;
  corruptionLevel: number;
  purityLevel: number;
  originLore: string;
  mutationCount: number;
}

export interface MintConfig {
  name: string;
  archetype: number;
  race: number;
  allegiance: number;
  armorTier: number;
  corruptionLevel: number;
  purityLevel: number;
}

/** Archetype descriptions for the UI */
export const ARCHETYPE_DESCRIPTIONS: Record<Archetype, string> = {
  'Void Paladin': 'Holy warriors who channel faith through powered exoskeletons, wielding warp-forged hammers against the darkness.',
  'Techno-Cleric': 'Priests of the Machine God who fuse sacred rituals with ancient technology, binding soul to circuit.',
  'Psyker Sorcerer': 'Wielders of the immaterium, channeling raw warp energy through arcane conduits and plasma staves.',
  'Gene-Enhanced Barbarian': 'Bio-engineered berserkers with chain-swords and mana-core augments, fury given physical form.',
  'Cyber-Necromancer': 'Masters of death and machine, raising the fallen as machine-bound undead through forbidden code.',
  'Warp Assassin': 'Shadow operatives who phase between dimensions, striking with corrupted blades from the void.',
};

/** Race descriptions */
export const RACE_DESCRIPTIONS: Record<Race, string> = {
  'Augmented Human': 'Standard humans enhanced with neural implants and mechanical augmentations.',
  'Void Elf': 'Ancient elven bloodlines adapted to the void of space, with innate psychic resonance.',
  'Chaos-Touched Mutant': 'Beings warped by exposure to raw chaos energy, bearing visible mutations.',
  'Bio-Engineered Knight': 'Purpose-built warriors with gene-forged physiology and embedded combat systems.',
  'Machine-Bound Undead': 'Consciousness preserved in mechanical shells, neither truly alive nor dead.',
};

/** Stat ranges for each archetype (base bonuses) */
export const ARCHETYPE_BONUSES: Record<Archetype, Partial<CharacterStats>> = {
  'Void Paladin': { strength: 10, faith: 15, machineAffinity: 5 },
  'Techno-Cleric': { faith: 10, psyPower: 5, machineAffinity: 15 },
  'Psyker Sorcerer': { faith: 5, psyPower: 20 },
  'Gene-Enhanced Barbarian': { strength: 20, machineAffinity: 5 },
  'Cyber-Necromancer': { psyPower: 10, machineAffinity: 15 },
  'Warp Assassin': { strength: 10, psyPower: 10, machineAffinity: 5 },
};

/** Generate pseudo-random stats for a character */
export function generateStats(archetype: Archetype): CharacterStats {
  const bonuses = ARCHETYPE_BONUSES[archetype];

  const randomStat = () => Math.floor(Math.random() * 80) + 10;

  const clamp = (val: number, max: number = 100) => Math.min(val, max);

  return {
    strength: clamp(randomStat() + (bonuses.strength ?? 0)),
    faith: clamp(randomStat() + (bonuses.faith ?? 0)),
    psyPower: clamp(randomStat() + (bonuses.psyPower ?? 0)),
    machineAffinity: clamp(randomStat() + (bonuses.machineAffinity ?? 0)),
    corruption: Math.floor(Math.random() * 50),
    luck: randomStat(),
  };
}

/** Generate a procedural origin lore */
export function generateOriginLore(
  archetype: Archetype,
  race: Race,
  allegiance: Allegiance,
): string {
  const origins = [
    `Forged in the crucible of a dying star, this ${race} ${archetype} swore ${allegiance === 'Order' ? 'an oath of eternal vigilance' : allegiance === 'Chaos' ? 'allegiance to the dark powers' : 'to walk the path between light and shadow'}.`,
    `Born from the gene-vats of Sector VII, this ${archetype} carries the blood of ${race === 'Void Elf' ? 'the ancient Void Eldar' : race === 'Machine-Bound Undead' ? 'the deathless legions' : 'countless warriors'}.`,
    `Awakened during the Third Warp Storm, this ${race} emerged wielding powers of ${allegiance === 'Order' ? 'holy light' : allegiance === 'Chaos' ? 'corrupted darkness' : 'balanced duality'}.`,
  ];

  return origins[Math.floor(Math.random() * origins.length)];
}

/** Archetype sigil Unicode symbols */
export const ARCHETYPE_SIGILS: Record<Archetype, string> = {
  'Void Paladin': '⚔',
  'Techno-Cleric': '⚙',
  'Psyker Sorcerer': '🔮',
  'Gene-Enhanced Barbarian': '💀',
  'Cyber-Necromancer': '☠',
  'Warp Assassin': '🗡',
};
