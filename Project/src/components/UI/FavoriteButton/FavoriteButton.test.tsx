import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FavoriteButton from './FavoriteButton';
import userReducer from '../../../store/slices/userSlice';
import favoritesReducer from '../../../store/slices/favoritesSlice';
import uiReducer from '../../../store/slices/uiSlice';
import * as uiActions from '../../../store/slices/uiSlice';
import * as favoritesActions from '../../../store/slices/favoritesSlice';
import type { Movie } from '../../../store/slices/moviesSlice';

// Mock-объект фильма для тестов
const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  posterUrl: 'https://example.com/poster.jpg',
};

// Создаём store для тестов
const createTestStore = (isAuthenticated = false, isFavorite = false) => {
  return configureStore({
    reducer: {
      user: userReducer,
      favorites: favoritesReducer,
      ui: uiReducer,
    },
    preloadedState: {
      user: { isAuthenticated, user: null, loading: false, error: null },
      favorites: { items: isFavorite ? [mockMovie] : [], loading: false, error: null },
      ui: { isAuthModalOpen: false },
    },
  });
};

describe('FavoriteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(uiActions, 'setAuthModalOpen');
    vi.spyOn(favoritesActions, 'addToFavorites');
    vi.spyOn(favoritesActions, 'removeFromFavorites');
  });

  it('opens auth modal when user is not authenticated', () => {
    const store = createTestStore(false, false);
    render(
      <Provider store={store}>
        <FavoriteButton movieId={mockMovie.id} movie={mockMovie} />
      </Provider>
    );
    const button = screen.getByRole('button', { name: /Добавить в избранное/i });
    fireEvent.click(button);
    expect(uiActions.setAuthModalOpen).toHaveBeenCalledWith(true);
  });

  it('adds to favorites when user is authenticated and not favorite', async () => {
    const store = createTestStore(true, false);
    render(
      <Provider store={store}>
        <FavoriteButton movieId={mockMovie.id} movie={mockMovie} />
      </Provider>
    );
    const button = screen.getByRole('button', { name: /Добавить в избранное/i });
    fireEvent.click(button);
    expect(favoritesActions.addToFavorites).toHaveBeenCalledWith(mockMovie);
  });

  it('removes from favorites when user is authenticated and is favorite', async () => {
    const store = createTestStore(true, true);
    render(
      <Provider store={store}>
        <FavoriteButton movieId={mockMovie.id} movie={mockMovie} />
      </Provider>
    );
    const button = screen.getByRole('button', { name: /Удалить из избранного/i });
    fireEvent.click(button);
    expect(favoritesActions.removeFromFavorites).toHaveBeenCalledWith(mockMovie.id);
  });

  it('renders active state when movie is favorite', () => {
    const store = createTestStore(true, true);
    render(
      <Provider store={store}>
        <FavoriteButton movieId={mockMovie.id} movie={mockMovie} />
      </Provider>
    );
    const button = screen.getByRole('button', { name: /Удалить из избранного/i });
    expect(button).toHaveClass(/favorite-button--active/);
  });

  it('renders inactive state when movie is not favorite', () => {
    const store = createTestStore(true, false);
    render(
      <Provider store={store}>
        <FavoriteButton movieId={mockMovie.id} movie={mockMovie} />
      </Provider>
    );
    const button = screen.getByRole('button', { name: /Добавить в избранное/i });
    expect(button).not.toHaveClass(/favorite-button--active/);
  });

  it('disables button when loading', () => {
    const store = configureStore({
      reducer: {
        user: userReducer,
        favorites: (state = { items: [], loading: true, error: null }, _action) => state,
        ui: uiReducer,
      },
      preloadedState: {
        user: { isAuthenticated: true, user: null, loading: false, error: null },
        ui: { isAuthModalOpen: false },
      },
    });
    render(
      <Provider store={store}>
        <FavoriteButton movieId={mockMovie.id} movie={mockMovie} />
      </Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});