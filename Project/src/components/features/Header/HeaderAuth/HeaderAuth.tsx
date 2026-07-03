import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { setAuthModalOpen } from '../../../../store/slices/uiSlice';
import IconUser from '../../../../assets/images/icon-user.svg?react';
import styles from './HeaderAuth.module.scss';

const HeaderAuth: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      dispatch(setAuthModalOpen(true));
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${styles.auth} ${isAuthenticated ? styles.active : ''}`}
    >
      <IconUser className={styles.icon} />
      <span>
        {isAuthenticated && user
          ? user.surname || user.email.split('@')[0] || 'Аккаунт'
          : 'Войти'}
      </span>
    </button>
  );
};

export default HeaderAuth;