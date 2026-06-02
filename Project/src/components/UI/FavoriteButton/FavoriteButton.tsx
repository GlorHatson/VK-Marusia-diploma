import { useState } from 'react';
import styles from './FavoriteButton.module.scss';
import HeartIcon from '../../../assets/images/icon-favorit.svg?react';

interface FavoriteButtonProps {
  isFavorite?: boolean;
  onToggle?: () => void;
  className?: string;
  disabled?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite = false,
  onToggle,
  className = '',
  disabled = false,
}) => {
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
      <HeartIcon className={styles['favorite-button__icon']} />
    </button>
  );
};

export default FavoriteButton;