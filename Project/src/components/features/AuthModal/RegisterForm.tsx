import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { register } from '../../../store/slices/userSlice';
import Input from '../../UI/Input/Input';
import MailIcon from '../../../assets/images/icon-mail.svg?react';
import UserIcon from '../../../assets/images/icon-user.svg?react';
import KeyIcon from '../../../assets/images/icon-key.svg?react';
import styles from './AuthModal.module.scss';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState({
    email: false,
    name: false,
    surname: false,
    password: false,
    confirmPassword: false,
  });

  const emailError = touched.email && (!email.trim() || !/\S+@\S+\.\S+/.test(email));
  const nameError = touched.name && !name.trim();
  const surnameError = touched.surname && !surname.trim();
  const passwordError = touched.password && (!password.trim() || password.length < 6);
  const confirmError = touched.confirmPassword && (confirmPassword !== password || !confirmPassword);

  const isValid = !emailError && !nameError && !surnameError && !passwordError && !confirmError
    && email.trim() && name.trim() && surname.trim() && password.trim() && confirmPassword === password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, name: true, surname: true, password: true, confirmPassword: true });
    if (!isValid) return;
    const normalizedEmail = email.toLowerCase();
    const result = await dispatch(register({ name, surname, email: normalizedEmail, password }));
    if (register.fulfilled.match(result)) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className={styles['auth-modal__form']}>
      <div className={styles['auth-modal__title']}>Регистрация</div>
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
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameError}
            onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
            icon={<UserIcon />}
            theme="light"
          />
          {nameError && <div className={styles['auth-modal__field-error']}>Обязательное поле</div>}
        </div>
        <div>
          <Input
            placeholder="Фамилия"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            error={surnameError}
            onBlur={() => setTouched(prev => ({ ...prev, surname: true }))}
            icon={<UserIcon />}
            theme="light"
          />
          {surnameError && <div className={styles['auth-modal__field-error']}>Обязательное поле</div>}
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
        <div>
          <Input
            type="password"
            placeholder="Подтверждение пароля"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmError}
            onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
            icon={<KeyIcon />}
            theme="light"
          />
          {confirmError && <div className={styles['auth-modal__field-error']}>Пароли не совпадают</div>}
        </div>
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