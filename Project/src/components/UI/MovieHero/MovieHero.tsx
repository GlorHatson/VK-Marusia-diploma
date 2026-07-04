import React from 'react';
import type { Movie } from '../../../store/slices/moviesSlice';
import Rating from '../Rating/Rating';
import Button from '../Button/Button';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import RefreshButton from '../RefreshButton/RefreshButton';
import NoPoster from '../NoPoster/NoPoster';
import { formatRuntime } from '../../../utils/format';
import styles from './MovieHero.module.scss';

interface MovieHeroProps {
  movie: Movie;
  variant: 'random' | 'detail';
  onTrailerClick: () => void;
  onMoreClick?: () => void;
  onRefresh?: () => void;
  className?: string;
}

const MovieHero: React.FC<MovieHeroProps> = ({
  movie,
  variant,
  onTrailerClick,
  onMoreClick,
  onRefresh,
  className = '',
}) => {
  const isRandom = variant === 'random';

  return (
    <section className={`${styles['main-page__random']} ${className}`}>
      <div className={styles['main-page__random-content']}>
        <div className={styles['main-page__random-info']}>
          <div className={styles['main-page__random-meta']}>
            <Rating value={movie.tmdbRating} />
            <span className={styles['main-page__random-year']}>{movie.releaseYear ?? '—'}</span>
            <span className={styles['main-page__random-genre']}>{movie.genres?.[0] ?? '—'}</span>
            <span className={styles['main-page__random-duration']}>{formatRuntime(movie.runtime)}</span>
          </div>
          <h1 className={styles['main-page__random-title']}>{movie.title}</h1>
          <p className={`${styles['main-page__random-description']} ${variant === 'detail' ? styles['main-page__random-description--detail'] : ''}`}>
            {movie.plot ?? ''}
          </p>
          <div className={`${styles['main-page__random-actions']} ${isRandom ? styles['main-page__random-actions--random'] : styles['main-page__random-actions--detail']}`}>
            <div className={styles['main-page__actions-primary']}>
              <Button variant="primary" onClick={onTrailerClick} className={styles['main-page__trailer-btn']}>
                Трейлер
              </Button>
            </div>
            <div className={styles['main-page__actions-secondary']}>
              {isRandom && onMoreClick && (
                <Button variant="secondary" onClick={onMoreClick} className={styles['main-page__btn-secondary']}>
                  О фильме
                </Button>
              )}
              <FavoriteButton movieId={movie.id} />
              {isRandom && onRefresh && <RefreshButton onClick={onRefresh} />}
            </div>
          </div>
        </div>
        <div className={`${styles['main-page__random-poster-wrapper']} ${variant === 'detail' ? styles['main-page__random-poster-wrapper--detail'] : ''}`}>
          {movie.backdropUrl ? (
            <img src={movie.backdropUrl} alt={movie.title} className={styles['main-page__random-poster']} />
          ) : movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className={styles['main-page__random-poster']} />
          ) : (
            <NoPoster title={movie.title} />
          )}
        </div>
      </div>
    </section>
  );
};

export default MovieHero;