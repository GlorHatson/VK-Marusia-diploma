import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconGenres from '../../../../assets/images/icon-genres.svg?react';
import IconFind from '../../../../assets/images/icon-find.svg?react';
import IconUser from '../../../../assets/images/icon-user.svg?react';
import styles from '../Header.module.scss';

interface HeaderMobileActionsProps {
  onSearchClick: () => void;
  onAuthClick: () => void;
}

const HeaderMobileActions: React.FC<HeaderMobileActionsProps> = ({
  onSearchClick,
  onAuthClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles['header__mobile-actions']}>
      <button className={styles['header__mobile-btn']} onClick={() => navigate('/genres')} aria-label="Жанры">
        <IconGenres className={styles['mobile-icon-genres']} />
      </button>
      <button className={styles['header__mobile-btn']} onClick={onSearchClick} aria-label="Поиск">
        <IconFind className={styles['mobile-icon-find']} />
      </button>
      <button className={styles['header__mobile-btn']} onClick={onAuthClick} aria-label="Аккаунт">
        <IconUser className={styles['mobile-icon-user']} />
      </button>
    </div>
  );
};

export default HeaderMobileActions;