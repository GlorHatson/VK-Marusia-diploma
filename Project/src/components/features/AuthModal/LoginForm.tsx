import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { login } from '../../../store/slices/userSlice';
import Input from '../../UI/Input/Input';
import MailIcon from '../../../assets/images/icon-mail.svg?react';
import KeyIcon from '../../../assets/images/icon-key.svg?react';
import Button from '../../../components/UI/Button/Button';
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

  const emailError = touched.email && (!email.trim() || !/\S+@\S+\.\S+/.test(email));
  const passwordError = touched.password && (!password.trim() || password.length < 6);
  const isValid = !emailError && !passwordError && email.trim() && password.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;
    const normalizedEmail = email.toLowerCase();
    const result = await dispatch(login({ email: normalizedEmail, password }));
    if (login.fulfilled.match(result)) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className={styles['auth-modal__form']}>
      <div className={styles['auth-modal__fields']}>
        <div>
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
          {emailError && <div className={styles['auth-modal__field-error']}>Введите корректный email</div>}
        </div>
        <div>
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
          {passwordError && <div className={styles['auth-modal__field-error']}>Пароль должен быть не менее 6 символов</div>}
        </div>
      </div>
      {error && <div className={styles['auth-modal__error']}>{error}</div>}
      <Button variant="primary" className={styles['auth-modal__button']} disabled={loading}>
        {loading ? 'Вход...' : 'Войти'}
      </Button>
      <button type="button" className={styles['auth-modal__link']} onClick={onSwitchToRegister}>
        Регистрация
      </button>
    </form>
  );
};

export default LoginForm;