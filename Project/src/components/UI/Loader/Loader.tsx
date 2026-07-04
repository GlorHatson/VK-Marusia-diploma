import React from 'react';
import styles from './Loader.module.scss';

interface LoaderProps {
  size?: number; // размер по ширине, высота будет пропорционально меньше (овал)
  message?: string; // текст для отображения
}

const Loader: React.FC<LoaderProps> = ({ size = 200, message = 'Загрузка...' }) => {
  const width = size;
  const height = size * 0.7; // овал: высота 70% от ширины

  return (
    <div className={styles.overlay} >
      <div className={styles.loader} style={{ width, height }}>
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

        <div className={styles['gooey-container']}>
          <div className={styles.level}>
            <span className={styles.bubble}></span>
            <span className={styles.bubble}></span>
            <span className={styles.bubble}></span>
            <span className={styles.bubble}></span>
            <span className={styles.bubble}></span>
            <span className={styles.bubble}></span>
            <span className={styles.bubble}></span>
            <span className={styles.bubble}></span>
          </div>
        </div>

        <div className={styles.text}>{message}</div>

        {/* Анимированное лицо Маруси (поверх овала) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-65%, -100%)',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 400 400" className={styles.svg}>
            <g opacity="0">
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                dur="0.3s"
                begin="0s"
                fill="freeze"
              />

              {/* Улыбка */}
              <path
                fill="rgb(255, 255, 255)"
                stroke="rgb(221, 221, 221)"
                d="M 286.209 249.655 C 291.7 254.477 279.766 276.325 254.888 276.325 C 230.01 276.325 216.372 254.855 222.242 249.844 C 228.112 244.833 235.147 258.537 254.344 258.537 C 273.541 258.537 280.718 244.833 286.209 249.655 Z"
              />

              {/* Левый глаз (белый) */}
              <path
                fill="rgb(255, 255, 255)"
                d="M 223.022 199.851 C 222.201 209.362 215.587 207.452 211.679 204.797 C 207.772 202.142 199.33 198.212 194.759 198.343 C 190.188 198.475 182.363 200.631 176.699 205.32 C 171.035 210.008 164.886 210.702 164.289 200.32 C 163.693 189.94 166.891 179.633 171.999 172.254 C 177.107 164.875 184.478 160.158 193.286 160.158 C 202.094 160.158 209.851 164.861 215.244 172.174 C 220.637 179.486 223.843 190.341 223.022 199.851 Z"
              />

              {/* Правый глаз БОЛЬШОЙ (подмигивает) */}
              <path
                opacity="1"
                fill="rgb(255, 255, 255)"
                d="M 344.239 199.851 C 343.418 209.362 336.804 207.452 332.896 204.797 C 328.989 202.142 320.547 198.212 315.976 198.343 C 311.405 198.475 303.58 200.631 297.916 205.32 C 292.252 210.008 286.103 210.702 285.506 200.32 C 284.91 189.94 288.108 179.633 293.216 172.254 C 298.324 164.875 305.695 160.158 314.503 160.158 C 323.311 160.158 331.068 164.861 336.461 172.174 C 341.854 179.486 345.06 190.341 344.239 199.851 Z"
              >
                <animate
                  attributeName="opacity"
                  values="1; 1; 0; 0; 0; 1"
                  keyTimes="0; 0.05; 0.2; 0.5; 0.6; 1"
                  dur="1.6s"
                  begin="0.1s"
                  repeatCount="1"
                />
              </path>

              {/* Правый глаз МАЛЕНЬКИЙ (появляется при подмигивании) */}
              <path
                opacity="0"
                fill="rgb(255, 255, 255)"
                d="M 342.823 183.055 C 342.026 176.937 335.606 178.165 331.813 179.873 C 328.02 181.581 319.826 184.11 315.389 184.025 C 310.952 183.94 303.356 182.553 297.858 179.537 C 292.36 176.521 286.391 176.075 285.812 182.753 C 285.233 189.431 288.338 196.061 293.296 200.808 C 298.254 205.555 305.409 208.589 313.959 208.589 C 322.509 208.589 330.038 205.564 335.273 200.86 C 340.508 196.156 343.62 189.173 342.823 183.055 Z"
              >
                <animate
                  attributeName="opacity"
                  values="0; 0; 1; 1; 1; 0"
                  keyTimes="0; 0.05; 0.2; 0.5; 0.6; 1"
                  dur="1.6s"
                  begin="0.1s"
                  repeatCount="1"
                />
              </path>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loader;