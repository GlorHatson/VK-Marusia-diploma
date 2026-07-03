import React from 'react';
import styles from './ErrorMessage.module.scss';
import errorImage from '../../../assets/images/marusia_error.webp';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Упс... Что-то пошло не так',
  message = 'Не удалось загрузить данные. Попробуйте позже.',
  onRetry,
  retryText = 'Попробовать снова',
}) => {
  return (
    <div className={styles.errorContainer}>
      <img src={errorImage} alt="Ошибка" className={styles.errorImage} />
      <h2 className={styles.errorTitle}>{title}</h2>
      <p className={styles.errorMessage}>{message}</p>
      {onRetry && (
        <button className={styles.errorButton} onClick={onRetry}>
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;