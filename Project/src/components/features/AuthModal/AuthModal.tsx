import React, { useState } from 'react';
import styles from './AuthModal.module.scss';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import SuccessModal from './SuccessModal';
import MarusiaLogo from '../../../assets/images/marusia-logo.svg?react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'login' | 'register' | 'success';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<Mode>('login');

  const handleRegisterSuccess = () => {
    setMode('success');
  };

  const handleLoginSuccess = () => {
    onClose();
    setMode('login');
  };

  const handleBackToLogin = () => {
    setMode('login');
  };

  if (!isOpen) return null;

  return (
    <div className={styles['auth-modal__overlay']} onClick={onClose}>
      <div className={styles['auth-modal__container']} onClick={(e) => e.stopPropagation()}>
        <button className={styles['auth-modal__close']} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Логотип – общий для всех режимов */}
        <div className={styles['auth-modal__logo']}>
          <MarusiaLogo className={styles['auth-modal__logo-image']} />
        </div>

        {mode === 'login' && (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setMode('register')}
          />
        )}
        {mode === 'register' && (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={handleBackToLogin}
          />
        )}
        {mode === 'success' && (
          <SuccessModal onLoginClick={handleBackToLogin} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;