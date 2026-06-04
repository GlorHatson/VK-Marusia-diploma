import React from 'react';
import type { Movie } from '../../../store/slices/moviesSlice';
import Rating from '../Rating/Rating';
import styles from './SearchDropdownItem.module.scss';

interface SearchDropdownItemProps {
  movie: Movie;
  onClick: () => void;
}

const formatRuntime = (minutes?: number): string => {
  if (!minutes) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours} ч ` : ''}${mins} мин`;
};

const SearchDropdownItem: React.FC<SearchDropdownItemProps> = ({ movie, onClick }) => {
  return (
    <div className={styles['search-item']} onClick={onClick}>
      <div className={styles['search-item__poster']}>
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} />
        ) : (
          <div className={styles['search-item__no-poster']}>Нет постера</div>
        )}
      </div>
      <div className={styles['search-item__info']}>
        <div className={styles['search-item__details']}>
          <Rating value={movie.tmdbRating} showStar className={styles['rating--compact']}/>
          <span className={styles['search-item__year']}>{movie.releaseYear || '—'}</span>
          <span className={styles['search-item__genre']}>{movie.genres?.[0] || '—'}</span>
          <span className={styles['search-item__duration']}>{formatRuntime(movie.runtime)}</span>
        </div>
        <div className={styles['search-item__title']}>{movie.title}</div>
      </div>
    </div>
  );
};

export default SearchDropdownItem;