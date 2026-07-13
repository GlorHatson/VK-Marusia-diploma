import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders all social links', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });

  it('renders VK link with correct attributes', () => {
    render(<Footer />);
    const vkLink = screen.getByLabelText('VK');
    expect(vkLink).toBeInTheDocument();
    expect(vkLink).toHaveAttribute('href', '#');
    expect(vkLink).toHaveAttribute('target', '_blank');
    expect(vkLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders YouTube link', () => {
    render(<Footer />);
    expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
  });

  it('renders OK link', () => {
    render(<Footer />);
    expect(screen.getByLabelText('OK')).toBeInTheDocument();
  });

  it('renders Telegram link', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Telegram')).toBeInTheDocument();
  });

  it('renders SVG icons inside links', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link.querySelector('svg')).toBeInTheDocument();
    });
  });
});