import React, { useState } from 'react';
import styles from './AuthModal.module.scss';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import SuccessModal from './SuccessModal';
import Button from '../../../components/UI/Button/Button';
import MarusiaLogo from '../../../assets/images/marusia-logo.svg?react';
import CloseIcon from '../../../assets/images/icon-close.svg?react';

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
        <Button
          variant="light"
          isRound
          icon={<CloseIcon />}
          onClick={onClose}
          className={styles['auth-modal__close']}
          aria-label="Закрыть"
        />
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