import React, { forwardRef } from 'react';

export interface InputProps {
  id?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'datetime-local' | 'tel' | 'url' | 'search';
  value?: string | number;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  error?: string;
  helpText?: string;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  id,
  name,
  type = 'text',
  value,
  placeholder,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  size = 'md',
  className = '',
  style,
  error,
  helpText,
  onChange,
  onBlur,
  onFocus,
  min,
  max,
  step,
  pattern,
  autoComplete,
  autoFocus
}, ref) => {
  const getSizeClass = () => {
    const sizeClasses = {
      sm: 'form-control-sm',
      md: '',
      lg: 'form-control-lg'
    };
    return sizeClasses[size] || '';
  };

  const getClasses = () => {
    const classes = [
      'form-control',
      getSizeClass(),
      error ? 'is-invalid' : '',
      className
    ].filter(Boolean);
    return classes.join(' ');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
      onChange(newValue);
    }
  };

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        value={value || ''}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className={getClasses()}
        style={style}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />

      {error && <div className="invalid-feedback">{error}</div>}
      {helpText && <div className="form-text">{helpText}</div>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 