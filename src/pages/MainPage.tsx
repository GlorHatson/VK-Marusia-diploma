import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTop10, fetchRandomMovie } from '../store/slices/moviesSlice';
import Container from '../components/UI/Container/Container';
import MovieHero from '../components/UI/MovieHero/MovieHero';
import MovieGrid from '../components/UI/MovieGrid/MovieGrid';
import MovieCard from '../components/UI/MovieCard/MovieCard';
import TrailerModal from '../components/features/TrailerModal/TrailerModal';
import Loader from '../components/UI/Loader/Loader';
import ErrorMessage from '../components/UI/ErrorMessage/ErrorMessage';
import styles from './MainPage.module.scss';

const MainPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { top10, randomMovie, loading, error } = useAppSelector((state) => state.movies);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTop10());
    dispatch(fetchRandomMovie());
  }, [dispatch]);

  const handleRefreshRandom = useCallback(() => dispatch(fetchRandomMovie()), [dispatch]);
  const handleOpenTrailer = useCallback(() => setIsTrailerOpen(true), []);
  const handleCloseTrailer = useCallback(() => setIsTrailerOpen(false), []);
  const handleMoreClick = useCallback(() => {
    if (randomMovie) navigate(`/movie/${randomMovie.id}`);
  }, [randomMovie, navigate]);
  const handleCardClick = useCallback((id: number) => navigate(`/movie/${id}`), [navigate]);

  if (loading.top10 || loading.random) {
    return <Loader size={200} message="Загрузка страницы..." />;
  }

  if (error.top10 || error.random) {
    let title = 'Ошибка загрузки';
    let message = '';
    if (error.top10) message += 'Не удалось загрузить топ-10. ';
    if (error.random) message += 'Не удалось загрузить случайный фильм. ';
    return (
      <ErrorMessage
        title={title}
        message={message}
        onRetry={() => {
          dispatch(fetchTop10());
          dispatch(fetchRandomMovie());
        }}
      />
    );
  }

  return (
    <Container>
      {randomMovie && (
        <MovieHero
          movie={randomMovie}
          variant="random"
          onTrailerClick={handleOpenTrailer}
          onMoreClick={handleMoreClick}
          onRefresh={handleRefreshRandom}
        />
      )}

      <section className={styles['main-page__top']}>
        <h2 className={styles['main-page__top-title']}>Топ 10 фильмов</h2>
        <MovieGrid scrollOnMobile={true}>
          {top10.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} rank={index + 1} onClick={() => handleCardClick(movie.id)} />
          ))}
        </MovieGrid>
      </section>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={handleCloseTrailer}
        videoId={randomMovie?.trailerYouTubeId || ''}
        title={randomMovie?.title || ''}
      />
    </Container>
  );
};

export default React.memo(MainPage);