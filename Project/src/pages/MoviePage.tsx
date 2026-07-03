import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMovieById, clearCurrentMovie } from '../store/slices/moviesSlice';
import Container from '../components/UI/Container/Container';
import Button from '../components/UI/Button/Button';
import Rating from '../components/UI/Rating/Rating';
import FavoriteButton from '../components/UI/FavoriteButton/FavoriteButton';
import NoPoster from '../components/UI/NoPoster/NoPoster';
import TrailerModal from '../components/features/TrailerModal/TrailerModal';
import Loader from '../components/UI/Loader/Loader';
import ErrorMessage from '../components/UI/ErrorMessage/ErrorMessage';
import styles from './MoviePage.module.scss';

const formatCurrency = (value?: number | null): string => {
  if (!value) return '—';
  return new Intl.NumberFormat('ru-RU').format(value) + ' руб.';
};

const formatRuntime = (minutes?: number): string => {
  if (!minutes) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours} ч ` : ''}${mins} мин`;
};

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentMovie: movie, loading, error } = useAppSelector((state) => state.movies);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(Number(id)));
    }
    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [dispatch, id]);

  const handleOpenTrailer = () => setIsTrailerOpen(true);
  const handleCloseTrailer = () => setIsTrailerOpen(false);

  if (loading.current) {
    return <div className={styles['movie-page__loader']}><Loader size={200} message="Загрузка фильма..." /></div>;
  }

  if (error.current) {
    return (
      <ErrorMessage
        title="Ошибка загрузки"
        message="Не удалось загрузить данный фильм"
        onRetry={() => {
          if (id) dispatch(fetchMovieById(Number(id)));
        }}
      />
    );
  }

  if (!movie) {
    return <div className={styles['movie-page__error']}>Фильм не найден</div>;
  }

  const details = [
    { label: 'Язык оригинала', value: movie.language?.toUpperCase() },
    { label: 'Бюджет', value: formatCurrency(movie.budget) },
    { label: 'Выручка', value: formatCurrency(movie.revenue) },
    { label: 'Режиссёр', value: movie.director },
    { label: 'Продакшен', value: movie.production },
    { label: 'Награды', value: movie.awardsSummary },
  ].filter((detail) => detail.value);

  return (
    <Container>
      <div className={styles['movie-page']}>
        <div className={styles['movie-page__header']}>
          <div className={styles['movie-page__info']}>
            <div className={styles['movie-page__meta']}>
              <Rating value={movie.tmdbRating} />
              <span className={styles['movie-page__year']}>{movie.releaseYear ?? '—'}</span>
              <span className={styles['movie-page__genre']}>{movie.genres?.[0] ?? '—'}</span>
              <span className={styles['movie-page__duration']}>{formatRuntime(movie.runtime)}</span>
            </div>
            <h1 className={styles['movie-page__title']}>{movie.title}</h1>
            <p className={styles['movie-page__plot']}>{movie.plot ?? ''}</p>
            <div className={styles['movie-page__actions']}>
              <Button variant="primary" onClick={handleOpenTrailer} className={styles['movie-page__trailer-btn']}>Трейлер</Button>
              <FavoriteButton movieId={movie.id} />
            </div>
          </div>
          <div className={styles['movie-page__poster-wrapper']}>
            {movie.backdropUrl ? (
              <img
                src={movie.backdropUrl}
                alt={movie.title}
                className={styles['movie-page__poster']}
              />
            ) : (
              movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className={styles['movie-page__poster']}
                />
              ) : (
                <NoPoster title={movie.title} />
              )
            )}
          </div>
        </div>

        {details.length > 0 && (
          <div className={styles['movie-page__details']}>
            <h2 className={styles['movie-page__details-title']}>О фильме</h2>
            <div className={styles['movie-page__details-grid']}>
              {details.map((detail, idx) => (
                <React.Fragment key={idx}>
                  <div className={styles['movie-page__detail-left']}>
                    <span className={styles['movie-page__detail-label']}>{detail.label}</span>
                    <span className={styles['movie-page__detail-dots']}></span>
                  </div>
                  <div className={styles['movie-page__detail-value']}>
                    {detail.value}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={handleCloseTrailer}
        videoId={movie?.trailerYouTubeId || ''}
        title={movie?.title || ''}
      />
    </Container>
  );
};

export default MoviePage;