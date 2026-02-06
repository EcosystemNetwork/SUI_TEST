# Character Minter — D&D × Warhammer 40K Fusion

A grimdark NFT character minting system built on the Sui blockchain, fusing Dungeons & Dragons high fantasy with Warhammer 40K sci-fi aesthetics.

## Overview

This project implements a **Character Minter** with:

- **Sui Move Smart Contract** — On-chain NFT character minting with archetypes, races, stats, equipment, allegiance, and corruption/purity mechanics
- **React/TypeScript Frontend** — Gothic cathedral-meets-starship UI for character configuration and minting

## Character System

### Archetypes
| Archetype | Primary Stats |
|---|---|
| Void Paladin | Strength, Faith |
| Techno-Cleric | Faith, Machine Affinity |
| Psyker Sorcerer | Psy Power |
| Gene-Enhanced Barbarian | Strength |
| Cyber-Necromancer | Psy Power, Machine Affinity |
| Warp Assassin | Strength, Psy Power |

### Races
- Augmented Human
- Void Elf
- Chaos-Touched Mutant
- Bio-Engineered Knight
- Machine-Bound Undead

### Allegiances
- **Order** — Holy warriors of light
- **Chaos** — Servants of the dark powers
- **Neutral** — Those who walk between

### Armor Tiers
- Relic • Sanctified • Corrupted • Heretical

### Stats
Each character has 6 stats (0–100) with archetype-based bonuses:
- **Strength** — Physical combat power
- **Faith** — Divine channeling ability
- **Psy Power** — Warp manipulation strength
- **Machine Affinity** — Technology interface aptitude
- **Corruption** — Warp taint level
- **Luck** — Fortune's favor

### Corruption / Purity System
Characters exist on a corruption-purity spectrum. Mutations increase corruption and decrease purity, while purification does the opposite. Characters can evolve over time.

## Project Structure

```
├── contracts/
│   └── character_minter/
│       ├── Move.toml              # Sui Move project config
│       ├── sources/
│       │   └── character.move     # NFT minting contract
│       └── tests/
│           └── character_tests.move  # Contract tests
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx                # Main app with minting flow
│       ├── types.ts               # Type definitions & helpers
│       ├── components/
│       │   ├── CharacterMinter.tsx # Minting configuration UI
│       │   ├── CharacterCard.tsx   # Minted character display
│       │   ├── MintingAnimation.tsx # Ritual animation overlay
│       │   └── StatPreview.tsx     # Stat bar previews
│       ├── styles/
│       │   └── index.css          # Grimdark gothic theme
│       └── test/
│           ├── setup.ts
│           ├── types.test.ts
│           ├── CharacterMinter.test.tsx
│           ├── CharacterCard.test.tsx
│           └── MintingAnimation.test.tsx
└── README.md
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev      # Development server
npm run build    # Production build
npm test         # Run tests
```

### Smart Contract

The Move contract requires the [Sui CLI](https://docs.sui.io/build/install):

```bash
cd contracts/character_minter
sui move build   # Build the contract
sui move test    # Run Move tests
```

## UI Design

The frontend follows a **gothic cathedral meets starship control deck** aesthetic:

- Dark metallic panels with gold accents
- Latin-style inscriptions on each section
- DNA helix + rune wheel spinning animation during minting
- Corruption vs Purity slider
- Class sigil indicators
- Stat bars with archetype-themed colors

## Smart Contract Functions

| Function | Description |
|---|---|
| `mint_character` | Mint a new character NFT with chosen attributes |
| `mutate_character` | Apply warp mutation (increases corruption) |
| `purify_character` | Purify the character (increases purity) |
| `update_allegiance` | Change character's allegiance |
| `upgrade_armor` | Admin: upgrade armor tier |

## License

MIT