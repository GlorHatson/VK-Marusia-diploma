import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setAuthModalOpen } from '../../../store/slices/uiSlice';
import { searchMovies, clearSearch } from '../../../store/slices/searchSlice';
import SearchDropdownItem from '../../UI/SearchDropdownItem/SearchDropdownItem';
import styles from './Header.module.scss';
import Container from '../../UI/Container/Container';
import MarusiaLogo from '../../../assets/images/marusia-logo.svg?react';
import IconFind from '../../../assets/images/icon-find.svg?react';
import AuthModal from '../AuthModal/AuthModal';

// Простейший debounce без lodash
function debounce<F extends (...args: any[]) => any>(fn: F, delay: number): F {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as F;
}

const Header = () => {
  const dispatch = useAppDispatch();
  const isAuthModalOpen = useAppSelector((state) => state.ui.isAuthModalOpen);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const { results, loading } = useAppSelector((state) => state.search);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        dispatch(searchMovies(query));
        setIsDropdownOpen(true);
      } else {
        dispatch(clearSearch());
        setIsDropdownOpen(false);
      }
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSelectMovie = (id: number) => {
    setSearchQuery('');
    dispatch(clearSearch());
    setIsDropdownOpen(false);
    navigate(`/movie/${id}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(clearSearch());
    setIsDropdownOpen(false);
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

            <div className={styles.header__search} ref={searchRef}>
              <div className={styles['header__search-wrapper']}>
                <IconFind className={styles['header__search-icon']} />
                <input
                  type="text"
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles['header__search-input']}
                />
                {searchQuery.length > 0 && (
                  <button
                    className={styles['search__clear']}
                    onClick={handleClearSearch}
                    aria-label="Очистить"
                  >
                    ✕
                  </button>
                )}
              </div>

              {isDropdownOpen && (
                <div className={styles['search-dropdown']}>
                  {loading && <div className={styles['search-dropdown__loading']}>Загрузка...</div>}
                  {!loading && results.length === 0 && searchQuery.trim() !== '' && (
                    <div className={styles['search-dropdown__empty']}>Ничего не найдено</div>
                  )}
                  {results.slice(0, 10).map((movie) => (
                    <SearchDropdownItem
                      key={movie.id}
                      movie={movie}
                      onClick={() => handleSelectMovie(movie.id)}
                    />
                  ))}
                </div>
              )}
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