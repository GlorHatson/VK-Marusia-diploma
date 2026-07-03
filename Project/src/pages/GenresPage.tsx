import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchGenres } from '../store/slices/genresSlice';
import { apiClient } from '../services/axiosInstance';
import Container from '../components/UI/Container/Container';
import Loader from '../components/UI/Loader/Loader';
import ErrorMessage from '../components/UI/ErrorMessage/ErrorMessage';
import styles from './GenresPage.module.scss';

interface GenrePosters {
  name: string;
  posters: string[];
}

const CACHE_KEY = 'genres_posters_cache';
const CACHE_EXPIRY_DAYS = 7;

const saveToCache = (data: GenrePosters[]) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
};

const loadFromCache = (): GenrePosters[] | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  try {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
      return data;
    }
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
};

const GenresPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: genres, loading: genresLoading, error: genresError } = useAppSelector((state) => state.genres);
  const [genrePosters, setGenrePosters] = useState<GenrePosters[]>([]);
  const [loadingPosters, setLoadingPosters] = useState(false);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  useEffect(() => {
    if (genres.length === 0) return;

    const cached = loadFromCache();
    if (cached && cached.length === genres.length) {
      setGenrePosters(cached);
      return;
    }

    const fetchFourPostersForGenre = async (genreName: string): Promise<string[]> => {
      try {
        const response = await apiClient.get('/movie', {
          params: { genre: genreName, count: 4 },
        });
        const movies = response.data;
        if (movies && movies.length) {
          return movies.map((m: any) => m.posterUrl).filter(Boolean);
        }
        return [];
      } catch (err) {
        return [];
      }
    };

    const loadAllPosters = async () => {
      setLoadingPosters(true);
      const results = await Promise.all(
        genres.map(async (genre) => ({
          name: genre.name,
          posters: await fetchFourPostersForGenre(genre.name),
        }))
      );
      setGenrePosters(results);
      saveToCache(results);
      setLoadingPosters(false);
    };

    loadAllPosters();
  }, [genres]);

  const handleGenreClick = (genreName: string) => {
    navigate(`/genres/${encodeURIComponent(genreName)}`);
  };

  const getPostersForGenre = (genreName: string): string[] => {
    const found = genrePosters.find(g => g.name === genreName);
    return found?.posters || [];
  };

  if (genresLoading || loadingPosters) {
    return <div className={styles['genres-page__loader']}><Loader size={200} message="Загрузка жанров..." /></div>;
  }

  if (genresError) {
    return (
      <ErrorMessage
        title="Ошибка загрузки жанров"
        message={genresError}
        onRetry={() => dispatch(fetchGenres())}
      />
    );
  }

  return (
    <Container>
      <div className={styles['genres-page']}>
        <h1 className={styles['genres-page__title']}>Жанры фильмов</h1>
        <div className={styles['genres-page__grid']}>
          {genres.map((genre) => {
            const posters = getPostersForGenre(genre.name);
            return (
              <div
                key={genre.name}
                className={styles['genres-page__card']}
                onClick={() => handleGenreClick(genre.name)}
              >
                <div className={styles['genres-page__card-grid']}>
                  {posters.slice(0, 4).map((poster, idx) => (
                    <img
                      key={idx}
                      src={poster}
                      alt=""
                      className={styles['genres-page__card-image']}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/no-poster.png';
                      }}
                    />
                  ))}
                  {Array.from({ length: 4 - posters.length }).map((_, idx) => (
                    <div key={idx} className={styles['genres-page__card-placeholder']} />
                  ))}
                </div>
                <h3 className={styles['genres-page__card-title']}>
                  {genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default GenresPage;