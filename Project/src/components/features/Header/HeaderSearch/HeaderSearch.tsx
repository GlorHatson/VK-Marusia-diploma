import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { searchMovies, clearSearch } from '../../../../store/slices/searchSlice';
import SearchDropdownItem from '../../../UI/SearchDropdownItem/SearchDropdownItem';
import MobileSearchCard from '../../../UI/MobileSearchCard/MobileSearchCard';
import IconFind from '../../../../assets/images/icon-find.svg?react';
import { useDebounce } from '../../../../hooks/useDebounce';
import styles from '../Header.module.scss';

interface HeaderSearchProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  onSelectMovie: (id: number) => void;
}

const HeaderSearch: React.FC<HeaderSearchProps> = ({
  isSearchOpen,
  setIsSearchOpen,
  onSelectMovie,
}) => {
  const dispatch = useAppDispatch();
  const { results, loading, error } = useAppSelector((state) => state.search);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Поиск при изменении debouncedQuery
  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(searchMovies(debouncedQuery));
      setIsDropdownOpen(true);
    } else {
      dispatch(clearSearch());
      setIsDropdownOpen(false);
    }
  }, [debouncedQuery, dispatch]);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        if (isSearchOpen) setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isSearchOpen, setIsSearchOpen]);

  // Блокировка скролла при открытом мобильном поиске
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const input = document.getElementById('mobile-search-input');
        if (input) input.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(clearSearch());
    setIsDropdownOpen(false);
  };

  const handleSelect = (id: number) => {
    setSearchQuery('');
    dispatch(clearSearch());
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
    onSelectMovie(id);
  };

  const handleMobileClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    dispatch(clearSearch());
  };

  const handleMobileClear = () => {
    if (searchQuery.trim() !== '') {
      setSearchQuery('');
      dispatch(clearSearch());
    } else {
      setIsSearchOpen(false);
    }
  };

  // Функция для повторного открытия дропдауна по клику на иконку лупы
  const handleSearchIconClick = () => {
    if (searchQuery.trim() !== '') {
      setIsDropdownOpen(true);
      // Повторно запускаем поиск, чтобы обновить результаты (если нужно)
      dispatch(searchMovies(searchQuery.trim()));
    }
  };

  return (
    <>
      {/* Десктопный поиск */}
      <div className={styles.header__search} ref={searchRef}>
        <div className={styles['header__search-wrapper']}>
          <IconFind
            onClick={handleSearchIconClick}
            className={searchQuery.trim() !== '' ? styles['search-icon--active'] : styles['search-icon']}
          />
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
            {error && <div className={styles['search-dropdown__error']}>Ошибка загрузки. Попробуйте позже.</div>}
            {!error && loading && <div className={styles['search-dropdown__loading']}>Загрузка...</div>}
            {!error && !loading && results.length === 0 && searchQuery.trim() !== '' && (
              <div className={styles['search-dropdown__empty']}>Ничего не найдено</div>
            )}
            {!error && !loading && Array.isArray(results) && results.slice(0, 10).map((movie) => (
              <SearchDropdownItem key={movie.id} movie={movie} onClick={() => handleSelect(movie.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Мобильная кнопка поиска – в HeaderMobileActions, поэтому здесь только модалка */}
      {isSearchOpen && (
        <div
          className={styles['mobile-search-overlay']}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleMobileClose();
          }}
        >
          <div className={styles['mobile-search-modal']}>
            <div className={styles['mobile-search__field']}>
              <IconFind
                onClick={handleSearchIconClick}
                className={searchQuery.trim() !== '' ? styles['search-icon--active'] : styles['search-icon']}
              />
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
                onClick={handleMobileClear}
                aria-label={searchQuery.trim() ? 'Очистить' : 'Закрыть'}
              >
                ✕
              </button>
            </div>

            {searchQuery.trim() !== '' && (
              <div className={styles['mobile-search__results']}>
                {error && <div className={styles['mobile-search__error']}>Ошибка загрузки</div>}
                {!error && loading && <div className={styles['mobile-search__loading']}>Загрузка...</div>}
                {!error && !loading && results.length === 0 && (
                  <div className={styles['mobile-search__empty']}>Ничего не найдено</div>
                )}
                {!error && !loading && Array.isArray(results) && results.map((movie) => (
                  <MobileSearchCard key={movie.id} movie={movie} onClick={() => handleSelect(movie.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderSearch;