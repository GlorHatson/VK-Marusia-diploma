import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '../../UI/Container/Container';
import MarusiaLogo from '../../../assets/images/marusia-logo.svg?react';
import IconFind from '../../../assets/images/icon-find.svg?react';

const Header = () => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.header__container}>
          <div className={styles.header__logo}>
            <Link to="/" className={styles['header__logo-link']}>
              <MarusiaLogo className={styles['header__logo-image']} />
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
              <IconFind className={styles['header__search-icon']} />
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