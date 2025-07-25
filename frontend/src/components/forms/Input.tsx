import React, { forwardRef } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';
  name: string;
  id?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  minLength?: number;
  maxLength?: number;
  title?: string;
}

/**
 * Wiederverwendbare Input-Komponente mit Tabler.io Styling und HTML5-Validierung
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  name,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  className = '',
  min,
  max,
  step,
  pattern,
  autoComplete,
  autoFocus,
  minLength,
  maxLength,
  title,
}, ref) => {
  // Automatische Validierungsattribute basierend auf Typ
  const getValidationAttributes = () => {
    const attrs: Record<string, any> = {};
    
    switch (type) {
      case 'email':
        attrs.pattern = pattern || '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';
        attrs.title = title || 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
        break;
      case 'tel':
        attrs.pattern = pattern || '[\+]?[0-9\s\-\(\)]{10,}';
        attrs.title = title || 'Bitte geben Sie eine gültige Telefonnummer ein';
        break;
      case 'url':
        attrs.pattern = pattern || 'https?://.+';
        attrs.title = title || 'Bitte geben Sie eine gültige URL ein (z.B. https://example.com)';
        break;
      case 'number':
        if (min !== undefined) attrs.min = min;
        if (max !== undefined) attrs.max = max;
        if (step !== undefined) attrs.step = step;
        break;
    }
    
    return attrs;
  };

  const validationAttrs = getValidationAttributes();

  return (
    <input
      ref={ref}
      type={type}
      name={name}
      id={id || name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      min={min}
      max={max}
      step={step}
      pattern={pattern || validationAttrs.pattern}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      minLength={minLength}
      maxLength={maxLength}
      title={title || validationAttrs.title}
      className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
    />
  );
});

Input.displayName = 'Input'; 