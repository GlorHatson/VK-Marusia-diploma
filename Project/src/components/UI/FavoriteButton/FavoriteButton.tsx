import { useState } from 'react';
import styles from './FavoriteButton.module.scss';

interface FavoriteButtonProps {
  isFavorite?: boolean;
  onToggle?: () => void;
  className?: string;
  disabled?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite = false, onToggle, className = '', disabled = false }) => {
  const [favorited, setFavorited] = useState(isFavorite);

  const handleClick = () => {
    if (disabled) return;
    const newState = !favorited;
    setFavorited(newState);
    if (onToggle) onToggle();
  };

  return (
    <button
      className={`button-base ${styles['favorite-button']} ${favorited ? styles['favorite-button--active'] : ''} ${className}`}
      onClick={handleClick}
      aria-label={favorited ? 'Удалить из избранного' : 'Добавить в избранное'}
      disabled={disabled}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles['favorite-button__icon']}
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton;