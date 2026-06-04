import React from 'react';
import styles from './AuthModal.module.scss';

interface SuccessModalProps {
  onLoginClick: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onLoginClick }) => {
  return (
    <div className={styles['auth-modal__form']}>
      <div className={styles['auth-modal__title']}>Регистрация завершена</div>
      <p className={styles['auth-modal__message']}>
        Используйте вашу электронную почту для входа
      </p>
      <button className={styles['auth-modal__button']} onClick={onLoginClick}>
        Войти
      </button>
    </div>
  );
};

export default SuccessModal;