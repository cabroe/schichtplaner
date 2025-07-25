import React, { forwardRef } from 'react';

export interface CheckboxProps {
  /** Checkbox-Name */
  name: string;
  /** Checkbox-Wert */
  value?: string | number;
  /** Checkbox gecheckt */
  checked?: boolean;
  /** Checkbox-Label */
  label?: string;
  /** Checkbox erforderlich */
  required?: boolean;
  /** Checkbox deaktiviert */
  disabled?: boolean;
  /** Checkbox-Größe */
  size?: 'sm' | 'md' | 'lg';
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche Styles */
  style?: React.CSSProperties;
  /** Change-Handler */
  onChange?: (checked: boolean) => void;
  /** Blur-Handler */
  onBlur?: () => void;
  /** Focus-Handler */
  onFocus?: () => void;
  /** Validierungsfehler */
  error?: string;
  /** Hilfetext */
  helpText?: string;
  /** Checkbox mit Switch-Style */
  switch?: boolean;
  /** Checkbox mit Radio-Style */
  radio?: boolean;
  /** Checkbox mit Indeterminate-State */
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  name,
  value,
  checked = false,
  label,
  required = false,
  disabled = false,
  size = 'md',
  className = '',
  style,
  onChange,
  onBlur,
  onFocus,
  error,
  helpText,
  switch: switchStyle = false,
  radio = false,
  indeterminate = false
}, ref) => {
  const inputType = radio ? 'radio' : 'checkbox';
  const baseClasses = switchStyle ? 'form-check form-switch' : 'form-check';
  const sizeClasses = size !== 'md' ? `form-check-${size}` : '';
  const errorClasses = error ? 'is-invalid' : '';
  
  const combinedClasses = [
    baseClasses,
    sizeClasses,
    errorClasses,
    className
  ].filter(Boolean).join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={combinedClasses} style={style}>
      <input
        ref={ref}
        type={inputType}
        id={name}
        name={name}
        value={value}
        checked={checked}
        required={required}
        disabled={disabled}
        className="form-check-input"
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
        {...(indeterminate && { 'data-indeterminate': true })}
      />
      
      {label && (
        <label htmlFor={name} className="form-check-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      {error && (
        <div id={`${name}-error`} className="invalid-feedback">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div id={`${name}-help`} className="form-text">
          {helpText}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default React.memo(Checkbox); 