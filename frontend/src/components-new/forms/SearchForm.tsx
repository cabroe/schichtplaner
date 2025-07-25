import React, { useState, useCallback } from 'react';
import { Button } from '../ui/Button';
import Input from './Input';
import Select from './Select';

export interface SearchField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange' | 'number';
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface SearchFormProps {
  id?: string;
  fields: SearchField[];
  onSubmit: (values: Record<string, any>) => void;
  onReset?: () => void;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  compact?: boolean;
  inline?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = React.memo(({
  id,
  fields,
  onSubmit,
  onReset,
  loading = false,
  className = '',
  style,
  submitText = 'Suchen',
  resetText = 'Zurücksetzen',
  showReset = true,
  compact = false,
  inline = false
}) => {
  const [values, setValues] = useState<Record<string, any>>({});

  const handleChange = useCallback((name: string, value: string | number | (string | number)[]) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  }, [values, onSubmit]);

  const handleReset = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setValues({});
    onReset?.();
  }, [onReset]);

  const getFormClasses = () => {
    const classes = [
      'border rounded p-3',
      inline ? 'd-flex align-items-end' : '',
      compact ? 'p-2' : '',
      className
    ].filter(Boolean);
    return classes.join(' ');
  };

  const getRowClasses = () => {
    const classes = [
      'row',
      inline ? 'align-items-end' : 'g-3',
      compact ? 'g-2' : ''
    ].filter(Boolean);
    return classes.join(' ');
  };

  const getFieldClasses = (field: SearchField) => {
    const classes = [
      inline ? 'col-auto' : 'col-12 col-md-6 col-lg-4',
      field.className || ''
    ].filter(Boolean);
    return classes.join(' ');
  };

  const renderField = (field: SearchField) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      disabled: field.disabled || loading,
      value: values[field.name] || '',
      onChange: (value: string | number | (string | number)[]) => handleChange(field.name, value),
      className: getFieldClasses(field)
    };

    switch (field.type) {
      case 'select':
        return (
          <Select
            {...commonProps}
            options={field.options || []}
          />
        );

      case 'date':
        return (
          <Input
            {...commonProps}
            type="date"
          />
        );

      case 'daterange':
        return (
          <div className={getFieldClasses(field)}>
            <label className="form-label">{field.label}</label>
            <div className="input-group">
              <Input
                name={`${field.name}_start`}
                type="date"
                placeholder="Von"
                value={values[`${field.name}_start`] || ''}
                onChange={(value) => handleChange(`${field.name}_start`, value)}
                disabled={field.disabled || loading}
              />
              <span className="input-group-text">bis</span>
              <Input
                name={`${field.name}_end`}
                type="date"
                placeholder="Bis"
                value={values[`${field.name}_end`] || ''}
                onChange={(value) => handleChange(`${field.name}_end`, value)}
                disabled={field.disabled || loading}
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            type="text"
          />
        );
    }
  };

  const renderActions = () => {
    return (
      <div className={inline ? 'col-auto' : 'col-12'}>
        <div className="d-flex gap-2">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            loading={loading}
          >
            <i className="fas fa-search me-1" />
            {submitText}
          </Button>
          
          {showReset && (
            <Button
              type="button"
              variant="outline-secondary"
              onClick={handleReset}
              disabled={loading}
            >
              <i className="fas fa-undo me-1" />
              {resetText}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <form
      id={id}
      className={getFormClasses()}
      style={style}
      onSubmit={handleSubmit}
    >
      <div className={getRowClasses()}>
        {fields.map((field) => (
          <div key={field.name}>
            {renderField(field)}
          </div>
        ))}
        {renderActions()}
      </div>
    </form>
  );
});

SearchForm.displayName = 'SearchForm';

export default SearchForm; 