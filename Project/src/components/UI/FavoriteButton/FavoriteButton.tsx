import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addToFavorites, removeFromFavorites } from '../../../store/slices/favoritesSlice';
import { setAuthModalOpen } from '../../../store/slices/uiSlice';
import HeartIcon from '../../../assets/images/icon-favorit.svg?react';
import styles from './FavoriteButton.module.scss';

interface FavoriteButtonProps {
  movieId: number;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId, className = '' }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const { items, loading } = useAppSelector((state) => state.favorites);
  const isFavorite = items.some((fav) => fav.id === movieId);

  const handleClick = async () => {
    if (!isAuthenticated) {
      dispatch(setAuthModalOpen(true));
      return;
    }
    if (loading) return;
    if (isFavorite) {
      await dispatch(removeFromFavorites(movieId));
    } else {
      await dispatch(addToFavorites(movieId));
    }
  };

  return (
    <button
      className={`button-base ${styles['favorite-button']} ${isFavorite ? styles['favorite-button--active'] : ''} ${className}`}
      onClick={handleClick}
      aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      disabled={loading}
    >
      <HeartIcon className={styles['favorite-button__icon']} />
    </button>
  );
};

export default FavoriteButton;