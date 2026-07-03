import React from 'react';
import styles from './MovieGrid.module.scss';

interface MovieGridProps {
  children: React.ReactNode;
  scrollOnMobile?: boolean;
  className?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  children,
  scrollOnMobile = false,
  className = '',
}) => {
  return (
    <div
      className={`${styles['movie-grid']} ${scrollOnMobile ? styles['movie-grid--scrollable'] : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default MovieGrid;