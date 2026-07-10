import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import HeaderSearch from './HeaderSearch';
import searchReducer from '../../../../store/slices/searchSlice';

// Мокаем useDebounce, чтобы он возвращал значение без задержки
vi.mock('../../../../hooks/useDebounce', () => ({
  useDebounce: vi.fn((value) => value),
}));

// Мокаем apiClient, чтобы запросы не уходили на сервер
vi.mock('../../../../services/axiosInstance', () => ({
  apiClient: {
    get: vi.fn(() => Promise.resolve({ data: [{ id: 1, title: 'Test Movie' }] })),
  },
}));

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      search: searchReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
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
    const store = createTestStore();
    renderWithProviders(
      <HeaderSearch isSearchOpen={false} setIsSearchOpen={vi.fn()} onSelectMovie={vi.fn()} />,
      store
    );
    const input = screen.getByPlaceholderText('Поиск');
    await user.type(input, 'test');
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });

  it('clears search and closes dropdown on clear button click', async () => {
    const user = userEvent.setup();
    const store = createTestStore({ results: [{ id: 1, title: 'Test Movie' }] });
    renderWithProviders(
      <HeaderSearch isSearchOpen={false} setIsSearchOpen={vi.fn()} onSelectMovie={vi.fn()} />,
      store
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
    const store = createTestStore({ results: [{ id: 1, title: 'Test Movie' }] });
    const { container } = renderWithProviders(
      <HeaderSearch isSearchOpen={false} setIsSearchOpen={vi.fn()} onSelectMovie={vi.fn()} />,
      store
    );
    const input = screen.getByPlaceholderText('Поиск');
    await user.type(input, 'test');
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
    await user.click(document.body);
    expect(screen.queryByText('Test Movie')).not.toBeInTheDocument();
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    await user.click(icon!);
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });

  it('selects a movie and closes dropdown', async () => {
    const user = userEvent.setup();
    const onSelectMovie = vi.fn();
    const store = createTestStore({ results: [{ id: 1, title: 'Test Movie' }] });
    renderWithProviders(
      <HeaderSearch isSearchOpen={false} setIsSearchOpen={vi.fn()} onSelectMovie={onSelectMovie} />,
      store
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