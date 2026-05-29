import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTop10, fetchRandomMovie } from '../store/slices/moviesSlice';
import Container from '../components/UI/Container/Container';
import Button from '../components/UI/Button/Button';
import Rating from '../components/UI/Rating/Rating';
import FavoriteButton from '../components/UI/FavoriteButton/FavoriteButton';
import RefreshButton from '../components/UI/RefreshButton/RefreshButton';
import TrailerModal from '../components/features/TrailerModal/TrailerModal';
import styles from './MainPage.module.scss';

const formatRuntime = (minutes?: number): string => {
  if (!minutes) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours} ч ` : ''}${mins} мин`;
};

const MainPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { top10, randomMovie, loading, error } = useAppSelector((state) => state.movies);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTop10());
    dispatch(fetchRandomMovie());
  }, [dispatch]);

  const handleRefreshRandom = () => dispatch(fetchRandomMovie());
  const handleOpenTrailer = () => setIsTrailerOpen(true);
  const handleCloseTrailer = () => setIsTrailerOpen(false);
  const handleMoreClick = () => randomMovie && navigate(`/movie/${randomMovie.id}`);
  const handleCardClick = (id: number) => navigate(`/movie/${id}`);


  if (loading.top10 || loading.random) {
    return <div className={styles['main-page__loader']}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles['main-page__error']}>Ошибка: {error}</div>;
  }

  return (
    <Container>
      {randomMovie && (
        <section className={styles['main-page__random']}>
          <div className={styles['main-page__random-content']}>
            <div className={styles['main-page__random-info']}>
              <div className={styles['main-page__random-meta']}>
                <Rating value={randomMovie.tmdbRating} />
                <span className={styles['main-page__random-year']}>{randomMovie.releaseYear ?? '—'}</span>
                <span className={styles['main-page__random-genre']}>{randomMovie.genres?.[0] ?? '—'}</span>
                <span className={styles['main-page__random-duration']}>{formatRuntime(randomMovie.runtime)}</span>
              </div>
              <h1 className={styles['main-page__random-title']}>{randomMovie.title}</h1>
              <p className={styles['main-page__random-description']}>{randomMovie.plot ?? ''}</p>
              <div className={styles['main-page__random-actions']}>
                <Button variant="primary" onClick={handleOpenTrailer}>Трейлер</Button>
                <Button variant="primary" onClick={handleMoreClick}>О фильме</Button>
                <FavoriteButton isFavorite={false} />
                <RefreshButton onClick={handleRefreshRandom} />
              </div>
            </div>
            <div className={styles['main-page__random-poster-wrapper']}>
              <img
                src={randomMovie.posterUrl || '/images/no-poster.png'}
                alt={randomMovie.title}
                className={styles['main-page__random-poster']}
              />
            </div>
          </div>
        </section>
      )}

      <section className={styles['main-page__top']}>
        <h2 className={styles['main-page__top-title']}>Топ 10 фильмов</h2>
        <div className={styles['main-page__top-grid']}>
          {top10.map((movie, index) => (
            <div
              key={movie.id}
              className={styles['main-page__top-card']}
              onClick={() => handleCardClick(movie.id)}
            >
              <div className={styles['main-page__top-rank']}>{index + 1}</div>
              <div className={styles['main-page__top-poster-container']}>
                <img
                  src={movie.posterUrl || '/images/no-poster.png'}
                  alt={movie.title}
                  className={styles['main-page__top-poster']}
                />
              </div>
            </div>
          ))}
        </div>
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

export default MainPage;