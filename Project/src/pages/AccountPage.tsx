import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, checkAuth } from '../store/slices/userSlice';
import { removeFromFavorites, fetchFavorites } from '../store/slices/favoritesSlice';
import Container from '../components/UI/Container/Container';
import NoPoster from '../components/UI/NoPoster/NoPoster';
import Button from '../components/UI/Button/Button';
import FavoriteIcon from '../assets/images/icon-favorit.svg?react';
import UserIcon from '../assets/images/icon-user.svg?react';
import MailIcon from '../assets/images/icon-mail.svg?react';
import CloseIcon from '../assets/images/icon-close.svg?react';
import styles from './AccountPage.module.scss';

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: userLoading } = useAppSelector((state) => state.user);
  const { items: favorites, loading: favLoading } = useAppSelector((state) => state.favorites);
  const [activeTab, setActiveTab] = useState<'favorites' | 'settings'>('favorites');

  // Проверка авторизации при монтировании
  useEffect(() => {
    if (!isAuthenticated && !userLoading) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated, userLoading]);

  // Загрузка избранного, если пользователь авторизован
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

  // Если загружается профиль
  if (userLoading) {
    return <div className={styles['account-page__loader']}>Загрузка профиля...</div>;
  }

  // Если не авторизован
  if (!isAuthenticated || !user) {
    return <div className={styles['account-page__loader']}>Доступ ограничен. Пожалуйста, войдите.</div>;
  }

  // Безопасное получение имени/фамилии/email
  const name = user.name || '';
  const surname = user.surname || '';
  const email = user.email || '';
  const fullName = (name && surname) ? `${name} ${surname}` : email;
  const initials = (name && surname)
    ? `${name[0]}${surname[0]}`.toUpperCase()
    : (email[0] || 'U').toUpperCase();

  // Рендер избранных фильмов
  const renderFavorites = () => {
    if (favLoading) {
      return <div className={styles['account-page__loader']}>Загрузка избранного...</div>;
    }
    if (!favorites.length) {
      return <div className={styles['account-page__favorites-empty']}>Нет избранных фильмов</div>;
    }

    return (
      <div className={styles['account-page__favorites-grid']}>
        {favorites.map((movie) => (
          <div
            key={movie.id}
            className={styles['account-page__favorites-card']}
            onClick={(e) => {
              // Если клик был по кнопке или внутри неё – не переходим
              if ((e.target as HTMLElement).closest('button')) {
                return;
              }
              navigate(`/movie/${movie.id}`);
            }}
          >
            <Button
              variant="light"
              isRound
              icon={<CloseIcon />}
              className={styles['account-page__favorites-remove']}
              onClick={(e) => handleRemoveFavorite(e, movie.id)}
              aria-label="Удалить из избранного"
            />

            <div className={styles['account-page__favorites-poster-wrapper']}>
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className={styles['account-page__favorites-poster']}
                />
              ) : (
                <NoPoster title={movie.title || `Фильм ${movie.id}`} variant="compact" />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Рендер настроек аккаунта
  const renderSettings = () => (
    <div className={styles['account-page__content']}>
      <div className={styles['account-page__settings']}>
        {/* Первый горизонтальный блок: инициалы + имя-фамилия */}
        <div className={styles['settings-row']}>
          <div className={styles['settings-avatar']}>{initials}</div>
          <div className={styles['settings-info']}>
            <div className={styles['settings-label']}>Имя Фамилия</div>
            <div className={styles['settings-value']}>{fullName}</div>
          </div>
        </div>
        {/* Второй горизонтальный блок: иконка почты + email */}
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
      {/* Кнопка выхода */}
      <Button variant="primary" onClick={handleLogout} className={styles['account-page__logout-btn']}>
        Выйти из аккаунта
      </Button>
    </div>
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