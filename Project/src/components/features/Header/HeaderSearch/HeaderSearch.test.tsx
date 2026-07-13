import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import HeaderSearch from './HeaderSearch';
import searchReducer from '../../../../store/slices/searchSlice';
import { moviesApi } from '../../../../api/moviesApi';

// Мокаем useDebounce, чтобы он возвращал значение без задержки
vi.mock('../../../../hooks/useDebounce', () => ({
  useDebounce: vi.fn((value) => value),
}));

// Мокаем moviesApi
vi.mock('../../../../api/moviesApi', () => ({
  moviesApi: {
    searchMovies: vi.fn(),
  },
}));

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      search: searchReducer,
    },
    preloadedState: {
      search: { results: [], loading: false, error: null, ...preloadedState },
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

describe('HeaderSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Настраиваем мок по умолчанию
    (moviesApi.searchMovies as any).mockResolvedValue({ data: [{ id: 1, title: 'Test Movie' }] });
  });

  it('renders search input and icon', () => {
    const { container } = renderWithProviders(
      <HeaderSearch isSearchOpen={false} setIsSearchOpen={vi.fn()} onSelectMovie={vi.fn()} />
    );
    expect(screen.getByPlaceholderText('Поиск')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('opens dropdown when typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <HeaderSearch isSearchOpen={false} setIsSearchOpen={vi.fn()} onSelectMovie={vi.fn()} />
    );
    const input = screen.getByPlaceholderText('Поиск');
    await user.type(input, 'test');
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });

  it('clears search and closes dropdown on clear button click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <HeaderSearch isSearchOpen={false} setIsSearchOpen={vi.fn()} onSelectMovie={vi.fn()} />
    );
    const input = screen.getByPlaceholderText('Поиск');
    await user.type(input, 'test');
    const clearBtn = await screen.findByRole('button', { name: /Очистить/i });
    await user.click(clearBtn);
    expect(input).toHaveValue('');
    await waitFor(() => {
      expect(screen.queryByText('Test Movie')).not.toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <div>
        <div data-testid="outside">Outside</div>
        <HeaderSearch isSearchOpen={false} setIsSearchOpen={vi.fn()} onSelectMovie={vi.fn()} />
      </div>
    );
    const input = screen.getByPlaceholderText('Поиск');
    await user.type(input, 'test');
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('outside'));
    await waitFor(() => {
      expect(screen.queryByText('Test Movie')).not.toBeInTheDocument();
    });
  });

  it('reopens dropdown on search icon click when there is text', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <HeaderSearch isSearchOpen={false} setIsSearchOpen={vi.fn()} onSelectMovie={vi.fn()} />
    );
    const input = screen.getByPlaceholderText('Поиск');
    await user.type(input, 'test');
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
    // Закрываем кликом вне
    await user.click(document.body);
    expect(screen.queryByText('Test Movie')).not.toBeInTheDocument();
    // Клик на лупу
    const icon = document.querySelector('svg') as SVGElement;
    await user.click(icon);
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });

  it('selects a movie and closes dropdown', async () => {
    const user = userEvent.setup();
    const onSelectMovie = vi.fn();
    renderWithProviders(
      <HeaderSearch isSearchOpen={false} setIsSearchOpen={vi.fn()} onSelectMovie={onSelectMovie} />
    );
    const input = screen.getByPlaceholderText('Поиск');
    await user.type(input, 'test');
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Test Movie'));
    expect(onSelectMovie).toHaveBeenCalledWith(1);
    await waitFor(() => {
      expect(screen.queryByText('Test Movie')).not.toBeInTheDocument();
    });
  });
});