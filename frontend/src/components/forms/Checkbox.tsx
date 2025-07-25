import React, { forwardRef } from 'react';

interface CheckboxProps {
  name: string;
  id?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  value?: string;
  title?: string;
}

/**
 * Wiederverwendbare Checkbox-Komponente mit Tabler.io Styling und HTML5-Validierung
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  name,
  id,
  checked,
  onChange,
  label,
  required = false,
  disabled = false,
  error,
  className = '',
  value = 'on',
  title,
}, ref) => {
  return (
    <div className={`form-check ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        name={name}
        id={id || name}
        checked={checked}
        onChange={onChange}
        required={required}
        disabled={disabled}
        value={value}
        title={title || (required ? 'Dieses Feld ist erforderlich' : undefined)}
        className={`form-check-input ${error ? 'is-invalid' : ''}`}
      />
      {label && (
        <label className="form-check-label" htmlFor={id || name}>
          {label}
        </label>
      )}
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox'; 