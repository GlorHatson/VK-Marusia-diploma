import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, checkAuth } from '../store/slices/userSlice';
import { removeFromFavorites, fetchFavorites } from '../store/slices/favoritesSlice';
import Container from '../components/UI/Container/Container';
import MovieGrid from '../components/UI/MovieGrid/MovieGrid';
import MovieCard from '../components/UI/MovieCard/MovieCard';
import Button from '../components/UI/Button/Button';
import FavoriteIcon from '../assets/images/icon-favorit.svg?react';
import UserIcon from '../assets/images/icon-user.svg?react';
import MailIcon from '../assets/images/icon-mail.svg?react';
import Loader from '../components/UI/Loader/Loader';
import ErrorMessage from '../components/UI/ErrorMessage/ErrorMessage';
import styles from './AccountPage.module.scss';

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: userLoading, error: userError } = useAppSelector((state) => state.user);
  const { items: favorites, loading: favLoading, error: favoritesError } = useAppSelector((state) => state.favorites);
  const [activeTab, setActiveTab] = useState<'favorites' | 'settings'>('favorites');

  useEffect(() => {
    if (!isAuthenticated && !userLoading) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated, userLoading]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const handleRemoveFavorite = async (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation();
    await dispatch(removeFromFavorites(movieId));
  };

  if (userLoading) {
    return <div className={styles['account-page__loader']}><Loader size={200} message="Загрузка профиля..." /></div>;
  }

  if (!isAuthenticated || !user) {
    return <div className={styles['account-page__loader']}>Доступ ограничен. Пожалуйста, войдите.</div>;
  }

  const error = userError || favoritesError;
  if (error) {
    return (
      <ErrorMessage
        title="Ошибка загрузки аккаунта"
        message={error}
        onRetry={() => {
          dispatch(checkAuth());
          if (isAuthenticated) dispatch(fetchFavorites());
        }}
      />
    );
  }

  const name = user.name || '';
  const surname = user.surname || '';
  const email = user.email || '';
  const fullName = (name && surname) ? `${name} ${surname}` : email;
  const initials = (name && surname)
    ? `${name[0]}${surname[0]}`.toUpperCase()
    : (email[0] || 'U').toUpperCase();

  const renderFavorites = () => {
    if (favLoading) {
      return <div className={styles['account-page__loader']}><Loader size={200} message="Загрузка избранного..." /></div>;
    }
    if (!favorites.length) {
      return <div className={styles['account-page__favorites-empty']}>Нет избранных фильмов</div>;
    }

    return (
      <MovieGrid scrollOnMobile>
        {favorites.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => navigate(`/movie/${movie.id}`)}
            showRemove
            onRemove={(e) => handleRemoveFavorite(e, movie.id)}
          />
        ))}
      </MovieGrid>
    );
  };

  const renderSettings = () => (
    <>
      <div className={styles['account-page__settings']}>
        <div className={styles['settings-row']}>
          <div className={styles['settings-avatar']}>{initials}</div>
          <div className={styles['settings-info']}>
            <div className={styles['settings-label']}>Имя Фамилия</div>
            <div className={styles['settings-value']}>{fullName}</div>
          </div>
        </div>
        <div className={styles['settings-row']}>
          <div className={styles['settings-icon']}>
            <MailIcon className={styles['settings-icon-svg']} />
          </div>
          <div className={styles['settings-info']}>
            <div className={styles['settings-label']}>Электронная почта</div>
            <div className={styles['settings-value']}>{email}</div>
          </div>
        </div>
      </div>
      <Button variant="primary" onClick={handleLogout} className={styles['account-page__logout-btn']}>
        Выйти из аккаунта
      </Button>
    </>
  );

  return (
    <Container>
      <div className={styles['account-page']}>
        <h1 className={styles['account-page__title']}>Мой аккаунт</h1>
        <div className={styles['account-page__tabs']}>
          <button
            className={`${styles['account-page__tab']} ${activeTab === 'favorites' ? styles['account-page__tab--active'] : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <FavoriteIcon className={styles['account-page__tab-icon']} />
            <span className={styles['tab-text-full']}>Избранные фильмы</span>
            <span className={styles['tab-text-short']}>Избранное</span>
          </button>
          <button
            className={`${styles['account-page__tab']} ${activeTab === 'settings' ? styles['account-page__tab--active'] : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <UserIcon className={styles['account-page__tab-icon']} />
            <span className={styles['tab-text-full']}>Настройка аккаунта</span>
            <span className={styles['tab-text-short']}>Настройки</span>
          </button>
        </div>
        <div className={styles['account-page__content']}>
          {activeTab === 'favorites' ? renderFavorites() : renderSettings()}
        </div>
      </div>
    </Container>
  );
};

export default AccountPage;