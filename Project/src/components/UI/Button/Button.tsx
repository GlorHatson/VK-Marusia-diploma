import React from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'light';
type ButtonSize = 'large' | 'small'; // large – по умолчанию

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  icon?: React.ReactNode;   // если передан icon, children игнорируется
  isRound?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'large',
  children,
  icon,
  isRound,
  className,
  ...props
}) => {
  const variantClass = variant !== 'primary' ? styles[`button--${variant}`] : '';
  const sizeClass = size !== 'large' ? styles[`button--${size}`] : '';
  const roundClass = isRound ? styles['button--round'] : '';
  return (
    <button
      className={`${styles.button} ${variantClass} ${sizeClass} ${roundClass} ${className || ''}`}
      {...props}
    >
      {icon ? icon : children}
    </button>
  );
};

export default Button;