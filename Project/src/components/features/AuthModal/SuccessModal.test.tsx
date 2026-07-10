import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SuccessModal from './SuccessModal';

describe('SuccessModal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders title and message', () => {
    render(<SuccessModal onLoginClick={vi.fn()} />);
    expect(screen.getByText('Регистрация завершена')).toBeInTheDocument();
    expect(screen.getByText('Используйте вашу электронную почту для входа')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  it('calls onLoginClick when button is clicked', () => {
    const onLoginClick = vi.fn();
    render(<SuccessModal onLoginClick={onLoginClick} />);
    const button = screen.getByRole('button', { name: 'Войти' });
    fireEvent.click(button);
    // Продвигаем время для ripple-эффекта (400 мс)
    vi.advanceTimersByTime(400);
    expect(onLoginClick).toHaveBeenCalledTimes(1);
  });
});