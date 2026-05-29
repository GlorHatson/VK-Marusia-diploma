import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMoviesByGenre, resetGenreMovies } from '../store/slices/genreMoviesSlice';
import Container from '../components/UI/Container/Container';
import Button from '../components/UI/Button/Button';
import styles from './GenreMoviesPage.module.scss';

const GenreMoviesPage = () => {
  const { genreName } = useParams<{ genreName: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movies, loading, hasMore, page, error } = useAppSelector((state) => state.genreMovies);

  useEffect(() => {
    if (!genreName) {
      navigate('/genres', { replace: true });
      return;
    }
    dispatch(resetGenreMovies());
    dispatch(fetchMoviesByGenre({ genre: genreName, page: 1 }));
    return () => {
      dispatch(resetGenreMovies());
    };
  }, [dispatch, genreName, navigate]);

const loadMore = useCallback(async () => {
  if (genreName && hasMore && !loading) {
    const currentScrollY = window.scrollY;
    await dispatch(fetchMoviesByGenre({ genre: genreName, page: page + 1 }));
    setTimeout(() => {
      window.scrollTo(0, currentScrollY);
    }, 50);
  }
}, [dispatch, genreName, hasMore, loading, page]);

  const handleCardClick = (id: number) => navigate(`/movie/${id}`);

  if (loading && page === 1) {
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
                <img
                  src={movie.posterUrl || '/images/no-poster.png'}
                  alt={movie.title}
                  className={styles['genre-movies__poster']}
                />
              </div>
              {/* Название фильма не отображается – только постер, как в макете */}
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