import React, { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'light';
type ButtonSize = 'large' | 'small';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  isRound?: boolean;
  ripple?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'large',
  children,
  icon,
  isRound,
  ripple = true,
  className,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (ripple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const maxSize = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - maxSize / 2;
      const y = e.clientY - rect.top - maxSize / 2;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y, size: maxSize }]);

      // Если есть onClick, выполняем его после анимации
      if (onClick) {
        // Откладываем выполнение onClick на 400 мс (чтобы ripple успел показаться)
        setTimeout(() => {
          onClick(e);
        }, 400);
        // Удаляем ripple через 600 мс (чтобы анимация завершилась)
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
        return; // не вызываем onClick сейчас
      }
      // Если onClick нет, просто удаляем ripple
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    } else {
      // Если ripple выключен или кнопка не готова, вызываем onClick сразу
      if (onClick) onClick(e);
    }
  };

  const variantClass = variant !== 'primary' ? styles[`button--${variant}`] : '';
  const sizeClass = size !== 'large' ? styles[`button--${size}`] : '';
  const roundClass = isRound ? styles['button--round'] : '';
  const rippleClass = ripple ? styles['button--ripple'] : '';

  return (
    <button
      ref={buttonRef}
      className={`${styles.button} ${variantClass} ${sizeClass} ${roundClass} ${rippleClass} ${className || ''}`}
      onClick={handleClick}
      {...props}
    >
      {icon ? icon : children}
      {ripple &&
        ripples.map((r) => (
          <span
            key={r.id}
            className={styles.ripple}
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
            }}
          />
        ))}
    </button>
  );
};

export default Button;