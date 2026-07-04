import React from 'react';
import { NavLink } from 'react-router-dom';
import IconGenres from '../../../../assets/images/icon-genres.svg?react';
import styles from '../Header.module.scss';

const HeaderNav: React.FC = () => {
  return (
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
  );
};

export default HeaderNav;