import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setAuthModalOpen } from '../../../store/slices/uiSlice';
import Container from '../../UI/Container/Container';
import AuthModal from '../AuthModal/AuthModal';
import MarusiaLogo from '../../../assets/images/marusia-logo.svg?react';
import HeaderNav from './HeaderNav/HeaderNav';
import HeaderAuth from './HeaderAuth/HeaderAuth';
import HeaderMobileActions from './HeaderMobileActions/HeaderMobileActions';
import HeaderSearch from './HeaderSearch/HeaderSearch';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthModalOpen = useAppSelector((state) => state.ui.isAuthModalOpen);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth > 768;
      if (isDesktop && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSearchOpen]);

  const handleMovieSelect = (id: number) => {
    navigate(`/movie/${id}`);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      dispatch(setAuthModalOpen(true));
    }
  };

  return (
    <>
      <header className={`${styles.header} ${isSearchOpen ? styles['header--no-blur'] : ''}`}>
        <Container>
          <div className={styles.header__container}>
            <div className={styles.header__logo}>
              <Link to="/" className={styles['header__logo-link']} aria-label="На главную">
                <MarusiaLogo className={styles['header__logo-image']} aria-hidden="true" />
              </Link>
            </div>

            <HeaderNav />

            <HeaderSearch
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              onSelectMovie={handleMovieSelect}
            />

            <HeaderAuth />

            <HeaderMobileActions
              onSearchClick={() => setIsSearchOpen(true)}
              onAuthClick={handleAuthClick}
            />
          </div>
        </Container>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => dispatch(setAuthModalOpen(false))} />
    </>
  );
};

export default Header;