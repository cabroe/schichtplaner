import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dropdown from './Dropdown';
import ColorDropdown from './ColorDropdown';

describe('Dropdown Usage Examples', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Standard Dropdown Verwendung', () => {
    it('funktioniert als Sprachauswahl', async () => {
      const languageOptions = [
        { value: 'de', label: 'Deutsch' },
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' }
      ];

      render(
        <Dropdown
          value="de"
          onChange={mockOnChange}
          options={languageOptions}
          placeholder="Sprache auswählen"
          name="language"
        />
      );

      expect(screen.getByText('Deutsch')).toBeInTheDocument();
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('English')).toBeInTheDocument();
        expect(screen.getByText('Français')).toBeInTheDocument();
      });

      // Wähle Englisch aus
      const englishOption = screen.getByText('English');
      fireEvent.click(englishOption);

      expect(mockOnChange).toHaveBeenCalledWith('en');
    });

    it('funktioniert als Rollenauswahl', async () => {
      const roleOptions = [
        { value: 'user', label: 'Benutzer' },
        { value: 'admin', label: 'Administrator' },
        { value: 'manager', label: 'Manager', disabled: true }
      ];

      render(
        <Dropdown
          value=""
          onChange={mockOnChange}
          options={roleOptions}
          placeholder="Rolle auswählen"
          error="Bitte wählen Sie eine Rolle"
        />
      );

      expect(screen.getByText('Rolle auswählen')).toBeInTheDocument();
      expect(screen.getByText('Bitte wählen Sie eine Rolle')).toBeInTheDocument();
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Benutzer')).toBeInTheDocument();
        expect(screen.getByText('Administrator')).toBeInTheDocument();
        expect(screen.getByText('Manager')).toBeInTheDocument();
      });

      // Manager sollte deaktiviert sein
      const managerOption = screen.getByText('Manager');
      expect(managerOption.closest('button')).toBeDisabled();
    });

    it('funktioniert mit custom Rendering für Icons', async () => {
      const iconOptions = [
        { value: 'user', label: 'Benutzer' },
        { value: 'cog', label: 'Einstellungen' },
        { value: 'home', label: 'Startseite' }
      ];

      const renderIconOption = (option: any, isSelected: boolean) => (
        <>
          <i className={`fas fa-${option.value} me-2 ${isSelected ? 'text-primary' : ''}`}></i>
          <span className={isSelected ? 'fw-bold' : ''}>
            {option.label}
          </span>
        </>
      );

      render(
        <Dropdown
          value=""
          onChange={mockOnChange}
          options={iconOptions}
          placeholder="Icon auswählen"
          renderOption={renderIconOption}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Benutzer')).toBeInTheDocument();
        expect(screen.getByText('Einstellungen')).toBeInTheDocument();
      });
    });
  });

  describe('ColorDropdown Verwendung', () => {
    it('funktioniert als Benutzerfarben-Auswahl', async () => {
      const userColorOptions = [
        { value: '#206bc4', label: 'Blau' },
        { value: '#4299e1', label: 'Hellblau' },
        { value: '#2d3748', label: 'Grau' },
        { value: '#48bb78', label: 'Grün' },
        { value: '#ed8936', label: 'Orange' },
        { value: '#e53e3e', label: 'Rot' }
      ];

      render(
        <ColorDropdown
          value="#206bc4"
          onChange={mockOnChange}
          options={userColorOptions}
          name="user-color"
        />
      );

      expect(screen.getByText('Blau')).toBeInTheDocument();
      
      // Prüfe Farbvorschau
      const colorPreview = screen.getByText('Blau').previousElementSibling;
      expect(colorPreview).toHaveStyle({ backgroundColor: '#206bc4' });
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Hellblau')).toBeInTheDocument();
        expect(screen.getByText('Grün')).toBeInTheDocument();
      });

      // Wähle eine andere Farbe
      const greenOption = screen.getByText('Grün');
      fireEvent.click(greenOption);

      expect(mockOnChange).toHaveBeenCalledWith('#48bb78');
    });

    it('funktioniert als Theme-Auswahl', async () => {
      const themeOptions = [
        { value: '#ffffff', label: 'Hell' },
        { value: '#1a1a1a', label: 'Dunkel' },
        { value: '#f0f0f0', label: 'Grau' }
      ];

      render(
        <ColorDropdown
          value="#ffffff"
          onChange={mockOnChange}
          options={themeOptions}
        />
      );

      expect(screen.getByText('Hell')).toBeInTheDocument();
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Dunkel')).toBeInTheDocument();
        expect(screen.getByText('Grau')).toBeInTheDocument();
      });
    });
  });

  describe('Kombinierte Verwendung', () => {
    it('funktioniert in einem Formular-Kontext', async () => {
      const roleOptions = [
        { value: 'user', label: 'Benutzer' },
        { value: 'admin', label: 'Administrator' }
      ];

      const colorOptions = [
        { value: '#206bc4', label: 'Blau' },
        { value: '#48bb78', label: 'Grün' }
      ];

      render(
        <div>
          <label>Rolle:</label>
          <Dropdown
            value=""
            onChange={mockOnChange}
            options={roleOptions}
            placeholder="Rolle auswählen"
            name="role"
          />
          
          <label>Farbe:</label>
          <ColorDropdown
            value="#206bc4"
            onChange={mockOnChange}
            options={colorOptions}
            name="color"
          />
        </div>
      );

      // Teste beide Dropdowns
      const dropdowns = screen.getAllByRole('button');
      expect(dropdowns).toHaveLength(2);

      // Öffne erstes Dropdown
      fireEvent.click(dropdowns[0]);
      await waitFor(() => {
        expect(screen.getByText('Benutzer')).toBeInTheDocument();
      });

      // Öffne zweites Dropdown
      fireEvent.click(dropdowns[1]);
      await waitFor(() => {
        expect(screen.getByText('Grün')).toBeInTheDocument();
      });
    });

    it('behandelt mehrere Dropdowns korrekt', async () => {
      const options1 = [{ value: 'a', label: 'Option A' }];
      const options2 = [{ value: 'b', label: 'Option B' }];

      render(
        <div>
          <Dropdown value="" onChange={mockOnChange} options={options1} />
          <Dropdown value="" onChange={mockOnChange} options={options2} />
        </div>
      );

      const buttons = screen.getAllByRole('button');
      
      // Öffne erstes Dropdown
      fireEvent.click(buttons[0]);
      await waitFor(() => {
        expect(screen.getByText('Option A')).toBeInTheDocument();
      });

      // Öffne zweites Dropdown
      fireEvent.click(buttons[1]);
      await waitFor(() => {
        expect(screen.getByText('Option B')).toBeInTheDocument();
      });
      
      // Beide Dropdowns können gleichzeitig offen sein
      expect(screen.getByText('Option A')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('behandelt sehr lange Labels korrekt', () => {
      const longOptions = [
        { value: 'long', label: 'Dies ist ein sehr langer Text der über mehrere Zeilen gehen könnte und trotzdem korrekt angezeigt werden sollte' }
      ];

      render(
        <Dropdown
          value=""
          onChange={mockOnChange}
          options={longOptions}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(/Dies ist ein sehr langer Text/)).toBeInTheDocument();
    });

    it('behandelt Sonderzeichen in Labels korrekt', () => {
      const specialOptions = [
        { value: 'special', label: 'Sonderzeichen: äöüß & < > " \' @ # $ % ^ * ( )' }
      ];

      render(
        <Dropdown
          value=""
          onChange={mockOnChange}
          options={specialOptions}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(/Sonderzeichen: äöüß/)).toBeInTheDocument();
    });

    it('behandelt leere Werte korrekt', () => {
      const emptyOptions = [
        { value: '', label: 'Leerer Wert' },
        { value: 'valid', label: 'Gültiger Wert' }
      ];

      render(
        <Dropdown
          value=""
          onChange={mockOnChange}
          options={emptyOptions}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const emptyValueOptions = screen.getAllByText('Leerer Wert');
      expect(emptyValueOptions).toHaveLength(2); // Einer im Button, einer im Dropdown
    });
  });
}); 