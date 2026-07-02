import { useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMoviesByGenre, resetGenreMovies } from '../store/slices/genreMoviesSlice';
import Container from '../components/UI/Container/Container';
import Button from '../components/UI/Button/Button';
import NoPoster from '../components/UI/NoPoster/NoPoster';
import UpIcon from '../assets/images/icon-up.svg?react';
import LeftIcon from '../assets/images/icon-left.svg?react';
import Loader from '../components/UI/Loader/Loader';
import styles from './GenreMoviesPage.module.scss';

const GenreMoviesPage = () => {
  const { genreName } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get('page')) || 1;

  const dispatch = useAppDispatch();
  const { movies, loading, hasMore, page: currentPage, error } = useAppSelector((state) => state.genreMovies);

  // Загружаем данные при изменении жанра или номера страницы в URL
  useEffect(() => {
    if (!genreName) {
      navigate('/genres', { replace: true });
      return;
    }
    if (currentPage !== pageFromUrl && !loading) {
      dispatch(fetchMoviesByGenre({ genre: genreName, page: pageFromUrl }));
    } else if (movies.length === 0 && !loading) {
      dispatch(fetchMoviesByGenre({ genre: genreName, page: pageFromUrl }));
    }
  }, [genreName, pageFromUrl, currentPage, loading, movies.length, dispatch, navigate]);

  // Загрузка следующей страницы
  const loadMore = useCallback(() => {
    if (genreName && hasMore && !loading) {
      const nextPage = currentPage + 1;
      setSearchParams({ page: nextPage.toString() });
    }
  }, [genreName, hasMore, loading, currentPage, setSearchParams]);

  // Сохранение скролла перед переходом на страницу фильма
  const saveScrollPosition = useCallback(() => {
    if (genreName) {
      sessionStorage.setItem(`scroll_${genreName}_${currentPage}`, window.scrollY.toString());
    }
  }, [genreName, currentPage]);

  const handleCardClick = (id: number) => {
    saveScrollPosition();
    navigate(`/movie/${id}`);
  };

  // Восстановление скролла после загрузки данных
  useEffect(() => {
    if (!loading && movies.length > 0 && genreName) {
      const savedScroll = sessionStorage.getItem(`scroll_${genreName}_${currentPage}`);
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll, 10));
        sessionStorage.removeItem(`scroll_${genreName}_${currentPage}`);
      }
    }
  }, [loading, movies.length, genreName, currentPage]);


  // --- ФУНКЦИЯ СБРОСА НА ПЕРВУЮ СТРАНИЦУ ---
  const resetToFirstPage = async () => {
    if (pageFromUrl === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (genreName) {
      await dispatch(fetchMoviesByGenre({ genre: genreName, page: 1 }));
      setSearchParams({}, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  // ---------------------------------------------

  // Сброс состояния при размонтировании
  useEffect(() => {
    return () => {
      dispatch(resetGenreMovies());
    };
  }, [dispatch]);

  if (loading && movies.length === 0) {
    return <div className={styles['genre-movies__loader']}><Loader size={200} message="Загрузка фильмов..." /></div>;
  }

  if (error) {
    return <div className={styles['genre-movies__error']}>Ошибка: {error}</div>;
  }

  const displayGenreName = genreName
    ? genreName.charAt(0).toUpperCase() + genreName.slice(1)
    : 'Жанр';

  return (
    <Container>
      <div className={styles['genre-movies']}>
        <div className={styles['genre-movies__header']}>
          <button className={styles['genre-movies__back']} onClick={() => navigate('/genres')}>
            <LeftIcon />
          </button>
          <h1 className={styles['genre-movies__title']}>{displayGenreName}</h1>
        </div>

          <div className={styles['genre-movies__grid']}>
            {movies.map((movie) => (
              <div
                key={movie.id}
                className={styles['genre-movies__card']}
                onClick={() => handleCardClick(movie.id)}
              >
                <div className={styles['genre-movies__poster-container']}>
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className={styles['genre-movies__poster']}
                    />
                  ) : (
                    <NoPoster title={movie.title} variant="compact" />
                  )}
                </div>
              </div>
            ))}
          </div>

        {hasMore && (
          <div className={styles['genre-movies__load-more']}>
            <Button variant="primary" onClick={loadMore} disabled={loading}>
              {loading ? 'Загрузка...' : 'Показать ещё'}
            </Button>
          </div>
        )}
        {pageFromUrl > 1 && (
          <button
            className={styles['scroll-to-top']}
            onClick={resetToFirstPage}
            aria-label="На первую страницу"
          >
            <UpIcon className={styles['scroll-to-top__icon']} />
          </button>
        )}
      </div>
    </Container>
  );
};

export default GenreMoviesPage;