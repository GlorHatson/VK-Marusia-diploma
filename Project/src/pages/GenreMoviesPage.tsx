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
    if (genreName) {
      dispatch(resetGenreMovies());
      dispatch(fetchMoviesByGenre({ genre: genreName, page: 1 }));
    }
    return () => {
      dispatch(resetGenreMovies());
    };
  }, [dispatch, genreName]);

  const loadMore = useCallback(() => {
    if (genreName && hasMore && !loading) {
      dispatch(fetchMoviesByGenre({ genre: genreName, page: page + 1 }));
    }
  }, [dispatch, genreName, hasMore, loading, page]);

  const handleCardClick = (id: number) => navigate(`/movie/${id}`);

  if (loading && page === 1) {
    return <div className={styles['genre-movies__loader']}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles['genre-movies__error']}>Ошибка: {error}</div>;
  }

  return (
    <Container>
      <div className={styles['genre-movies']}>
        <div className={styles['genre-movies__header']}>
          <button className={styles['genre-movies__back']} onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 className={styles['genre-movies__title']}>{genreName}</h1>
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