import React from 'react';
import styles from './GooeyFill.module.scss';

const GooeyFill: React.FC = () => {
  return (
    <div className={styles['fill']}>
      <div className={styles['gooey-container']}>
        {/* Фильтр gooey (должен быть определен выше в DOM) */}
        <svg width="0" height="0">
          <filter id="gooey-fill">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -16"
              result="goo"
            />
          </filter>
        </svg>

        {/* Контейнер с пузырьками */}
        <div className={styles['level']}>
          <span className={styles['bubble']}></span>
          <span className={styles['bubble']}></span>
          <span className={styles['bubble']}></span>
          <span className={styles['bubble']}></span>
          <span className={styles['bubble']}></span>
          <span className={styles['bubble']}></span>
          <span className={styles['bubble']}></span>
          <span className={styles['bubble']}></span>
        </div>
      </div>
    </div>
  );
};

export default GooeyFill;