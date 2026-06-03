import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { register } from '../../../store/slices/userSlice';
import Input from '../../UI/Input/Input';
import styles from './AuthModal.module.scss';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState({
    name: false,
    surname: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const nameError = touched.name && !name.trim();
  const surnameError = touched.surname && !surname.trim();
  const emailError = touched.email && !email.trim();
  const passwordError = touched.password && !password.trim();
  const confirmError = touched.confirmPassword && (confirmPassword !== password || !confirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      surname: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    if (
      !name.trim() ||
      !surname.trim() ||
      !email.trim() ||
      !password.trim() ||
      confirmPassword !== password
    ) {
      return;
    }
    const result = await dispatch(register({ name, surname, email, password }));
    if (register.fulfilled.match(result)) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['auth-modal__form']}>
      <div className={styles['auth-modal__logo']}>маруся</div>
      <div className={styles['auth-modal__title']}>Регистрация</div>
      <div className={styles['auth-modal__fields']}>
        <Input
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
        />
        <Input
          placeholder="Фамилия"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          error={surnameError}
          onBlur={() => setTouched(prev => ({ ...prev, surname: true }))}
        />
        <Input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
        />
        <Input
          type="password"
          placeholder="Подтверждение пароля"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={confirmError}
          onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
        />
      </div>
      {error && <div className={styles['auth-modal__error']}>{error}</div>}
      <button type="submit" className={styles['auth-modal__button']} disabled={loading}>
        {loading ? 'Регистрация...' : 'Создать аккаунт'}
      </button>
      <button type="button" className={styles['auth-modal__link']} onClick={onSwitchToLogin}>
        У меня есть пароль
      </button>
    </form>
  );
};

export default RegisterForm;