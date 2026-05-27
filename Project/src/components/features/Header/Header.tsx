import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '../../UI/Container/Container';

const SearchIcon = () => (
  <img src="/images/icon-find.svg" alt="Поиск" className={styles['header__search-icon']} />
);

const Header = () => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.header__container}>
          <div className={styles.header__logo}>
            <Link to="/" className={styles['header__logo-link']}>
              <img src="/images/icon-logo.png" alt="Иконка" className={styles['header__logo-icon']} />
              <img src="/images/logo.svg" alt="Маруся" className={styles['header__logo-text']} />
            </Link>
          </div>
          <nav className={styles.header__nav}>
            <NavLink
              to="/"
              className={({ isActive }) => `${styles['header__nav-link']} ${isActive ? styles['header__nav-link--active'] : ''}`}
              end
            >
              Главная
            </NavLink>
            <NavLink
              to="/genres"
              className={({ isActive }) => `${styles['header__nav-link']} ${isActive ? styles['header__nav-link--active'] : ''}`}
            >
              Жанры
            </NavLink>
          </nav>
          <div className={styles.header__search}>
            <div className={styles['header__search-wrapper']}>
              <SearchIcon />
              <input type="text" placeholder="Поиск" className={styles['header__search-input']} />
            </div>
          </div>
          <div className={styles.header__auth}>
            <Link to="/login" className={styles['header__auth-link']}>Войти</Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;