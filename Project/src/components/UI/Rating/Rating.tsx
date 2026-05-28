import styles from './Rating.module.scss';

interface RatingProps {
  value?: number;
  showStar?: boolean;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ value, showStar = true, className = '' }) => {
  const getRatingModifier = (rating?: number): string => {
    if (!rating) return 'black';
    if (rating >= 8) return 'gold';
    if (rating >= 7) return 'green';
    if (rating >= 6) return 'gray';
    return 'red';
  };

  const modifier = getRatingModifier(value);

  return (
    <div className={`${styles.rating} ${styles[`rating--${modifier}`]} ${className}`}>
      {showStar && <span className={styles.rating__star}>★</span>}
      <span>{value?.toFixed(1) ?? '—'}</span>
    </div>
  );
};

export default Rating;