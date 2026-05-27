import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTop10, fetchRandomMovie } from '../store/slices/moviesSlice';
import Container from '../components/UI/Container/Container';
import styles from './MainPage.module.scss';

const formatRuntime = (minutes?: number): string => {
  if (!minutes) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours} ч ` : ''}${mins} мин`;
};

const MainPage = () => {
  const dispatch = useAppDispatch();
  const { top10, randomMovie, loading, error } = useAppSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchTop10());
    dispatch(fetchRandomMovie());
  }, [dispatch]);

  const handleRefreshRandom = () => {
    dispatch(fetchRandomMovie());
  };

  if (loading.top10 || loading.random) {
    return <div className={styles['main-page__loader']}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles['main-page__error']}>Ошибка: {error}</div>;
  }

  return (
    <Container>
      {randomMovie && (
        <section className={styles['main-page__wallpaper']}>
          <div className={styles['main-page__wallpaper-content']}>
            <div className={styles['main-page__film-info']}>
              <div className={styles['main-page__meta-row']}>
                <div className={styles['main-page__rating']}>
                  <span className={styles['main-page__star-icon']}>★</span>
                  <span>{randomMovie.tmdbRating?.toFixed(1) ?? '—'}</span>
                </div>
                <span className={styles['main-page__year']}>{randomMovie.releaseYear ?? '—'}</span>
                <span className={styles['main-page__genre']}>{randomMovie.genres?.[0] ?? '—'}</span>
                <span className={styles['main-page__duration']}>{formatRuntime(randomMovie.runtime)}</span>
              </div>
              <h1 className={styles['main-page__title']}>{randomMovie.title}</h1>
              <p className={styles['main-page__description']}>{randomMovie.plot ?? ''}</p>
              <div className={styles['main-page__button-group']}>
                <button className={styles['main-page__button--primary']}>Трейлер</button>
                <button className={styles['main-page__button--secondary']}>О фильме</button>
                <button className={styles['main-page__icon-button']} aria-label="В избранное">
                  <img src="/images/icon-favorit.svg" alt="В избранное" />
                </button>
                <button className={styles['main-page__icon-button']} aria-label="Обновить фильм" onClick={handleRefreshRandom}>
                  <img src="/images/icon-refresh.svg" alt="Обновить" />
                </button>
              </div>
            </div>
            <div className={styles['main-page__poster-wrapper']}>
              <img src={randomMovie.posterUrl || '/images/no-poster.png'} alt={randomMovie.title} className={styles['main-page__poster']} />
            </div>
          </div>
        </section>
      )}

      <section className={styles['main-page__top-section']}>
        <h2 className={styles['main-page__top-title']}>Топ 10 фильмов</h2>
        <div className={styles['main-page__top-grid']}>
          {top10.map((movie, index) => (
            <div key={movie.id} className={styles['main-page__top-card']}>
              <div className={styles['main-page__top-rank']}>{index + 1}</div>
              <div className={styles['main-page__top-poster-container']}>
                <img src={movie.posterUrl ||'/images/no-poster.png'} alt={movie.title} className={styles['main-page__top-poster']} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default MainPage;