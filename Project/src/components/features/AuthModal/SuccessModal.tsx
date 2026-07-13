import React from 'react';
import styles from './AuthModal.module.scss';
import Button from '../../../components/UI/Button/Button';

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
      <Button variant="primary" className={styles['auth-modal__button']} onClick={onLoginClick}>
        Войти
      </Button>
    </div>
  );
};

export default SuccessModal;