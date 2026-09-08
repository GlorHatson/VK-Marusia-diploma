import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Rating from './Rating';

describe('Rating', () => {
  it('renders star and value', () => {
    render(<Rating value={7.5} showStar />);
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.getByText('7.5')).toBeInTheDocument();
  });

  it('renders without star', () => {
    render(<Rating value={7.5} showStar={false} />);
    expect(screen.queryByText('★')).not.toBeInTheDocument();
    expect(screen.getByText('7.5')).toBeInTheDocument();
  });

  it('renders "—" when value is undefined', () => {
    render(<Rating value={undefined} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('applies correct color modifier for rating', () => {
    const { container } = render(<Rating value={8.5} />);
    // Используем регулярное выражение, так как CSS Modules добавляют хеш к классу
    expect(container.firstChild).toHaveClass(/rating--gold/);
  });

  it('applies compact class when passed', () => {
    const { container } = render(<Rating value={7} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});