import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '../../UI/Container/Container';


const SearchIcon = () => (
  <img src="/images/icon-find.svg" alt="Поиск" className={styles.searchIcon} />
);

const Header = () => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.innerContainer}>  {/* это наш флекс-контейнер */}
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>
              <img src="/images/icon-logo.png" alt="Иконка" className={styles.logoIcon} />
              <img src="/images/logo.svg" alt="Маруся" className={styles.logoText} />
            </Link>
          </div>
          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              end
            >
              Главная
            </NavLink>
            <NavLink
              to="/genres"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              Жанры
            </NavLink>
          </nav>
          <div className={styles.search}>
            <div className={styles.searchWrapper}>
              <SearchIcon />
              <input type="text" placeholder="Поиск" className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.auth}>
            <Link to="/login" className={styles.authLink}>Войти</Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;