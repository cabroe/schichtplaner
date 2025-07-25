import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  /** Select-Name */
  name: string;
  /** Select-Wert */
  value?: string | number;
  /** Select-Optionen */
  options: SelectOption[];
  /** Placeholder-Text */
  placeholder?: string;
  /** Select-Label */
  label?: string;
  /** Select erforderlich */
  required?: boolean;
  /** Select deaktiviert */
  disabled?: boolean;
  /** Select mit mehreren Auswahlmöglichkeiten */
  multiple?: boolean;
  /** Select-Größe */
  size?: 'sm' | 'md' | 'lg';
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche Styles */
  style?: React.CSSProperties;
  /** Change-Handler */
  onChange?: (value: string | number | (string | number)[]) => void;
  /** Blur-Handler */
  onBlur?: () => void;
  /** Focus-Handler */
  onFocus?: () => void;
  /** Validierungsfehler */
  error?: string;
  /** Hilfetext */
  helpText?: string;
  /** Select mit Suche */
  searchable?: boolean;
  /** Select mit Tags */
  tags?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  name,
  value,
  options,
  placeholder,
  label,
  required = false,
  disabled = false,
  multiple = false,
  size = 'md',
  className = '',
  style,
  onChange,
  onBlur,
  onFocus,
  error,
  helpText,
  searchable = false,
  tags = false
}, ref) => {
  const baseClasses = 'form-select';
  const sizeClasses = size !== 'md' ? `form-select-${size}` : '';
  const errorClasses = error ? 'is-invalid' : '';
  const searchableClasses = searchable ? 'form-select-searchable' : '';
  const tagsClasses = tags ? 'form-select-tags' : '';
  
  const combinedClasses = [
    baseClasses,
    sizeClasses,
    errorClasses,
    searchableClasses,
    tagsClasses,
    className
  ].filter(Boolean).join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      if (multiple) {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        onChange(selectedOptions);
      } else {
        onChange(e.target.value);
      }
    }
  };

  const groupedOptions = options.reduce((groups, option) => {
    if (option.group) {
      if (!groups[option.group]) {
        groups[option.group] = [];
      }
      groups[option.group].push(option);
    } else {
      if (!groups.default) {
        groups.default = [];
      }
      groups.default.push(option);
    }
    return groups;
  }, {} as Record<string, SelectOption[]>);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={name}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        multiple={multiple}
        className={combinedClasses}
        style={style}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
      >
        {placeholder && !multiple && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
          <React.Fragment key={groupName}>
            {groupName !== 'default' && (
              <optgroup label={groupName}>
                {groupOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            )}
            {groupName === 'default' && groupOptions.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </React.Fragment>
        ))}
      </select>
      
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

Select.displayName = 'Select';

export default React.memo(Select); 