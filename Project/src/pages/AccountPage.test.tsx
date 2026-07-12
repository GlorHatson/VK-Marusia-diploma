import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import AccountPage from '../pages/AccountPage';
import userReducer from '../store/slices/userSlice';
import favoritesReducer from '../store/slices/favoritesSlice';
import uiReducer from '../store/slices/uiSlice';
import { favoritesApi } from '../api/favoritesApi';
import * as userSlice from '../store/slices/userSlice';

vi.mock('../api/favoritesApi', () => ({
  favoritesApi: {
    getFavorites: vi.fn(),
  },
}));

const mockUser = {
  name: 'John',
  surname: 'Doe',
  email: 'john@example.com',
};
const mockFavorites = [
  { id: 1, title: 'Movie 1', posterUrl: 'https://example.com/1.jpg' },
  { id: 2, title: 'Movie 2', posterUrl: 'https://example.com/2.jpg' },
];

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
      favorites: favoritesReducer,
      ui: uiReducer,
    },
    preloadedState: {
      user: { user: mockUser, isAuthenticated: true, loading: false, error: null },
      favorites: { items: mockFavorites, loading: false, error: null },
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

describe('AccountPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (favoritesApi.getFavorites as any).mockResolvedValue({ data: mockFavorites });
  });

  it('renders account page with favorites tab by default', async () => {
    renderWithProviders(<AccountPage />);
    // Ждём, пока загрузка избранного завершится
    await waitFor(() => {
      expect(screen.queryByText('Загрузка избранного...')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Мой аккаунт')).toBeInTheDocument();
    expect(screen.getByText('Избранные фильмы')).toBeInTheDocument();
    expect(screen.getByText('Настройка аккаунта')).toBeInTheDocument();
    expect(screen.getByAltText('Movie 1')).toBeInTheDocument();
    expect(screen.getByAltText('Movie 2')).toBeInTheDocument();
  });

  it('switches to settings tab when clicked', async () => {
    renderWithProviders(<AccountPage />);
    await waitFor(() => {
      expect(screen.queryByText('Загрузка избранного...')).not.toBeInTheDocument();
    });
    const settingsTab = screen.getByText('Настройка аккаунта');
    fireEvent.click(settingsTab);
    expect(screen.getByText('Имя Фамилия')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Электронная почта')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Выйти из аккаунта')).toBeInTheDocument();
  });

  it('switches back to favorites tab when clicked', async () => {
    renderWithProviders(<AccountPage />);
    await waitFor(() => {
      expect(screen.queryByText('Загрузка избранного...')).not.toBeInTheDocument();
    });
    const settingsTab = screen.getByText('Настройка аккаунта');
    fireEvent.click(settingsTab);
    const favoritesTab = screen.getByText('Избранные фильмы');
    fireEvent.click(favoritesTab);
    expect(screen.getByAltText('Movie 1')).toBeInTheDocument();
    expect(screen.getByAltText('Movie 2')).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', async () => {
    const logoutSpy = vi.spyOn(userSlice, 'logout');
    renderWithProviders(<AccountPage />);
    await waitFor(() => {
      expect(screen.queryByText('Загрузка избранного...')).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Настройка аккаунта'));
    const logoutBtn = screen.getByText('Выйти из аккаунта');
    fireEvent.click(logoutBtn);
    await waitFor(() => {
      expect(logoutSpy).toHaveBeenCalled();
    });
    logoutSpy.mockRestore();
  });
});