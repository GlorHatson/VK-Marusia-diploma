import React from 'react';
import noPosterImg from '../../../assets/images/marusia_noposter.webp';
import styles from './NoPoster.module.scss';

type NoPosterVariant = 'default' | 'compact';

interface NoPosterProps {
  title: string;
  className?: string;
  variant?: NoPosterVariant;
}

const NoPoster: React.FC<NoPosterProps> = ({ title, className, variant = 'default' }) => {
  return (
    <div className={`${styles['no-poster']} ${styles[`no-poster--${variant}`]} ${className || ''}`}>
      <img src={noPosterImg} alt="Нет постера" className={styles['no-poster__image']} />
      <div className={styles['no-poster__text']}>
        {/* <span>Для фильма</span> */}
        <span className={styles['no-poster__title']}>«{title}»</span>
        <span>постер не найден</span>
      </div>
    </div>
  );
};

export default NoPoster;