import { useState, useCallback } from 'react';
import { CharacterMinter } from './components/CharacterMinter';
import { CharacterCard } from './components/CharacterCard';
import { MintingAnimation } from './components/MintingAnimation';
import {
  type Character,
  type Archetype,
  type Race,
  type Allegiance,
  type ArmorTier,
  ARCHETYPES,
  RACES,
  ALLEGIANCES,
  ARMOR_TIERS,
  generateStats,
  generateOriginLore,
} from './types';

type AppPhase = 'configure' | 'minting' | 'complete';

function App() {
  const [phase, setPhase] = useState<AppPhase>('configure');
  const [mintedCharacter, setMintedCharacter] = useState<Character | null>(null);

  const handleMint = useCallback(
    (config: {
      name: string;
      archetype: number;
      race: number;
      allegiance: number;
      armorTier: number;
      corruptionLevel: number;
      purityLevel: number;
    }) => {
      setPhase('minting');

      const archetype = ARCHETYPES[config.archetype] as Archetype;
      const race = RACES[config.race] as Race;
      const allegiance = ALLEGIANCES[config.allegiance] as Allegiance;
      const armorTier = ARMOR_TIERS[config.armorTier] as ArmorTier;

      // Simulate minting delay (in production, this would be a blockchain tx)
      setTimeout(() => {
        const character: Character = {
          id: `0x${Math.random().toString(16).slice(2, 10)}`,
          name: config.name,
          archetype,
          race,
          allegiance,
          armorTier,
          stats: generateStats(archetype),
          corruptionLevel: config.corruptionLevel,
          purityLevel: config.purityLevel,
          originLore: generateOriginLore(archetype, race, allegiance),
          mutationCount: 0,
        };

        setMintedCharacter(character);
        setPhase('complete');
      }, 3000);
    },
    [],
  );

  const handleMintAnother = useCallback(() => {
    setMintedCharacter(null);
    setPhase('configure');
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Character Minter</h1>
        <p className="app-subtitle">Dungeons & Dragons × Warhammer 40K</p>
      </header>

      <main className="app-main">
        {phase === 'configure' && <CharacterMinter onMint={handleMint} />}

        {phase === 'minting' && <MintingAnimation />}

        {phase === 'complete' && mintedCharacter && (
          <CharacterCard
            character={mintedCharacter}
            onMintAnother={handleMintAnother}
          />
        )}
      </main>
    </div>
  );
}

export default App;
