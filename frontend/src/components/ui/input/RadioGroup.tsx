import React, { forwardRef } from 'react';

interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  inline?: boolean;
}

/**
 * Wiederverwendbare RadioGroup-Komponente mit Tabler.io Styling
 */
export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(({
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  className = '',
  inline = false,
}, ref) => {
  // Standard onChange-Handler, falls keiner bereitgestellt wird
  const handleChange = onChange || (() => {});

  return (
    <div className={`${inline ? 'd-flex gap-3' : ''} ${className}`}>
      {options.map((option, index) => (
        <div key={option.value} className="form-check">
          <input
            ref={index === 0 ? ref : undefined}
            type="radio"
            name={name}
            id={`${name}-${option.value}`}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            required={required}
            disabled={disabled || option.disabled}
            className={`form-check-input ${error ? 'is-invalid' : ''}`}
          />
          <label className="form-check-label" htmlFor={`${name}-${option.value}`}>
            {option.label}
          </label>
        </div>
      ))}
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup'; 