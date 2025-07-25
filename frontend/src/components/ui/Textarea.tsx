import React, { forwardRef } from 'react';

interface TextareaProps {
  name: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  className?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  title?: string;
}

/**
 * Wiederverwendbare Textarea-Komponente mit Tabler.io Styling und HTML5-Validierung
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
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
  rows = 3,
  cols,
  maxLength,
  autoComplete,
  autoFocus,
  title,
}, ref) => {
  return (
    <textarea
      ref={ref}
      name={name}
      id={id || name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      rows={rows}
      cols={cols}
      maxLength={maxLength}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      title={title}
      className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
    />
  );
});

Textarea.displayName = 'Textarea'; 