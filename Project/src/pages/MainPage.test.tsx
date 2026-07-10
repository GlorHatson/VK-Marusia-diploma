import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import moviesReducer from '../store/slices/moviesSlice';
import userReducer from '../store/slices/userSlice';
import favoritesReducer from '../store/slices/favoritesSlice';
import uiReducer from '../store/slices/uiSlice';
import { apiClient } from '../services/axiosInstance';
import * as moviesSlice from '../store/slices/moviesSlice';

// Мокаем apiClient
vi.mock('../services/axiosInstance', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockTop10 = [
  { id: 1, title: 'Movie 1', posterUrl: 'https://example.com/1.jpg' },
  { id: 2, title: 'Movie 2', posterUrl: 'https://example.com/2.jpg' },
];
const mockRandomMovie = {
  id: 10,
  title: 'Random Movie',
  posterUrl: 'https://example.com/random.jpg',
  backdropUrl: 'https://example.com/random-backdrop.jpg',
  tmdbRating: 8.5,
  releaseYear: 2024,
  genres: ['Action'],
  runtime: 120,
  plot: 'Random plot',
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
        ...preloadedState,
      },
      user: { user: null, isAuthenticated: false, loading: false, error: null },
      favorites: { items: [], loading: false, error: null },
      ui: { isAuthModalOpen: false },
    },
  });
};

const renderWithProviders = (ui: React.ReactElement, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('MainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (apiClient.get as any).mockImplementation((url: string) => {
      if (url === '/movie/top10') {
        return Promise.resolve({ data: mockTop10 });
      }
      if (url === '/movie/random') {
        return Promise.resolve({ data: mockRandomMovie });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('renders loader while loading', () => {
    const store = createTestStore({
      loading: { top10: true, random: true },
    });
    renderWithProviders(<MainPage />, store);
    expect(screen.getByText('Загрузка страницы...')).toBeInTheDocument();
  });

  it('renders random movie and top10 after loading', async () => {
    const store = createTestStore({
      top10: mockTop10,
      randomMovie: mockRandomMovie,
    });
    renderWithProviders(<MainPage />, store);
    await waitFor(() => {
      expect(screen.getByText('Random Movie')).toBeInTheDocument();
      expect(screen.getByText('Random plot')).toBeInTheDocument();
      // Проверяем наличие карточек фильмов по alt
      expect(screen.getByAltText('Movie 1')).toBeInTheDocument();
      expect(screen.getByAltText('Movie 2')).toBeInTheDocument();
    });
  });

  it('dispatches fetch actions on mount', async () => {
    const store = createTestStore();
    renderWithProviders(<MainPage />, store);
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/movie/top10');
      expect(apiClient.get).toHaveBeenCalledWith('/movie/random');
    });
  });

  it('shows error message on error', async () => {
    // Мокаем thunk'и, чтобы они не меняли состояние и не вызывали apiClient
    const fetchTop10Mock = vi.spyOn(moviesSlice, 'fetchTop10').mockReturnValue({
      type: 'movies/fetchTop10/fulfilled',
      payload: [],
    } as any);
    const fetchRandomMovieMock = vi.spyOn(moviesSlice, 'fetchRandomMovie').mockReturnValue({
      type: 'movies/fetchRandomMovie/fulfilled',
      payload: null,
    } as any);

    const store = createTestStore({
      error: { top10: 'Ошибка загрузки топ-10', random: null, current: null },
      loading: { top10: false, random: false, current: false },
    });
    renderWithProviders(<MainPage />, store);
    // Ждём, пока компонент обработает состояние
    await waitFor(() => {
      expect(screen.getByText(/Не удалось загрузить топ-10/)).toBeInTheDocument();
    });

    fetchTop10Mock.mockRestore();
    fetchRandomMovieMock.mockRestore();
  });
});