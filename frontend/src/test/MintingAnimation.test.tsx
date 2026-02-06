import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MintingAnimation } from '../components/MintingAnimation';

describe('MintingAnimation', () => {
  it('renders the minting animation overlay', () => {
    render(<MintingAnimation />);

    expect(screen.getByTestId('minting-animation')).toBeInTheDocument();
    expect(screen.getByText('Forging Your Character...')).toBeInTheDocument();
  });

  it('displays the DNA helix symbol', () => {
    render(<MintingAnimation />);

    expect(screen.getByText('🧬')).toBeInTheDocument();
  });

  it('shows the ritual description', () => {
    render(<MintingAnimation />);

    expect(
      screen.getByText('BINDING SOUL TO FORM • INSCRIBING RUNES • SEALING FATE'),
    ).toBeInTheDocument();
  });
});
