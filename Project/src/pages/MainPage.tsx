import styles from './MainPage.module.scss';
import Container from '../components/UI/Container/Container';

const mockRandomMovie = {
  id: 1,
  title: 'Шерлок Холмс и доктор Ватсон: Знакомство',
  poster: '/poster1.png',
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
      <section className={styles['main-page__wallpaper']}>
        <div className={styles['main-page__wallpaper-content']}>
          <div className={styles['main-page__film-info']}>
            <div className={styles['main-page__meta-row']}>
              <div className={styles['main-page__rating']}>
                <span className={styles['main-page__star-icon']}>★</span>
                <span>{mockRandomMovie.rating}</span>
              </div>
              <span className={styles['main-page__year']}>{mockRandomMovie.year}</span>
              <span className={styles['main-page__genre']}>{mockRandomMovie.genre}</span>
              <span className={styles['main-page__duration']}>{mockRandomMovie.duration}</span>
            </div>
            <h1 className={styles['main-page__title']}>{mockRandomMovie.title}</h1>
            <p className={styles['main-page__description']}>{mockRandomMovie.description}</p>
            <div className={styles['main-page__button-group']}>
              <button className={styles['main-page__button--primary']}>Трейлер</button>
              <button className={styles['main-page__button--secondary']}>О фильме</button>
              <button className={styles['main-page__icon-button']} aria-label="В избранное">
                <img src="/images/icon-favorit.svg" alt="В избранное" />
              </button>
              <button className={styles['main-page__icon-button']} aria-label="Обновить фильм">
                <img src="/images/icon-refresh.svg" alt="Обновить" />
              </button>
            </div>
          </div>
          <div className={styles['main-page__poster-wrapper']}>
            <img src={mockRandomMovie.poster} alt={mockRandomMovie.title} className={styles['main-page__poster']} />
          </div>
        </div>
      </section>

      <section className={styles['main-page__top-section']}>
        <h2 className={styles['main-page__top-title']}>Топ 10 фильмов</h2>
        <div className={styles['main-page__top-grid']}>
          {mockTopMovies.map((movie, index) => (
            <div key={movie.id} className={styles['main-page__top-card']}>
              <div className={styles['main-page__top-rank']}>{index + 1}</div>
              <div className={styles['main-page__top-poster-container']}>
                <img src={movie.poster} alt={movie.title} className={styles['main-page__top-poster']} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default MainPage;