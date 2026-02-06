export function MintingAnimation() {
  return (
    <div className="minting-overlay" data-testid="minting-animation">
      {/* Rune Wheel */}
      <div className="minting-rune-wheel">
        <div className="rune-ring" />
        <div className="rune-ring" />
        <div className="rune-ring" />
        <div className="dna-helix">🧬</div>
      </div>

      <div className="minting-text">Forging Your Character...</div>
      <div className="minting-subtitle">
        BINDING SOUL TO FORM • INSCRIBING RUNES • SEALING FATE
      </div>
    </div>
  );
}
