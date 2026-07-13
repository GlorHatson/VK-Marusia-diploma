import React, { useMemo } from 'react';
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
  const formattedRuntime = useMemo(() => formatRuntime(movie.runtime), [movie.runtime]);

  return (
    <section className={`${styles['main-page__random']} ${className}`}>
      <div className={styles['main-page__random-content']}>
        <div className={styles['main-page__random-info']}>
          <div className={styles['main-page__random-meta']}>
            <Rating value={movie.tmdbRating} />
            <span className={styles['main-page__random-year']}>{movie.releaseYear ?? '—'}</span>
            <span className={styles['main-page__random-genre']}>{movie.genres?.[0] ?? '—'}</span>
            <span className={styles['main-page__random-duration']}>{formattedRuntime}</span>
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
              {/* Передаём и id, и объект фильма */}
              <FavoriteButton movieId={movie.id} movie={movie} />
              {isRandom && onRefresh && <RefreshButton onClick={onRefresh} />}
            </div>
          </div>
        </div>
        <div className={`${styles['main-page__random-poster-wrapper']} ${variant === 'detail' ? styles['main-page__random-poster-wrapper--detail'] : ''}`}>
          {movie.backdropUrl ? (
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className={styles['main-page__random-poster']}
              width={680}
              height={552}
              fetchPriority="high"
              loading="eager"
            />
          ) : movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className={styles['main-page__random-poster']}
              width={680}
              height={552}
              fetchPriority="high"
              loading="eager"
            />
          ) : (
            <NoPoster title={movie.title} />
          )}
        </div>
      </div>
    </section>
  );
};

export default MovieHero;