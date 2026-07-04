import React from 'react';
import type { Movie } from '../../../store/slices/moviesSlice';
import NoPoster from '../NoPoster/NoPoster';
import Rating from '../Rating/Rating';
import ratingStyles from '../Rating/Rating.module.scss';
import styles from './MobileSearchCard.module.scss';

const formatRuntime = (minutes?: number): string => {
  if (!minutes) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours} ч ` : ''}${mins} мин`;
};

interface MobileSearchCardProps {
  movie: Movie;
  onClick: () => void;
}

const MobileSearchCard: React.FC<MobileSearchCardProps> = ({ movie, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.poster}>
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} />
        ) : (
          <NoPoster title={movie.title} variant="compact" />
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.meta}>
          <Rating value={movie.tmdbRating} showStar className={ratingStyles['rating--compact']} />
          <span className={styles.year}>{movie.releaseYear || '—'}</span>
          <span className={styles.genre}>{movie.genres?.[0] || '—'}</span>
          <span className={styles.duration}>{formatRuntime(movie.runtime)}</span>
        </div>
        <div className={styles.title}>{movie.title}</div>
      </div>
    </div>
  );
};

export default MobileSearchCard;