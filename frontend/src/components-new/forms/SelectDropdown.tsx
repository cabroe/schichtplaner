import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { createPortal } from 'react-dom';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
  data?: Record<string, any>;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
  disabled?: boolean;
}

export interface SelectDropdownProps {
  id?: string;
  name?: string;
  value?: string | number | (string | number)[];
  options: SelectOption[] | SelectGroup[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  maxOptions?: number;
  className?: string;
  style?: React.CSSProperties;
  error?: string;
  helpText?: string;
  onChange?: (value: string | number | (string | number)[]) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onCreate?: (value: string) => void;
}

const SelectDropdown = forwardRef<HTMLDivElement, SelectDropdownProps>(({
  id,
  name,
  value,
  options,
  placeholder = 'Bitte wählen...',
  label,
  required = false,
  disabled = false,
  multiple = false,
  searchable = true,
  clearable = true,
  className = '',
  style,
  error,
  helpText,
  onChange,
  onBlur,
  onFocus,
  onCreate
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize selected values from props
  useEffect(() => {
    if (value !== undefined) {
      const values = Array.isArray(value) ? value : [value];
      setSelectedValues(values);
    }
  }, [value]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen, disabled]);

  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      onBlur?.();
    }
  }, [onBlur]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      onBlur?.();
    }
  }, [onBlur]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleOutsideClick, handleKeyDown]);

  const handleOptionClick = useCallback((optionValue: string | number) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      
      setSelectedValues(newValues);
      onChange?.(newValues);
    } else {
      setSelectedValues([optionValue]);
      onChange?.(optionValue);
      setIsOpen(false);
    }
  }, [multiple, selectedValues, onChange]);

  const handleClear = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedValues([]);
    onChange?.(multiple ? [] : '');
  }, [multiple, onChange]);

  const handleCreate = useCallback(() => {
    if (searchValue.trim() && onCreate) {
      onCreate(searchValue.trim());
      setSearchValue('');
    }
  }, [searchValue, onCreate]);

  const getOptionLabel = useCallback((optionValue: string | number) => {
    const findOption = (opts: SelectOption[]): SelectOption | undefined => {
      return opts.find(opt => opt.value === optionValue);
    };

    if (Array.isArray(options) && options.length > 0) {
      if ('options' in options[0]) {
        // Grouped options
        for (const group of options as SelectGroup[]) {
          const option = findOption(group.options);
          if (option) return option;
        }
      } else {
        // Flat options
        const option = findOption(options as SelectOption[]);
        if (option) return option;
      }
    }
    return { value: optionValue, label: String(optionValue) };
  }, [options]);

  const getFilteredOptions = useCallback(() => {
    if (!searchValue.trim()) return options;

    const filterOptions = (opts: SelectOption[]): SelectOption[] => {
      return opts.filter(opt => 
        opt.label.toLowerCase().includes(searchValue.toLowerCase())
      );
    };

    if (Array.isArray(options) && options.length > 0) {
      if ('options' in options[0]) {
        // Grouped options
        return (options as SelectGroup[]).map(group => ({
          ...group,
          options: filterOptions(group.options)
        })).filter(group => group.options.length > 0);
      } else {
        // Flat options
        return filterOptions(options as SelectOption[]);
      }
    }
    return options;
  }, [options, searchValue]);

  const renderOptions = () => {
    const filteredOptions = getFilteredOptions();
    
    if (Array.isArray(filteredOptions) && filteredOptions.length > 0) {
      if ('options' in filteredOptions[0]) {
        // Render grouped options
        return (filteredOptions as SelectGroup[]).map((group, groupIndex) => (
          <div key={`group-${groupIndex}`}>
            <div className="dropdown-header">{group.label}</div>
            {group.options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`dropdown-item ${selectedValues.includes(option.value) ? 'active' : ''} ${option.disabled ? 'disabled' : ''}`}
                onClick={() => !option.disabled && handleOptionClick(option.value)}
                disabled={option.disabled}
              >
                {option.icon && <i className={`me-2 ${option.icon}`} />}
                {option.label}
              </button>
            ))}
          </div>
        ));
      } else {
        // Render flat options
        return (filteredOptions as SelectOption[]).map((option) => (
          <button
            key={option.value}
            type="button"
            className={`dropdown-item ${selectedValues.includes(option.value) ? 'active' : ''} ${option.disabled ? 'disabled' : ''}`}
            onClick={() => !option.disabled && handleOptionClick(option.value)}
            disabled={option.disabled}
          >
            {option.icon && <i className={`me-2 ${option.icon}`} />}
            {option.label}
          </button>
        ));
      }
    }

    return (
      <div className="dropdown-item disabled">
        {searchable && searchValue ? 'Keine Ergebnisse gefunden' : 'Keine Optionen verfügbar'}
      </div>
    );
  };

  const renderSelectedItems = () => {
    if (selectedValues.length === 0) {
      return <span className="text-muted">{placeholder}</span>;
    }

    if (multiple) {
      return selectedValues.map((value) => {
        const option = getOptionLabel(value);
        return (
          <span key={value} className="badge bg-primary me-1">
            {option.label}
            <button
              type="button"
              className="btn-close btn-close-white ms-1"
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(value);
              }}
            />
          </span>
        );
      });
    }

    const option = getOptionLabel(selectedValues[0]);
    return option.label;
  };

  return (
    <div
      ref={ref}
      className={`form-group ${className}`}
      style={style}
    >
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <div
        ref={containerRef}
        className={`position-relative ${isOpen ? 'show' : ''} ${disabled ? 'opacity-50' : ''} ${error ? 'is-invalid' : ''}`}
      >
        <div
          className="form-select"
          onClick={handleToggle}
          onFocus={onFocus}
        >
          <div className="d-flex align-items-center justify-content-between">
            {renderSelectedItems()}
          </div>
          <div className="d-flex align-items-center">
            {clearable && selectedValues.length > 0 && (
              <button
                type="button"
                className="btn-close"
                onClick={handleClear}
                aria-label="Löschen"
              />
            )}
            <i className={`fas fa-chevron-down ${isOpen ? 'rotate' : ''}`} />
          </div>
        </div>

        {isOpen && createPortal(
          <div
            ref={dropdownRef}
            className="dropdown-menu show"
            style={{
              position: 'absolute',
              top: containerRef.current?.getBoundingClientRect().bottom || 0,
              left: containerRef.current?.getBoundingClientRect().left || 0,
              width: containerRef.current?.offsetWidth || 'auto',
              zIndex: 1000
            }}
          >
            {searchable && (
              <div className="p-2 border-bottom">
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control"
                  placeholder="Suchen..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && onCreate) {
                      handleCreate();
                    }
                  }}
                />
              </div>
            )}
            
            <div className="p-0">
              {renderOptions()}
            </div>

            {onCreate && searchValue.trim() && (
              <div className="border-top">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleCreate}
                >
                  <i className="fas fa-plus me-2" />
                  "{searchValue}" erstellen
                </button>
              </div>
            )}
          </div>,
          document.body
        )}
      </div>

      {error && <div className="invalid-feedback">{error}</div>}
      {helpText && <div className="form-text">{helpText}</div>}
      
      <input
        type="hidden"
        name={name}
        value={multiple ? selectedValues.join(',') : selectedValues[0] || ''}
        required={required}
      />
    </div>
  );
});

SelectDropdown.displayName = 'SelectDropdown';

export default SelectDropdown; 