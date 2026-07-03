import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconGenres from '../../../../assets/images/icon-genres.svg?react';
import IconFind from '../../../../assets/images/icon-find.svg?react';
import IconUser from '../../../../assets/images/icon-user.svg?react';
import styles from './HeaderMobileActions.module.scss';

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
    <div className={styles.actions}>
      <button className={styles.btn} onClick={() => navigate('/genres')} aria-label="Жанры">
        <IconGenres className={styles.genresIcon} />
      </button>
      <button className={styles.btn} onClick={onSearchClick} aria-label="Поиск">
        <IconFind className={styles.findIcon} />
      </button>
      <button className={styles.btn} onClick={onAuthClick} aria-label="Аккаунт">
        <IconUser className={styles.userIcon} />
      </button>
    </div>
  );
};

export default HeaderMobileActions;