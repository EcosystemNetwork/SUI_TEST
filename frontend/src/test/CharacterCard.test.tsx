import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterCard } from '../components/CharacterCard';
import { type Character } from '../types';

const mockCharacter: Character = {
  id: '0xabcdef12',
  name: 'Kael the Void Paladin',
  archetype: 'Void Paladin',
  race: 'Augmented Human',
  allegiance: 'Order',
  armorTier: 'Relic',
  stats: {
    strength: 85,
    faith: 92,
    psyPower: 45,
    machineAffinity: 60,
    corruption: 15,
    luck: 70,
  },
  corruptionLevel: 15,
  purityLevel: 85,
  originLore: 'Forged in the crucible of a dying star.',
  mutationCount: 0,
};

describe('CharacterCard', () => {
  it('renders the character card with name', () => {
    const onMintAnother = vi.fn();
    render(<CharacterCard character={mockCharacter} onMintAnother={onMintAnother} />);

    expect(screen.getByTestId('character-card')).toBeInTheDocument();
    expect(screen.getByText('Kael the Void Paladin')).toBeInTheDocument();
  });

  it('displays archetype and race', () => {
    const onMintAnother = vi.fn();
    render(<CharacterCard character={mockCharacter} onMintAnother={onMintAnother} />);

    expect(screen.getByText('Void Paladin • Augmented Human')).toBeInTheDocument();
  });

  it('displays allegiance and armor tier', () => {
    const onMintAnother = vi.fn();
    render(<CharacterCard character={mockCharacter} onMintAnother={onMintAnother} />);

    expect(screen.getByText('Order')).toBeInTheDocument();
    expect(screen.getByText('Relic')).toBeInTheDocument();
  });

  it('shows origin lore', () => {
    const onMintAnother = vi.fn();
    render(<CharacterCard character={mockCharacter} onMintAnother={onMintAnother} />);

    expect(screen.getByText('Forged in the crucible of a dying star.')).toBeInTheDocument();
  });

  it('displays corruption and purity values', () => {
    const onMintAnother = vi.fn();
    render(<CharacterCard character={mockCharacter} onMintAnother={onMintAnother} />);

    expect(screen.getByText('85% Pure')).toBeInTheDocument();
    expect(screen.getByText('15% Corrupt')).toBeInTheDocument();
  });

  it('displays character stats', () => {
    const onMintAnother = vi.fn();
    render(<CharacterCard character={mockCharacter} onMintAnother={onMintAnother} />);

    expect(screen.getByTestId('character-stats')).toBeInTheDocument();
  });

  it('calls onMintAnother when button is clicked', () => {
    const onMintAnother = vi.fn();
    render(<CharacterCard character={mockCharacter} onMintAnother={onMintAnother} />);

    fireEvent.click(screen.getByTestId('mint-another-button'));
    expect(onMintAnother).toHaveBeenCalledOnce();
  });

  it('displays the archetype sigil', () => {
    const onMintAnother = vi.fn();
    render(<CharacterCard character={mockCharacter} onMintAnother={onMintAnother} />);

    // Void Paladin sigil
    expect(screen.getByText('⚔')).toBeInTheDocument();
  });
});
