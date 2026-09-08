import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieCard from './MovieCard';
import type { Movie } from '../../../store/slices/moviesSlice';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  posterUrl: 'https://example.com/poster.jpg',
  releaseYear: 2023,
  genres: ['Action'],
  runtime: 120,
  tmdbRating: 7.5,
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('MovieCard', () => {
  it('renders movie poster and title', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />);
    const img = screen.getByAltText('Test Movie');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockMovie.posterUrl);
  });

  it('renders NoPoster when posterUrl is missing', () => {
    const movieWithoutPoster = { ...mockMovie, posterUrl: undefined };
    renderWithRouter(<MovieCard movie={movieWithoutPoster} />);
    expect(screen.getByText('«Test Movie»')).toBeInTheDocument();
    expect(screen.getByText('постер не найден')).toBeInTheDocument();
  });

  it('renders rank when provided', () => {
    renderWithRouter(<MovieCard movie={mockMovie} rank={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();
    renderWithRouter(<MovieCard movie={mockMovie} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('img', { name: /Test Movie/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders remove button when showRemove is true', () => {
    const handleRemove = vi.fn();
    renderWithRouter(
      <MovieCard movie={mockMovie} showRemove onRemove={handleRemove} />
    );
    const removeBtn = screen.getByRole('button', { name: /Удалить из избранного/i });
    expect(removeBtn).toBeInTheDocument();
    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('does not render remove button when showRemove is false', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />);
    expect(screen.queryByRole('button', { name: /Удалить из избранного/i })).not.toBeInTheDocument();
  });
});