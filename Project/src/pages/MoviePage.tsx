import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMovieById, clearCurrentMovie } from '../store/slices/moviesSlice';
import Container from '../components/UI/Container/Container';
import MovieHero from '../components/UI/MovieHero/MovieHero';
import MovieDetails from '../components/UI/MovieDetails/MovieDetails';
import TrailerModal from '../components/features/TrailerModal/TrailerModal';
import Loader from '../components/UI/Loader/Loader';
import ErrorMessage from '../components/UI/ErrorMessage/ErrorMessage';
import styles from './MoviePage.module.scss';

const MoviePage: React.FC = () => {
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

  const handleOpenTrailer = useCallback(() => setIsTrailerOpen(true), []);
  const handleCloseTrailer = useCallback(() => setIsTrailerOpen(false), []);

  if (loading.current) {
    return <Loader size={200} message="Загрузка фильма..." />;
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
    return <div className={styles.error}>Фильм не найден</div>;
  }

  return (
    <Container>
      <div className={styles['movie-page']}>
        <MovieHero
          movie={movie}
          variant="detail"
          onTrailerClick={handleOpenTrailer}
          className={styles.hero}
        />
        <MovieDetails movie={movie} />
      </div>
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={handleCloseTrailer}
        videoId={movie.trailerYouTubeId || ''}
        title={movie.title}
      />
    </Container>
  );
};

export default React.memo(MoviePage);