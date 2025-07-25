import React, { forwardRef } from 'react';

export interface FormFieldProps {
  label?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'select' | 'checkbox' | 'radio';
  value?: string | number;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  // Input-spezifische Props
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  minLength?: number;
  maxLength?: number;
  title?: string;
  // Select-spezifische Props
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  // Textarea-spezifische Props
  rows?: number;
  cols?: number;
  // Layout
  horizontal?: boolean;
  labelWidth?: string;
}

/**
 * Wiederverwendbare FormField-Komponente mit Tabler.io Styling
 */
export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, FormFieldProps>(({
  label,
  name,
  type = 'text',
  value,
  checked,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  helpText,
  className = '',
  labelClassName = '',
  inputClassName = '',
  min,
  max,
  step,
  pattern,
  autoComplete,
  autoFocus,
  minLength,
  maxLength,
  title,
  options = [],
  rows = 3,
  cols,
  horizontal = false,
  labelWidth = 'auto'
}, ref) => {
  const fieldId = `field-${name}`;
  const hasError = !!error;
  const isRequired = required;

  const renderInput = () => {
    const commonProps = {
      id: fieldId,
      name,
      value,
      onChange,
      placeholder,
      required: isRequired,
      disabled,
      readOnly,
      autoComplete,
      autoFocus,
      title,
      className: `form-control ${hasError ? 'is-invalid' : ''} ${inputClassName}`
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            cols={cols}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            ref={ref as React.Ref<HTMLSelectElement>}
          >
            <option value="">{placeholder || 'Bitte wählen...'}</option>
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

      case 'checkbox':
        return (
          <div className="form-check">
            <input
              {...commonProps}
              type="checkbox"
              checked={checked}
              className={`form-check-input ${hasError ? 'is-invalid' : ''} ${inputClassName}`}
              ref={ref as React.Ref<HTMLInputElement>}
            />
            {label && (
              <label className="form-check-label" htmlFor={fieldId}>
                {label}
              </label>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="form-check">
            <input
              {...commonProps}
              type="radio"
              checked={checked}
              className={`form-check-input ${hasError ? 'is-invalid' : ''} ${inputClassName}`}
              ref={ref as React.Ref<HTMLInputElement>}
            />
            {label && (
              <label className="form-check-label" htmlFor={fieldId}>
                {label}
              </label>
            )}
          </div>
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            minLength={minLength}
            maxLength={maxLength}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        );
    }
  };

  const renderLabel = () => {
    if (!label || type === 'checkbox' || type === 'radio') return null;
    
    return (
      <label 
        htmlFor={fieldId} 
        className={`form-label ${isRequired ? 'required' : ''} ${labelClassName}`}
        style={horizontal && labelWidth !== 'auto' ? { width: labelWidth } : undefined}
      >
        {label}
      </label>
    );
  };

  const renderError = () => {
    if (!hasError) return null;
    
    return (
      <div className="invalid-feedback">
        {error}
      </div>
    );
  };

  const renderHelpText = () => {
    if (!helpText) return null;
    
    return (
      <div className="form-text">
        {helpText}
      </div>
    );
  };

  if (horizontal) {
    return (
      <div className={`row mb-3 ${className}`}>
        <div className="col-sm-3">
          {renderLabel()}
        </div>
        <div className="col-sm-9">
          {renderInput()}
          {renderError()}
          {renderHelpText()}
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-3 ${className}`}>
      {renderLabel()}
      {renderInput()}
      {renderError()}
      {renderHelpText()}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField; 