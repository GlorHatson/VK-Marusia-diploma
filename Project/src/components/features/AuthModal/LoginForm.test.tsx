import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginForm from './LoginForm';
import userReducer from '../../../store/slices/userSlice';
import uiReducer from '../../../store/slices/uiSlice';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
      ui: uiReducer,
    },
    preloadedState: {
      user: { user: null, isAuthenticated: false, loading: false, error: null },
      ui: { isAuthModalOpen: true },
      ...preloadedState,
    },
  });
};

const renderWithProviders = (ui: React.ReactElement, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  );
};

describe('LoginForm', () => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onSwitchToRegister: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    renderWithProviders(<LoginForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Электронная почта')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
  });

  it('shows validation errors for invalid email and short password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm {...defaultProps} />);
    const emailInput = screen.getByPlaceholderText('Электронная почта');
    const passwordInput = screen.getByPlaceholderText('Пароль');
    const submitButton = screen.getByRole('button', { name: 'Войти' });

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, '123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Введите корректный email')).toBeInTheDocument();
      expect(screen.getByText('Пароль должен быть не менее 6 символов')).toBeInTheDocument();
    });
  });

  it('calls onSuccess when login succeeds', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const store = createTestStore();
    // Мокаем login успех
    const mockDispatch = vi.spyOn(store, 'dispatch').mockResolvedValue({
      type: 'user/login/fulfilled',
      payload: { name: 'John', surname: 'Doe', email: 'test@example.com' },
    });
    renderWithProviders(<LoginForm {...defaultProps} onSuccess={onSuccess} />, store);

    await user.type(screen.getByPlaceholderText('Электронная почта'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Пароль'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
    mockDispatch.mockRestore();
  });

  it('calls onSwitchToRegister when "Регистрация" button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm {...defaultProps} />);
    await user.click(screen.getByText('Регистрация'));
    expect(defaultProps.onSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  it('disables submit button while loading', () => {
    const store = createTestStore({ user: { loading: true } });
    renderWithProviders(<LoginForm {...defaultProps} />, store);
    expect(screen.getByRole('button', { name: 'Вход...' })).toBeDisabled();
  });
});