import React, { useState } from 'react';
import styles from './Input.module.scss';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  type?: string;
  className?: string;
  onBlur?: () => void;
  icon?: React.ReactNode;          // иконка слева
  theme?: 'dark' | 'light';        // тема: тёмная (по умолчанию) или светлая
  name?: string;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  error = false,
  type = 'text',
  className = '',
  onBlur,
  icon,
  theme = 'dark',
  name,
  autoComplete,
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value.trim().length > 0;

  // Определяем классы для темы и состояния
  const themeClass = theme === 'dark' ? styles['input-dark'] : styles['input-light'];
  const stateClass = error
    ? styles['input-error']
    : focused
    ? styles['input-focused']
    : hasValue
    ? styles['input-filled']
    : '';

  return (
    <div className={`${styles['input-wrapper']} ${themeClass} ${stateClass} ${className}`}>
      {icon && <span className={styles['input-icon']}>{icon}</span>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        placeholder={placeholder}
        className={styles['input-field']}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default Input;