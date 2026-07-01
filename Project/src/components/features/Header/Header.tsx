import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setAuthModalOpen } from '../../../store/slices/uiSlice';
import { searchMovies, clearSearch } from '../../../store/slices/searchSlice';
import SearchDropdownItem from '../../UI/SearchDropdownItem/SearchDropdownItem';
import MobileSearchCard from '../../UI/MobileSearchCard/MobileSearchCard';
import styles from './Header.module.scss';
import Container from '../../UI/Container/Container';
import MarusiaLogo from '../../../assets/images/marusia-logo.svg?react';
import IconGenres from '../../../assets/images/icon-genres.svg?react';
import IconFind from '../../../assets/images/icon-find.svg?react';
import IconUser from '../../../assets/images/icon-user.svg?react';
import AuthModal from '../AuthModal/AuthModal';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        if (isSearchOpen) setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  const handleSelectMovie = (id: number) => {
    setSearchQuery('');
    dispatch(clearSearch());
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
    navigate(`/movie/${id}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(clearSearch());
    setIsDropdownOpen(false);
  };

  const handleGenresClick = () => navigate('/genres');

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      const input = document.getElementById('mobile-search-input');
      if (input) input.focus();
    }, 100);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      dispatch(setAuthModalOpen(true));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth > 768;
      if (isDesktop && isSearchOpen) {
        // Переходим в десктопный режим: закрываем модалку, открываем дропдаун
        setIsSearchOpen(false);
        if (searchQuery.trim()) {
          setIsDropdownOpen(true);
        }
      } else if (!isDesktop && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSearchOpen, isDropdownOpen, searchQuery]);

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
                className={({ isActive }) =>
                  `${styles['header__nav-link']} ${isActive ? styles['header__nav-link--active'] : ''}`
                }
                end
              >
                <span>Главная</span>
              </NavLink>
              <NavLink
                to="/genres"
                className={({ isActive }) =>
                  `${styles['header__nav-link']} ${isActive ? styles['header__nav-link--active'] : ''}`
                }
              >
                <IconGenres className={styles['nav-icon']} />
                <span>Жанры</span>
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
                <IconUser className={styles['nav-icon']} />
                <span>
                  {isAuthenticated && user
                    ? user.surname || user.email.split('@')[0] || 'Аккаунт'
                    : 'Войти'}
                </span>
              </button>
            </div>

            <div className={styles['header__mobile-actions']}>
              <button
                className={styles['header__mobile-btn']}
                onClick={handleGenresClick}
                aria-label="Жанры"
              >
                <IconGenres className={styles['mobile-icon-genres']} />
              </button>
              <button
                className={styles['header__mobile-btn']}
                onClick={handleSearchClick}
                aria-label="Поиск"
              >
                <IconFind className={styles['mobile-icon-find']} />
              </button>
              <button
                className={styles['header__mobile-btn']}
                onClick={handleAuthClick}
                aria-label="Аккаунт"
              >
                <IconUser className={styles['mobile-icon-user']} />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Мобильное модальное окно поиска */}
      {isSearchOpen && (
        <div
          className={styles['mobile-search-overlay']}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchOpen(false);
              setSearchQuery('');
              dispatch(clearSearch());
            }
          }}
        >
          <div className={styles['mobile-search-modal']}>
            <div className={styles['mobile-search__field']}>
              <IconFind className={styles['mobile-search__icon']} />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles['mobile-search__input']}
                autoFocus
              />
              <button
                className={styles['mobile-search__action']}
                onClick={() => {
                  if (searchQuery.trim()) {
                    setSearchQuery('');
                    dispatch(clearSearch());
                  } else {
                    setIsSearchOpen(false);
                  }
                }}
                aria-label={searchQuery.trim() ? 'Очистить' : 'Закрыть'}
              >
                ✕
              </button>
            </div>
            {searchQuery.trim() !== '' && (
              <div className={styles['mobile-search__results']}>
                {loading && <div className={styles['mobile-search__loading']}>Загрузка...</div>}
                {!loading && results.length === 0 && (
                  <div className={styles['mobile-search__empty']}>Ничего не найдено</div>
                )}
                {!loading &&
                  results.map((movie) => (
                    <MobileSearchCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => handleSelectMovie(movie.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => dispatch(setAuthModalOpen(false))} />
    </>
  );
};

export default Header;