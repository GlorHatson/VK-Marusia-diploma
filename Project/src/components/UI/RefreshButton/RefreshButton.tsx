import styles from './RefreshButton.module.scss';
import RefreshIcon from '../../../assets/images/icon-refresh.svg?react';

interface RefreshButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick, className = '', disabled = false }) => {
  return (
    <button
      className={`button-base ${styles['refresh-button']} ${className}`}
      onClick={onClick}
      aria-label="Обновить фильм"
      disabled={disabled}
    >
      <RefreshIcon className={styles['refresh-button__icon']}/>
    </button>
  );
};

export default RefreshButton;