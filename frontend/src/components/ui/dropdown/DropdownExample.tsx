import React, { useState } from 'react';
import { Dropdown, ColorDropdown, type DropdownOption } from '.';

const DropdownExample: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedColor, setSelectedColor] = useState('#206bc4');

  // Standard-Optionen
  const standardOptions: DropdownOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
    { value: 'option4', label: 'Option 4' }
  ];

  // Farboptionen
  const colorOptions = [
    { value: '#206bc4', label: 'Blau' },
    { value: '#4299e1', label: 'Hellblau' },
    { value: '#2d3748', label: 'Grau' },
    { value: '#48bb78', label: 'Grün' },
    { value: '#ed8936', label: 'Orange' },
    { value: '#e53e3e', label: 'Rot' }
  ];

  // Custom Render-Funktion für Icons
  const renderIconOption = (option: DropdownOption, isSelected: boolean) => (
    <>
      <i className={`fas fa-${option.value} me-2 ${isSelected ? 'text-primary' : ''}`}></i>
      <span className={isSelected ? 'fw-bold' : ''}>
        {option.label}
      </span>
    </>
  );

  const iconOptions: DropdownOption[] = [
    { value: 'user', label: 'Benutzer' },
    { value: 'cog', label: 'Einstellungen' },
    { value: 'home', label: 'Startseite' },
    { value: 'search', label: 'Suche' }
  ];

  return (
    <div className="container-xl">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dropdown-Komponenten Beispiele</h3>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Standard Dropdown */}
                <div className="col-md-6">
                  <label className="form-label">Standard Dropdown</label>
                  <Dropdown
                    value={selectedOption}
                    onChange={setSelectedOption}
                    options={standardOptions}
                    placeholder="Bitte wählen..."
                    name="standard"
                  />
                  <div className="mt-2">
                    <small className="text-muted">
                      Ausgewählt: {selectedOption || 'Nichts'}
                    </small>
                  </div>
                </div>

                {/* Color Dropdown */}
                <div className="col-md-6">
                  <label className="form-label">Farb-Dropdown</label>
                  <ColorDropdown
                    value={selectedColor}
                    onChange={setSelectedColor}
                    options={colorOptions}
                    name="color"
                  />
                  <div className="mt-2">
                    <small className="text-muted">
                      Ausgewählte Farbe: {selectedColor}
                    </small>
                  </div>
                </div>

                {/* Custom Icon Dropdown */}
                <div className="col-md-6">
                  <label className="form-label">Icon Dropdown (Custom Rendering)</label>
                  <Dropdown
                    value=""
                    onChange={(value) => console.log('Icon selected:', value)}
                    options={iconOptions}
                    placeholder="Icon auswählen..."
                    renderOption={renderIconOption}
                    name="icon"
                  />
                </div>

                {/* Dropdown mit Fehler */}
                <div className="col-md-6">
                  <label className="form-label">Dropdown mit Fehler</label>
                  <Dropdown
                    value=""
                    onChange={() => {}}
                    options={standardOptions}
                    error="Dies ist ein Fehlerbeispiel"
                    name="error"
                  />
                </div>

                {/* Deaktiviertes Dropdown */}
                <div className="col-md-6">
                  <label className="form-label">Deaktiviertes Dropdown</label>
                  <Dropdown
                    value=""
                    onChange={() => {}}
                    options={standardOptions}
                    disabled
                    name="disabled"
                  />
                </div>

                {/* Dropdown mit custom Breite */}
                <div className="col-md-6">
                  <label className="form-label">Dropdown mit custom Breite</label>
                  <Dropdown
                    value=""
                    onChange={() => {}}
                    options={standardOptions}
                    placeholder="Schmale Dropdown..."
                    width="200px"
                    name="custom-width"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownExample; 