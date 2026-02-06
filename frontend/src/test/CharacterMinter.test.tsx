import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterMinter } from '../components/CharacterMinter';

describe('CharacterMinter', () => {
  it('renders the minter form', () => {
    const onMint = vi.fn();
    render(<CharacterMinter onMint={onMint} />);

    expect(screen.getByTestId('character-minter')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('archetype-selector')).toBeInTheDocument();
    expect(screen.getByTestId('race-selector')).toBeInTheDocument();
    expect(screen.getByTestId('allegiance-selector')).toBeInTheDocument();
    expect(screen.getByTestId('armor-selector')).toBeInTheDocument();
    expect(screen.getByTestId('corruption-slider')).toBeInTheDocument();
    expect(screen.getByTestId('stat-preview')).toBeInTheDocument();
    expect(screen.getByTestId('mint-button')).toBeInTheDocument();
  });

  it('disables mint button when name is empty', () => {
    const onMint = vi.fn();
    render(<CharacterMinter onMint={onMint} />);

    const mintButton = screen.getByTestId('mint-button');
    expect(mintButton).toBeDisabled();
  });

  it('enables mint button when name is entered', () => {
    const onMint = vi.fn();
    render(<CharacterMinter onMint={onMint} />);

    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'Kael the Void Paladin' } });

    const mintButton = screen.getByTestId('mint-button');
    expect(mintButton).not.toBeDisabled();
  });

  it('calls onMint with correct config', () => {
    const onMint = vi.fn();
    render(<CharacterMinter onMint={onMint} />);

    // Enter name
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Test Warrior' },
    });

    // Select archetype (click the second one — Techno-Cleric)
    fireEvent.click(screen.getByTestId('archetype-1'));

    // Select race (click the third one — Chaos-Touched Mutant)
    fireEvent.click(screen.getByTestId('race-2'));

    // Select allegiance (Chaos)
    fireEvent.click(screen.getByTestId('allegiance-1'));

    // Select armor (Sanctified)
    fireEvent.click(screen.getByTestId('armor-1'));

    // Click mint
    fireEvent.click(screen.getByTestId('mint-button'));

    expect(onMint).toHaveBeenCalledWith({
      name: 'Test Warrior',
      archetype: 1,
      race: 2,
      allegiance: 1,
      armorTier: 1,
      corruptionLevel: 20,
      purityLevel: 80,
    });
  });

  it('renders all 6 archetypes', () => {
    const onMint = vi.fn();
    render(<CharacterMinter onMint={onMint} />);

    expect(screen.getByText('Void Paladin')).toBeInTheDocument();
    expect(screen.getByText('Techno-Cleric')).toBeInTheDocument();
    expect(screen.getByText('Psyker Sorcerer')).toBeInTheDocument();
    expect(screen.getByText('Gene-Enhanced Barbarian')).toBeInTheDocument();
    expect(screen.getByText('Cyber-Necromancer')).toBeInTheDocument();
    expect(screen.getByText('Warp Assassin')).toBeInTheDocument();
  });

  it('renders all 5 races', () => {
    const onMint = vi.fn();
    render(<CharacterMinter onMint={onMint} />);

    expect(screen.getByText('Augmented Human')).toBeInTheDocument();
    expect(screen.getByText('Void Elf')).toBeInTheDocument();
    expect(screen.getByText('Chaos-Touched Mutant')).toBeInTheDocument();
    expect(screen.getByText('Bio-Engineered Knight')).toBeInTheDocument();
    expect(screen.getByText('Machine-Bound Undead')).toBeInTheDocument();
  });

  it('renders all 3 allegiances', () => {
    const onMint = vi.fn();
    render(<CharacterMinter onMint={onMint} />);

    expect(screen.getByText('Order')).toBeInTheDocument();
    expect(screen.getByText('Chaos')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
  });

  it('renders all 4 armor tiers', () => {
    const onMint = vi.fn();
    render(<CharacterMinter onMint={onMint} />);

    expect(screen.getByText('Relic')).toBeInTheDocument();
    expect(screen.getByText('Sanctified')).toBeInTheDocument();
    expect(screen.getByText('Corrupted')).toBeInTheDocument();
    expect(screen.getByText('Heretical')).toBeInTheDocument();
  });
});
