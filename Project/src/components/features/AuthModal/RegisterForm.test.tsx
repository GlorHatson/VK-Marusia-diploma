import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RegisterForm from './RegisterForm';
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

describe('RegisterForm', () => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onSwitchToLogin: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    renderWithProviders(<RegisterForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Электронная почта')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Имя')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Фамилия')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Подтверждение пароля')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Создать аккаунт' })).toBeInTheDocument();
    expect(screen.getByText('У меня есть пароль')).toBeInTheDocument();
  });

  it('shows validation errors for invalid fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm {...defaultProps} />);
    const emailInput = screen.getByPlaceholderText('Электронная почта');
    const nameInput = screen.getByPlaceholderText('Имя');
    const surnameInput = screen.getByPlaceholderText('Фамилия');
    const passwordInput = screen.getByPlaceholderText('Пароль');
    const confirmInput = screen.getByPlaceholderText('Подтверждение пароля');
    const submitButton = screen.getByRole('button', { name: 'Создать аккаунт' });

    await user.type(emailInput, 'invalid-email');
    await user.type(nameInput, 'John'); // валидное имя
    // фамилию оставляем пустой
    await user.type(passwordInput, '123');
    await user.type(confirmInput, '456');
    
    // Чтобы ошибка для фамилии появилась, нужно, чтобы поле потеряло фокус
    // или мы можем вызвать blur вручную после отправки
    await user.click(submitButton);

    // После клика ошибки для email и пароля должны появиться
    await waitFor(() => {
      expect(screen.getByText('Введите корректный email')).toBeInTheDocument();
      expect(screen.getByText('Пароль должен быть не менее 6 символов')).toBeInTheDocument();
      expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument();
    });

    // Теперь имитируем потерю фокуса для поля фамилии, чтобы ошибка появилась
    fireEvent.blur(surnameInput);
    await waitFor(() => {
      expect(screen.getByText('Обязательное поле')).toBeInTheDocument();
    });
  });

  it('calls onSuccess when registration succeeds', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const store = createTestStore();
    const mockDispatch = vi.spyOn(store, 'dispatch').mockResolvedValue({
      type: 'user/register/fulfilled',
      payload: { success: true },
    });
    renderWithProviders(<RegisterForm {...defaultProps} onSuccess={onSuccess} />, store);

    await user.type(screen.getByPlaceholderText('Электронная почта'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Имя'), 'John');
    await user.type(screen.getByPlaceholderText('Фамилия'), 'Doe');
    await user.type(screen.getByPlaceholderText('Пароль'), 'password123');
    await user.type(screen.getByPlaceholderText('Подтверждение пароля'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Создать аккаунт' }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
    mockDispatch.mockRestore();
  });

  it('calls onSwitchToLogin when "У меня есть пароль" is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm {...defaultProps} />);
    await user.click(screen.getByText('У меня есть пароль'));
    expect(defaultProps.onSwitchToLogin).toHaveBeenCalledTimes(1);
  });

  it('disables submit button while loading', () => {
    const store = createTestStore({ user: { loading: true } });
    renderWithProviders(<RegisterForm {...defaultProps} />, store);
    expect(screen.getByRole('button', { name: 'Регистрация...' })).toBeDisabled();
  });
});