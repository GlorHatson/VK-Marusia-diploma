import React from 'react';
import type { Movie } from '../../../store/slices/moviesSlice';
import NoPoster from '../NoPoster/NoPoster';
import styles from './MovieCard.module.scss';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  rank?: number;
  showRemove?: boolean;
  onRemove?: (e: React.MouseEvent) => void;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onClick,
  rank,
  showRemove = false,
  onRemove,
  className = '',
}) => {
  return (
    <div
      className={`${styles['movie-card']} ${className}`}
      onClick={onClick}
    >
      {rank && <div className={styles['movie-card__rank']}>{rank}</div>}
      {showRemove && onRemove && (
        <button
          className={styles['movie-card__remove']}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          aria-label="Удалить из избранного"
        >
          ✕
        </button>
      )}
      <div className={styles['movie-card__poster-container']}>
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} className={styles['movie-card__poster']} />
        ) : (
          <NoPoster title={movie.title} variant="compact" />
        )}
      </div>
    </div>
  );
};

export default MovieCard;