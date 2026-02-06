import { type Character, ARCHETYPE_SIGILS } from '../types';

interface CharacterCardProps {
  character: Character;
  onMintAnother: () => void;
}

export function CharacterCard({ character, onMintAnother }: CharacterCardProps) {
  const sigil = ARCHETYPE_SIGILS[character.archetype];

  return (
    <div className="character-card" data-testid="character-card">
      {/* Header */}
      <div className="character-card-header">
        <span className="character-card-sigil">{sigil}</span>
        <h2 className="character-card-name">{character.name}</h2>
        <div className="character-card-class">
          {character.archetype} • {character.race}
        </div>
      </div>

      {/* Lore */}
      <div className="character-card-lore">{character.originLore}</div>

      {/* Meta Info */}
      <div className="character-card-meta">
        <div className="meta-item">
          <div className="meta-item-label">Allegiance</div>
          <div className="meta-item-value">{character.allegiance}</div>
        </div>
        <div className="meta-item">
          <div className="meta-item-label">Armor</div>
          <div className="meta-item-value">{character.armorTier}</div>
        </div>
        <div className="meta-item">
          <div className="meta-item-label">ID</div>
          <div className="meta-item-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            {character.id}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" data-testid="character-stats">
        {Object.entries(character.stats).map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (c) => c.toUpperCase())
            .trim();

          let cssClass = '';
          if (key === 'corruption') cssClass = 'corruption';
          else if (key === 'psyPower') cssClass = 'psy';
          else if (key === 'faith') cssClass = 'faith';

          return (
            <div className="stat-bar" key={key}>
              <div className="stat-bar-label">
                <span>{label}</span>
                <span className="stat-bar-value">{value}</span>
              </div>
              <div className="stat-bar-track">
                <div
                  className={`stat-bar-fill ${cssClass}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Corruption/Purity */}
      <div className="corruption-slider-container" style={{ marginTop: '1rem' }}>
        <div className="corruption-values">
          <span className="corruption-val purity">{character.purityLevel}% Pure</span>
          <span className="corruption-val corrupt">{character.corruptionLevel}% Corrupt</span>
        </div>
      </div>

      {/* Mint Another */}
      <button
        className="mint-another-button"
        onClick={onMintAnother}
        data-testid="mint-another-button"
      >
        ✦ Perform Another Sacred Minting ✦
      </button>
    </div>
  );
}
