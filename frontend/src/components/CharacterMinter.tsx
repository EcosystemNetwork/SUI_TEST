import { useState } from 'react';
import {
  ARCHETYPES,
  RACES,
  ALLEGIANCES,
  ARMOR_TIERS,
  ARCHETYPE_DESCRIPTIONS,
  ARCHETYPE_SIGILS,
  RACE_DESCRIPTIONS,
  type MintConfig,
  type Archetype,
  type Race,
} from '../types';
import { StatPreview } from './StatPreview';

interface CharacterMinterProps {
  onMint: (config: MintConfig) => void;
}

export function CharacterMinter({ onMint }: CharacterMinterProps) {
  const [name, setName] = useState('');
  const [archetype, setArchetype] = useState(0);
  const [race, setRace] = useState(0);
  const [allegiance, setAllegiance] = useState(0);
  const [armorTier, setArmorTier] = useState(0);
  const [corruptionLevel, setCorruptionLevel] = useState(20);

  const purityLevel = 100 - corruptionLevel;
  const canMint = name.trim().length > 0;

  const handleMint = () => {
    if (!canMint) return;
    onMint({
      name: name.trim(),
      archetype,
      race,
      allegiance,
      armorTier,
      corruptionLevel,
      purityLevel,
    });
  };

  return (
    <div data-testid="character-minter">
      {/* Name Input */}
      <div className="panel">
        <div className="panel-title">Designation</div>
        <div className="panel-subtitle">† NOMEN EST OMEN †</div>
        <div className="name-input-container">
          <label className="name-input-label" htmlFor="character-name">
            Character Designation
          </label>
          <input
            id="character-name"
            className="name-input"
            type="text"
            placeholder="Enter thy name, warrior..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={64}
            data-testid="name-input"
          />
        </div>
      </div>

      {/* Archetype Selection */}
      <div className="panel">
        <div className="panel-title">Archetype</div>
        <div className="panel-subtitle">† SELECTIO CLASSIS BELLATORIS †</div>
        <div className="selector-grid" data-testid="archetype-selector">
          {ARCHETYPES.map((arch, i) => (
            <div
              key={arch}
              className={`selector-card ${i === archetype ? 'selected' : ''}`}
              onClick={() => setArchetype(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setArchetype(i)}
              data-testid={`archetype-${i}`}
            >
              <span className="selector-card-sigil">
                {ARCHETYPE_SIGILS[arch as Archetype]}
              </span>
              <div className="selector-card-name">{arch}</div>
              <div className="selector-card-desc">
                {ARCHETYPE_DESCRIPTIONS[arch as Archetype]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Race Selection */}
      <div className="panel">
        <div className="panel-title">Race</div>
        <div className="panel-subtitle">† GENUS ORIGINIS †</div>
        <div className="selector-grid" data-testid="race-selector">
          {RACES.map((r, i) => (
            <div
              key={r}
              className={`selector-card ${i === race ? 'selected' : ''}`}
              onClick={() => setRace(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setRace(i)}
              data-testid={`race-${i}`}
            >
              <div className="selector-card-name">{r}</div>
              <div className="selector-card-desc">
                {RACE_DESCRIPTIONS[r as Race]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allegiance Selection */}
      <div className="panel">
        <div className="panel-title">Allegiance</div>
        <div className="panel-subtitle">† FIDES ET DEVOTIO †</div>
        <div className="selector-grid" data-testid="allegiance-selector">
          {ALLEGIANCES.map((a, i) => (
            <div
              key={a}
              className={`selector-card ${i === allegiance ? 'selected' : ''}`}
              onClick={() => setAllegiance(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setAllegiance(i)}
              data-testid={`allegiance-${i}`}
            >
              <div className="selector-card-name">{a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Armor Tier */}
      <div className="panel">
        <div className="panel-title">Armor Tier</div>
        <div className="panel-subtitle">† ARMATURA SACRA †</div>
        <div className="selector-grid" data-testid="armor-selector">
          {ARMOR_TIERS.map((t, i) => (
            <div
              key={t}
              className={`selector-card ${i === armorTier ? 'selected' : ''}`}
              onClick={() => setArmorTier(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setArmorTier(i)}
              data-testid={`armor-${i}`}
            >
              <div className="selector-card-name">{t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Corruption / Purity Slider */}
      <div className="panel">
        <div className="panel-title">Corruption / Purity Balance</div>
        <div className="panel-subtitle">† AEQUILIBRIUM ANIMAE †</div>
        <div className="corruption-slider-container" data-testid="corruption-slider">
          <div className="corruption-slider-header">
            <span className="corruption-label purity-side">Purity</span>
            <span className="corruption-label corruption-side">Corruption</span>
          </div>
          <input
            type="range"
            className="corruption-slider"
            min="0"
            max="100"
            value={corruptionLevel}
            onChange={(e) => setCorruptionLevel(Number(e.target.value))}
            aria-label="Corruption level"
          />
          <div className="corruption-values">
            <span className="corruption-val purity">{purityLevel}% Pure</span>
            <span className="corruption-val corrupt">{corruptionLevel}% Corrupt</span>
          </div>
        </div>
      </div>

      {/* Stat Preview */}
      <StatPreview archetype={ARCHETYPES[archetype] as Archetype} />

      {/* Mint Button */}
      <button
        className="mint-button"
        onClick={handleMint}
        disabled={!canMint}
        data-testid="mint-button"
      >
        Initiate Sacred Minting Ritual
      </button>
    </div>
  );
}
