// import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import styles from './Header.module.scss';
import Container from '../../UI/Container/Container';
import MarusiaLogo from '../../../assets/images/marusia-logo.svg?react';
import IconFind from '../../../assets/images/icon-find.svg?react';
import AuthModal from '../AuthModal/AuthModal';
import { setAuthModalOpen } from '../../../store/slices/uiSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const isAuthModalOpen = useAppSelector((state) => state.ui.isAuthModalOpen);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      dispatch(setAuthModalOpen(true));
    }
  };

  return (
    <>
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
              <button
                onClick={handleAuthClick}
                className={`${styles['header__nav-link']} ${isAuthenticated ? styles['header__nav-link--active'] : ''}`}
              >
                {isAuthenticated && user ? (user.surname || user.email.split('@')[0] || 'Аккаунт') : 'Войти'}
              </button>
            </div>
          </div>
        </Container>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => dispatch(setAuthModalOpen(false))} />
    </>
  );
};

export default Header;