import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PrivateRoute from './PrivateRoute';
import userReducer from '../../store/slices/userSlice';

const createTestStore = (isAuthenticated: boolean) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
      user: { user: null, isAuthenticated, loading: false, error: null },
    },
  });
};

const renderWithProviders = (ui: React.ReactElement, store = createTestStore(true)) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/protected" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('PrivateRoute', () => {
  it('renders children when user is authenticated', () => {
    const store = createTestStore(true);
    renderWithProviders(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>,
      store
    );
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
  });

  it('redirects to home when user is not authenticated', async () => {
    const store = createTestStore(false);
    renderWithProviders(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>,
      store
    );
    // Должен произойти редирект на главную
    await waitFor(() => {
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });
});