import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MovieDetails from './MovieDetails';
import type { Movie } from '../../../store/slices/moviesSlice';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  language: 'en',
  budget: 1000000,
  revenue: 2000000,
  director: 'John Doe',
  production: 'Studio',
  awardsSummary: 'Best Movie',
};

const mockMovieWithoutDetails: Movie = {
  id: 2,
  title: 'No Details',
  // все остальные поля undefined
};

describe('MovieDetails', () => {
  it('renders details when they exist', () => {
    render(<MovieDetails movie={mockMovie} />);
    expect(screen.getByText('О фильме')).toBeInTheDocument();
    expect(screen.getByText('Язык оригинала')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('Бюджет')).toBeInTheDocument();
    expect(screen.getByText('1 000 000 руб.')).toBeInTheDocument();
    expect(screen.getByText('Выручка')).toBeInTheDocument();
    expect(screen.getByText('2 000 000 руб.')).toBeInTheDocument();
    expect(screen.getByText('Режиссёр')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Продакшен')).toBeInTheDocument();
    expect(screen.getByText('Studio')).toBeInTheDocument();
    expect(screen.getByText('Награды')).toBeInTheDocument();
    expect(screen.getByText('Best Movie')).toBeInTheDocument();
  });

  it('renders nothing when no details', () => {
    const { container } = render(<MovieDetails movie={mockMovieWithoutDetails} />);
    expect(container).toBeEmptyDOMElement();
  });
});