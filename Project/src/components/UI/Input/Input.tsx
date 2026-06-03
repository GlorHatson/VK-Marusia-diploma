import styles from './Input.module.scss';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  type?: string;
  className?: string;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  error = false,
  type = 'text',
  className = '',
  onBlur,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`${styles.input} ${error ? styles['input--error'] : ''} ${className}`}
    />
  );
};

export default Input;