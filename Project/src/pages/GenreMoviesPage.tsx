import { useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMoviesByGenre, resetGenreMovies } from '../store/slices/genreMoviesSlice';
import Container from '../components/UI/Container/Container';
import Button from '../components/UI/Button/Button';
import NoPoster from '../components/UI/NoPoster/NoPoster';
import styles from './GenreMoviesPage.module.scss';

const GenreMoviesPage = () => {
  const { genreName } = useParams<{ genreName: string }>();
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
    // Загружаем только если номер страницы в URL отличается от текущего в сторе
    // и нет активной загрузки (чтобы не дублировать)
    if (currentPage !== pageFromUrl && !loading) {
      dispatch(fetchMoviesByGenre({ genre: genreName, page: pageFromUrl }));
    } else if (movies.length === 0 && !loading) {
      // Если фильмов нет, загружаем первую страницу
      dispatch(fetchMoviesByGenre({ genre: genreName, page: pageFromUrl }));
    }
  }, [genreName, pageFromUrl, currentPage, loading, movies.length, dispatch, navigate]);

  // Загрузка следующей страницы (просто меняем URL, эффект выше сработает)
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

  // Сброс состояния при размонтировании (чтобы при переходе на другой жанр не было старых фильмов)
  useEffect(() => {
    return () => {
      dispatch(resetGenreMovies());
    };
  }, [dispatch]);

  if (loading && movies.length === 0) {
    return <div className={styles['genre-movies__loader']}>Загрузка...</div>;
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
          <button className={styles['genre-movies__back']} onClick={() => navigate(-1)}>
            <svg width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.714 10.6066L12.9637 18.8561L10.6067 21.2131L0 10.6066L10.6067 0L12.9637 2.35702L4.714 10.6066Z" fill="currentColor" />
            </svg>
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
      </div>
    </Container>
  );
};

export default GenreMoviesPage;