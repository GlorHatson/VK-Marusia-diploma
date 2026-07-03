import React from 'react';
import { NavLink } from 'react-router-dom';
import IconGenres from '../../../../assets/images/icon-genres.svg?react';
import styles from './HeaderNav.module.scss';

const HeaderNav: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
        end
      >
        <span>Главная</span>
      </NavLink>
      <NavLink
        to="/genres"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >
        <IconGenres className={styles.icon} />
        <span>Жанры</span>
      </NavLink>
    </nav>
  );
};

export default HeaderNav;