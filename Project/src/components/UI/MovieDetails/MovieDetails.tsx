import React from 'react';
import type { Movie } from '../../../store/slices/moviesSlice';
import { formatCurrency } from '../../../utils/format';
import styles from './MovieDetails.module.scss';

interface MovieDetailsProps {
  movie: Movie;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const details = [
    { label: 'Язык оригинала', value: movie.language?.toUpperCase() },
    { label: 'Бюджет', value: formatCurrency(movie.budget) },
    { label: 'Выручка', value: formatCurrency(movie.revenue) },
    { label: 'Режиссёр', value: movie.director },
    { label: 'Продакшен', value: movie.production },
    { label: 'Награды', value: movie.awardsSummary },
  ].filter((detail) => detail.value);

  if (details.length === 0) return null;

  return (
    <div className={styles['movie-page__details']}>
      <h2 className={styles['movie-page__details-title']}>О фильме</h2>
      <div className={styles['movie-page__details-grid']}>
        {details.map((detail, idx) => (
          <React.Fragment key={idx}>
            <div className={styles['movie-page__detail-left']}>
              <span className={styles['movie-page__detail-label']}>{detail.label}</span>
              <span className={styles['movie-page__detail-dots']}></span>
            </div>
            <div className={styles['movie-page__detail-value']}>{detail.value}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;