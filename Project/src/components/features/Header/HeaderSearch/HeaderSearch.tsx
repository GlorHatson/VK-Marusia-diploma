import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { searchMovies, clearSearch } from '../../../../store/slices/searchSlice';
import SearchDropdownItem from '../../../UI/SearchDropdownItem/SearchDropdownItem';
import MobileSearchCard from '../../../UI/MobileSearchCard/MobileSearchCard';
import IconFind from '../../../../assets/images/icon-find.svg?react';
import { useDebounce } from '../../../../hooks/useDebounce';
import styles from './HeaderSearch.module.scss';

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
  const { results, loading } = useAppSelector((state) => state.search);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(searchMovies(debouncedQuery));
      setIsDropdownOpen(true);
    } else {
      dispatch(clearSearch());
      setIsDropdownOpen(false);
    }
  }, [debouncedQuery, dispatch]);

  // Закрытие дропдауна при клике вне
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

  // Блокировка скролла при открытой мобильной модалке
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

  const handleMobileOpen = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      const input = document.getElementById('mobile-search-input');
      if (input) input.focus();
    }, 100);
  };

  const handleMobileClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    dispatch(clearSearch());
  };

  return (
    <>
      {/* Десктопный поиск */}
      <div className={styles.search} ref={searchRef}>
        <div className={styles.wrapper}>
          <IconFind className={styles.icon} />
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.input}
          />
          {searchQuery.length > 0 && (
            <button className={styles.clearBtn} onClick={handleClearSearch} aria-label="Очистить">
              ✕
            </button>
          )}
        </div>

        {isDropdownOpen && (
          <div className={styles.dropdown}>
            {loading && <div className={styles.loading}>Загрузка...</div>}
            {!loading && results.length === 0 && searchQuery.trim() !== '' && (
              <div className={styles.empty}>Ничего не найдено</div>
            )}
            {!loading &&
              results.slice(0, 10).map((movie) => (
                <SearchDropdownItem
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleSelect(movie.id)}
                />
              ))}
          </div>
        )}
      </div>

      {/* Мобильная кнопка поиска */}
      <button className={styles.mobileSearchBtn} onClick={handleMobileOpen} aria-label="Поиск">
        <IconFind />
      </button>

      {/* Мобильное модальное окно поиска */}
      {isSearchOpen && (
        <div className={styles.mobileOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) handleMobileClose();
        }}>
          <div className={styles.mobileModal}>
            <div className={styles.mobileField}>
              <IconFind className={styles.mobileIcon} />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.mobileInput}
                autoFocus
              />
              <button className={styles.mobileClear} onClick={handleMobileClose} aria-label="Закрыть">
                ✕
              </button>
            </div>
            {searchQuery.trim() !== '' && (
              <div className={styles.mobileResults}>
                {loading && <div className={styles.mobileLoading}>Загрузка...</div>}
                {!loading && results.length === 0 && (
                  <div className={styles.mobileEmpty}>Ничего не найдено</div>
                )}
                {!loading &&
                  results.map((movie) => (
                    <MobileSearchCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => handleSelect(movie.id)}
                    />
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