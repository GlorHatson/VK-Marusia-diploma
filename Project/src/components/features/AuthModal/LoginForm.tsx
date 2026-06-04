import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { login } from '../../../store/slices/userSlice';
import Input from '../../UI/Input/Input';
import MailIcon from '../../../assets/images/icon-mail.svg?react';
import KeyIcon from '../../../assets/images/icon-key.svg?react';
import styles from './AuthModal.module.scss';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = touched.email && !email.trim();
  const passwordError = touched.password && !password.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email.trim() || !password.trim()) return;
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['auth-modal__form']}>
      <div className={styles['auth-modal__fields']}>
        <Input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
          icon={<MailIcon />}
          theme="light"
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
          icon={<KeyIcon />}
          theme="light"
        />
      </div>
      {error && <div className={styles['auth-modal__error']}>{error}</div>}
      <button type="submit" className={styles['auth-modal__button']} disabled={loading}>
        {loading ? 'Вход...' : 'Войти'}
      </button>
      <button type="button" className={styles['auth-modal__link']} onClick={onSwitchToRegister}>
        Регистрация
      </button>
    </form>
  );
};

export default LoginForm;