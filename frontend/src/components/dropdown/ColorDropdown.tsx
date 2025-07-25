import React from 'react';
import Dropdown, { type DropdownOption } from './Dropdown';

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
 * Verwendet die allgemeine Dropdown-Komponente mit custom Rendering
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
  id
}) => {
  // Konvertiere ColorOption zu DropdownOption
  const dropdownOptions: DropdownOption[] = options.map(option => ({
    value: option.value,
    label: option.label
  }));

  // Custom Render-Funktion für Farboptionen
  const renderColorOption = (option: DropdownOption, isSelected: boolean) => (
    <>
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
      <span className={isSelected ? 'fw-bold' : ''}>
        {option.label}
      </span>
    </>
  );

  // Custom Render-Funktion für ausgewählte Farbe
  const renderSelectedColor = (option: DropdownOption | undefined) => (
    <>
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
        {option?.label || 'Farbe auswählen'}
      </span>
    </>
  );

  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={dropdownOptions}
      placeholder="Farbe auswählen"
      error={error}
      disabled={disabled}
      name={name}
      id={id}
      renderOption={renderColorOption}
      renderSelected={renderSelectedColor}
    />
  );
};

export default ColorDropdown; 