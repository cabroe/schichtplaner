import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  renderOption?: (option: DropdownOption, isSelected: boolean) => ReactNode;
  renderSelected?: (option: DropdownOption | undefined) => ReactNode;
  maxHeight?: string;
  width?: string;
}

/**
 * Allgemeine Dropdown-Komponente mit Tabler.io Styling
 * 
 * @param value - Aktuell ausgewählter Wert
 * @param onChange - Callback-Funktion, die bei Wertänderung aufgerufen wird
 * @param options - Verfügbare Optionen
 * @param placeholder - Platzhaltertext, wenn nichts ausgewählt ist
 * @param error - Fehlermeldung, falls vorhanden
 * @param disabled - Gibt an, ob das Dropdown deaktiviert ist
 * @param name - Name des Formularfelds
 * @param id - ID des Formularfelds
 * @param className - Zusätzliche CSS-Klassen
 * @param renderOption - Custom Render-Funktion für Optionen
 * @param renderSelected - Custom Render-Funktion für ausgewählten Wert
 * @param maxHeight - Maximale Höhe des Dropdown-Menüs
 * @param width - Breite des Dropdown-Menüs
 */
export const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Auswählen...',
  error,
  disabled = false,
  name,
  id,
  className = '',
  renderOption,
  renderSelected,
  maxHeight = '250px',
  width = '100%'
}) => {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Schließe das Dropdown, wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Finde die ausgewählte Option
  const selectedOption = options.find(option => option.value === value);
  
  // Standard-Render-Funktionen
  const defaultRenderOption = (option: DropdownOption, isSelected: boolean) => (
    <span className={isSelected ? 'fw-bold' : ''}>
      {option.label}
    </span>
  );

  const defaultRenderSelected = (option: DropdownOption | undefined) => (
    <span>
      {option?.label || placeholder}
    </span>
  );

  const handleOptionClick = (option: DropdownOption) => {
    if (!option.disabled) {
      onChange(option.value);
      setShow(false);
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={`dropdown ${error ? 'is-invalid' : ''} ${className}`}
    >
      <button
        type="button"
        className="form-select d-flex align-items-center justify-content-between"
        disabled={disabled}
        onClick={() => setShow(!show)}
        style={{ 
          textAlign: 'left',
          borderColor: error ? '#d63939' : undefined,
        }}
        id={id}
      >
        <div className="d-flex align-items-center">
          {renderSelected ? renderSelected(selectedOption) : defaultRenderSelected(selectedOption)}
        </div>
        <i className={`fas fa-chevron-down ms-auto ${show ? 'rotate-180' : ''}`}></i>
      </button>

      {show && (
        <div 
          className="dropdown-menu show" 
          style={{ 
            width, 
            maxHeight, 
            overflowY: 'auto',
            zIndex: 1050
          }}
        >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              className={`dropdown-item d-flex align-items-center ${
                option.disabled ? 'disabled' : ''
              } ${option.value === value ? 'active' : ''}`}
              onClick={() => handleOptionClick(option)}
              disabled={option.disabled}
            >
              {renderOption ? renderOption(option, option.value === value) : defaultRenderOption(option, option.value === value)}
            </button>
          ))}
        </div>
      )}
      
      {/* Verstecktes Input-Feld für Formular-Submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
        />
      )}

      {/* Error-Message */}
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dropdown; 