import React, { forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  name: string;
  id?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  multiple?: boolean;
  size?: number;
  title?: string;
}

/**
 * Wiederverwendbare Select-Komponente mit Tabler.io Styling und HTML5-Validierung
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  name,
  id,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  multiple = false,
  size,
  title,
}, ref) => {
  return (
    <select
      ref={ref}
      name={name}
      id={id || name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      multiple={multiple}
      size={size}
      title={title || (required ? 'Bitte wählen Sie eine Option aus' : undefined)}
      className={`form-select ${error ? 'is-invalid' : ''} ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = 'Select'; 