import React from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'light';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const variantClass = variant !== 'primary' ? styles[`button--${variant}`] : '';
  return (
    <button
      className={`button-base button-text ${variantClass} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;