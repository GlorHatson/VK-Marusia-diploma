import styles from './MainPage.module.scss';
import Container from '../components/UI/Container/Container';

// Моковые данные (заглушки, позже заменим на API)
const mockRandomMovie = {
  id: 1,
  title: 'Шерлок Холмс и доктор Ватсон: Знакомство',
  poster: '/poster1.png', // замените на реальный URL
  rating: 7.5,
  year: 1979,
  genre: 'детектив',
  duration: '1 ч 7 мин',
  description: 'Увлекательные приключения самого известного сыщика всех времен',
};

const mockTopMovies = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Фильм ${i + 1}`,
  poster: '/poster2.png',
  rating: (Math.random() * 4 + 5).toFixed(1),
}));

const MainPage = () => {
  return (
    <Container>
      {/* Блок случайного фильма (wallpaper) */}
      <section className={styles.wallpaper}>
        <div className={styles.wallpaperContent}>
          {/* Левая часть с информацией */}
          <div className={styles.filmInfo}>
            <div className={styles.metaRow}>
              <div className={styles.rating}>
                <span className={styles.starIcon}>★</span>
                <span>{mockRandomMovie.rating}</span>
              </div>
              <span className={styles.year}>{mockRandomMovie.year}</span>
              <span className={styles.genre}>{mockRandomMovie.genre}</span>
              <span className={styles.duration}>{mockRandomMovie.duration}</span>
            </div>
            <h1 className={styles.title}>{mockRandomMovie.title}</h1>
            <p className={styles.description}>{mockRandomMovie.description}</p>
            <div className={styles.buttonGroup}>
              <button className={styles.buttonPrimary}>Трейлер</button>
              <button className={styles.buttonSecondary}>О фильме</button>
              <button className={styles.iconButton} aria-label="В избранное"><img src="/images/icon-favorit.svg" alt="В избранное" /></button>
              <button className={styles.iconButton} aria-label="Обновить фильм"><img src="/images/icon-refresh.svg" alt="Обновить" /></button>
            </div>
          </div>
          {/* Правая часть — постер */}
          <div className={styles.posterWrapper}>
            <img src={mockRandomMovie.poster} alt={mockRandomMovie.title} className={styles.poster} />
          </div>
        </div>
      </section>

      {/* Блок топ-10 фильмов */}
      <section className={styles.topSection}>
        <h2 className={styles.topTitle}>Топ 10 фильмов</h2>
        <div className={styles.topGrid}>
          {mockTopMovies.map((movie, index) => (
            <div key={movie.id} className={styles.topCard}>
              <div className={styles.topRank}>{index + 1}</div>
              <div className={styles.topPosterContainer}>
                <img src={movie.poster} alt={movie.title} className={styles.topPoster} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default MainPage;