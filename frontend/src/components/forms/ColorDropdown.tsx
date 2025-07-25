import React, { useState, useRef, useEffect } from 'react';

interface ColorOption {
  value: string;
  label: string;
}

interface ColorDropdownProps {
  value: string;
  onChange: (color: string) => void;
  options: ColorOption[];
  error?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
}

/**
 * Dropdown-Komponente für die Farbauswahl mit Tabler.io Styling
 * 
 * @param value - Aktuell ausgewählte Farbe
 * @param onChange - Callback-Funktion, die bei Farbänderung aufgerufen wird
 * @param options - Verfügbare Farboptionen
 * @param error - Fehlermeldung, falls vorhanden
 * @param disabled - Gibt an, ob das Dropdown deaktiviert ist
 * @param name - Name des Formularfelds
 * @param id - ID des Formularfelds
 */
export const ColorDropdown: React.FC<ColorDropdownProps> = ({
  value,
  onChange,
  options,
  error,
  disabled = false,
  name,
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
  
  // Finde das Label für den aktuellen Wert
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <div 
      ref={dropdownRef}
      className={`dropdown ${error ? 'is-invalid' : ''}`}
    >
      <button
        type="button"
        className="form-select d-flex align-items-center"
        disabled={disabled}
        onClick={() => setShow(!show)}
        style={{ 
          textAlign: 'left',
          borderColor: error ? '#d63939' : undefined,
        }}
      >
        <span 
          className="color-preview me-2" 
          style={{ 
            display: 'inline-block',
            width: '20px',
            height: '20px',
            backgroundColor: value,
            borderRadius: '3px'
          }}
        ></span>
        <span>
          {selectedOption?.label || 'Farbe auswählen'}
        </span>
      </button>

      {show && (
        <div className="dropdown-menu show" style={{ width: '100%', maxHeight: '250px', overflowY: 'auto' }}>
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              className="dropdown-item d-flex align-items-center"
              onClick={() => {
                onChange(option.value);
                setShow(false);
              }}
            >
              <span 
                className="color-preview me-2" 
                style={{ 
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  backgroundColor: option.value,
                  borderRadius: '3px'
                }}
              ></span>
              <span>{option.label}</span>
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
    </div>
  );
}; 