import { describe, it, expect } from 'vitest';
import {
  ARCHETYPES,
  RACES,
  ALLEGIANCES,
  ARMOR_TIERS,
  generateStats,
  generateOriginLore,
  ARCHETYPE_DESCRIPTIONS,
  RACE_DESCRIPTIONS,
  ARCHETYPE_SIGILS,
  ARCHETYPE_BONUSES,
} from '../types';

describe('Character Types', () => {
  it('has 6 archetypes', () => {
    expect(ARCHETYPES).toHaveLength(6);
  });

  it('has 5 races', () => {
    expect(RACES).toHaveLength(5);
  });

  it('has 3 allegiances', () => {
    expect(ALLEGIANCES).toHaveLength(3);
    expect(ALLEGIANCES).toContain('Order');
    expect(ALLEGIANCES).toContain('Chaos');
    expect(ALLEGIANCES).toContain('Neutral');
  });

  it('has 4 armor tiers', () => {
    expect(ARMOR_TIERS).toHaveLength(4);
    expect(ARMOR_TIERS).toContain('Relic');
    expect(ARMOR_TIERS).toContain('Sanctified');
    expect(ARMOR_TIERS).toContain('Corrupted');
    expect(ARMOR_TIERS).toContain('Heretical');
  });

  it('has descriptions for all archetypes', () => {
    ARCHETYPES.forEach((arch) => {
      expect(ARCHETYPE_DESCRIPTIONS[arch]).toBeDefined();
      expect(ARCHETYPE_DESCRIPTIONS[arch].length).toBeGreaterThan(0);
    });
  });

  it('has descriptions for all races', () => {
    RACES.forEach((race) => {
      expect(RACE_DESCRIPTIONS[race]).toBeDefined();
      expect(RACE_DESCRIPTIONS[race].length).toBeGreaterThan(0);
    });
  });

  it('has sigils for all archetypes', () => {
    ARCHETYPES.forEach((arch) => {
      expect(ARCHETYPE_SIGILS[arch]).toBeDefined();
    });
  });

  it('has bonuses for all archetypes', () => {
    ARCHETYPES.forEach((arch) => {
      expect(ARCHETYPE_BONUSES[arch]).toBeDefined();
    });
  });
});

describe('generateStats', () => {
  it('generates stats within valid range [0-100]', () => {
    ARCHETYPES.forEach((arch) => {
      const stats = generateStats(arch);
      expect(stats.strength).toBeGreaterThanOrEqual(0);
      expect(stats.strength).toBeLessThanOrEqual(100);
      expect(stats.faith).toBeGreaterThanOrEqual(0);
      expect(stats.faith).toBeLessThanOrEqual(100);
      expect(stats.psyPower).toBeGreaterThanOrEqual(0);
      expect(stats.psyPower).toBeLessThanOrEqual(100);
      expect(stats.machineAffinity).toBeGreaterThanOrEqual(0);
      expect(stats.machineAffinity).toBeLessThanOrEqual(100);
      expect(stats.corruption).toBeGreaterThanOrEqual(0);
      expect(stats.corruption).toBeLessThanOrEqual(100);
      expect(stats.luck).toBeGreaterThanOrEqual(0);
      expect(stats.luck).toBeLessThanOrEqual(100);
    });
  });

  it('generates all 6 stat fields', () => {
    const stats = generateStats('Void Paladin');
    expect(stats).toHaveProperty('strength');
    expect(stats).toHaveProperty('faith');
    expect(stats).toHaveProperty('psyPower');
    expect(stats).toHaveProperty('machineAffinity');
    expect(stats).toHaveProperty('corruption');
    expect(stats).toHaveProperty('luck');
  });
});

describe('generateOriginLore', () => {
  it('generates non-empty lore string', () => {
    const lore = generateOriginLore('Void Paladin', 'Augmented Human', 'Order');
    expect(lore).toBeDefined();
    expect(lore.length).toBeGreaterThan(0);
  });

  it('includes the archetype in the lore', () => {
    // Run multiple times due to randomness
    let found = false;
    for (let i = 0; i < 20; i++) {
      const lore = generateOriginLore('Psyker Sorcerer', 'Void Elf', 'Chaos');
      if (lore.includes('Psyker Sorcerer')) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it('generates lore for all allegiance types', () => {
    const orderLore = generateOriginLore('Void Paladin', 'Augmented Human', 'Order');
    const chaosLore = generateOriginLore('Void Paladin', 'Augmented Human', 'Chaos');
    const neutralLore = generateOriginLore('Void Paladin', 'Augmented Human', 'Neutral');

    expect(orderLore.length).toBeGreaterThan(0);
    expect(chaosLore.length).toBeGreaterThan(0);
    expect(neutralLore.length).toBeGreaterThan(0);
  });
});
