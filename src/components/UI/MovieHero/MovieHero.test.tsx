import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import MovieHero from './MovieHero';
import type { Movie } from '../../../store/slices/moviesSlice';
import moviesReducer from '../../../store/slices/moviesSlice';
import userReducer from '../../../store/slices/userSlice';
import favoritesReducer from '../../../store/slices/favoritesSlice';
import uiReducer from '../../../store/slices/uiSlice';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  posterUrl: 'https://example.com/poster.jpg',
  backdropUrl: 'https://example.com/backdrop.jpg',
  tmdbRating: 8.5,
  releaseYear: 2023,
  genres: ['Action', 'Adventure'],
  runtime: 120,
  plot: 'Test plot description',
  trailerYouTubeId: 'abc123',
};

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      movies: moviesReducer,
      user: userReducer,
      favorites: favoritesReducer,
      ui: uiReducer,
    },
    preloadedState: {
      movies: {
        top10: [],
        randomMovie: null,
        currentMovie: null,
        loading: { top10: false, random: false, current: false },
        error: { top10: null, random: null, current: null },
      },
      user: { user: null, isAuthenticated: false, loading: false, error: null },
      favorites: { items: [], loading: false, error: null },
      ui: { isAuthModalOpen: false },
      ...preloadedState,
    },
  });
};

const renderWithProviders = (ui: React.ReactElement, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('MovieHero', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const defaultProps = {
    movie: mockMovie,
    variant: 'random' as const,
    onTrailerClick: vi.fn(),
    onMoreClick: vi.fn(),
    onRefresh: vi.fn(),
  };

  it('renders movie info for random variant', () => {
    renderWithProviders(<MovieHero {...defaultProps} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Test plot description')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('2 ч 0 мин')).toBeInTheDocument();
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('renders movie info for detail variant', () => {
    renderWithProviders(
      <MovieHero movie={mockMovie} variant="detail" onTrailerClick={vi.fn()} />
    );
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Test plot description')).toBeInTheDocument();
  });

  it('renders poster when backdrop is not available', () => {
    const movieWithoutBackdrop = { ...mockMovie, backdropUrl: undefined };
    renderWithProviders(<MovieHero {...defaultProps} movie={movieWithoutBackdrop} />);
    const img = screen.getByAltText('Test Movie');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockMovie.posterUrl);
  });

  it('renders NoPoster when both poster and backdrop are missing', () => {
    const movieWithoutImages = { ...mockMovie, posterUrl: undefined, backdropUrl: undefined };
    renderWithProviders(<MovieHero {...defaultProps} movie={movieWithoutImages} />);
    expect(screen.getByText('«Test Movie»')).toBeInTheDocument();
    expect(screen.getByText('постер не найден')).toBeInTheDocument();
  });

  it('calls onTrailerClick when trailer button is clicked', () => {
    const onTrailerClick = vi.fn();
    renderWithProviders(<MovieHero {...defaultProps} onTrailerClick={onTrailerClick} />);
    const trailerBtn = screen.getByText('Трейлер');
    expect(trailerBtn).toBeInTheDocument();
    fireEvent.click(trailerBtn);
    vi.advanceTimersByTime(400); // продвигаем время для ripple-эффекта
    expect(onTrailerClick).toHaveBeenCalledTimes(1);
  });

  it('calls onMoreClick when "О фильме" button is clicked', () => {
    const onMoreClick = vi.fn();
    renderWithProviders(<MovieHero {...defaultProps} onMoreClick={onMoreClick} />);
    const moreBtn = screen.getByText('О фильме');
    expect(moreBtn).toBeInTheDocument();
    fireEvent.click(moreBtn);
    vi.advanceTimersByTime(400);
    expect(onMoreClick).toHaveBeenCalledTimes(1);
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const onRefresh = vi.fn();
    renderWithProviders(<MovieHero {...defaultProps} onRefresh={onRefresh} />);
    const refreshBtn = screen.getByLabelText('Обновить фильм');
    expect(refreshBtn).toBeInTheDocument();
    fireEvent.click(refreshBtn);
    vi.advanceTimersByTime(400);
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('applies detail class to description for detail variant', () => {
    const { container } = renderWithProviders(
      <MovieHero movie={mockMovie} variant="detail" onTrailerClick={vi.fn()} />
    );
    const description = container.querySelector('[class*="main-page__random-description--detail"]');
    expect(description).toBeInTheDocument();
  });

  it('does not apply detail class for random variant', () => {
    const { container } = renderWithProviders(<MovieHero {...defaultProps} />);
    const description = container.querySelector('[class*="main-page__random-description--detail"]');
    expect(description).not.toBeInTheDocument();
  });

  it('does not show "О фильме" button for detail variant', () => {
    renderWithProviders(
      <MovieHero movie={mockMovie} variant="detail" onTrailerClick={vi.fn()} />
    );
    expect(screen.queryByText('О фильме')).not.toBeInTheDocument();
  });

  it('does not show refresh button for detail variant', () => {
    renderWithProviders(
      <MovieHero movie={mockMovie} variant="detail" onTrailerClick={vi.fn()} />
    );
    expect(screen.queryByLabelText('Обновить фильм')).not.toBeInTheDocument();
  });
});