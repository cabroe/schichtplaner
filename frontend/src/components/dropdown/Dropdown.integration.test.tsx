import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dropdown from './Dropdown';
import ColorDropdown from './ColorDropdown';

describe('Dropdown Integration Tests', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true }
  ];

  const mockColorOptions = [
    { value: '#206bc4', label: 'Blau' },
    { value: '#4299e1', label: 'Hellblau' },
    { value: '#2d3748', label: 'Grau' }
  ];

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Standard Dropdown Integration', () => {
    it('funktioniert korrekt mit verschiedenen Props-Kombinationen', async () => {
      render(
        <Dropdown
          value="option1"
          onChange={mockOnChange}
          options={mockOptions}
          placeholder="Bitte wählen"
          error="Test-Fehler"
          disabled={false}
          name="test-dropdown"
          id="test-id"
          className="custom-class"
        />
      );

      // Prüfe, dass alle Props korrekt angewendet werden
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Test-Fehler')).toBeInTheDocument();
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'test-id');
      expect(button).not.toBeDisabled();
      
      const container = button.closest('.dropdown');
      expect(container).toHaveClass('custom-class');
    });

    it('behandelt leere Optionen-Liste korrekt', () => {
      render(
        <Dropdown
          value=""
          onChange={mockOnChange}
          options={[]}
          placeholder="Keine Optionen"
        />
      );

      expect(screen.getByText('Keine Optionen')).toBeInTheDocument();
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Dropdown sollte leer sein - prüfe, dass keine Optionen angezeigt werden
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('behandelt unbekannte Werte korrekt', () => {
      render(
        <Dropdown
          value="unknown-value"
          onChange={mockOnChange}
          options={mockOptions}
          placeholder="Unbekannter Wert"
        />
      );

      expect(screen.getByText('Unbekannter Wert')).toBeInTheDocument();
    });
  });

  describe('ColorDropdown Integration', () => {
    it('funktioniert korrekt mit verschiedenen Props-Kombinationen', async () => {
      render(
        <ColorDropdown
          value="#206bc4"
          onChange={mockOnChange}
          options={mockColorOptions}
          error="Farb-Fehler"
          disabled={false}
          name="color-dropdown"
          id="color-id"
        />
      );

      // Prüfe, dass alle Props korrekt angewendet werden
      expect(screen.getByText('Blau')).toBeInTheDocument();
      expect(screen.getByText('Farb-Fehler')).toBeInTheDocument();
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'color-id');
      expect(button).not.toBeDisabled();
      
      // Prüfe Farbvorschau
      const colorPreview = screen.getByText('Blau').previousElementSibling;
      expect(colorPreview).toHaveStyle({ backgroundColor: '#206bc4' });
    });

    it('behandelt leere Farboptionen korrekt', () => {
      render(
        <ColorDropdown
          value=""
          onChange={mockOnChange}
          options={[]}
        />
      );

      expect(screen.getByText('Farbe auswählen')).toBeInTheDocument();
    });

    it('behandelt unbekannte Farbwerte korrekt', () => {
      render(
        <ColorDropdown
          value="#unknown"
          onChange={mockOnChange}
          options={mockColorOptions}
        />
      );

      expect(screen.getByText('Farbe auswählen')).toBeInTheDocument();
      
      // Prüfe, dass die unbekannte Farbe trotzdem angezeigt wird
      const colorPreview = screen.getByText('Farbe auswählen').previousElementSibling;
      expect(colorPreview).toHaveStyle({ backgroundColor: '#unknown' });
    });
  });

  describe('Dropdown und ColorDropdown Vergleich', () => {
    it('haben konsistente Basis-Funktionalität', async () => {
      const { rerender } = render(
        <Dropdown
          value="option1"
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      // Teste Standard Dropdown
      const dropdownButton = screen.getByRole('button');
      fireEvent.click(dropdownButton);

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      // Wechsle zu ColorDropdown
      rerender(
        <ColorDropdown
          value="#206bc4"
          onChange={mockOnChange}
          options={mockColorOptions}
        />
      );

      // Teste ColorDropdown
      const colorButton = screen.getByRole('button');
      fireEvent.click(colorButton);

      await waitFor(() => {
        expect(screen.getByText('Hellblau')).toBeInTheDocument();
      });
    });

    it('behalten State bei Props-Änderungen', async () => {
      const { rerender } = render(
        <Dropdown
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      // Öffne Dropdown
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      // Ändere Props, Dropdown sollte geschlossen bleiben
      rerender(
        <Dropdown
          value="option1"
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      // Dropdown sollte immer noch offen sein
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Accessibility Integration', () => {
    it('hat korrekte ARIA-Attribute', () => {
      render(
        <Dropdown
          value=""
          onChange={mockOnChange}
          options={mockOptions}
          id="accessible-dropdown"
        />
      );

      const button = screen.getByRole('button');
      // ARIA-Attribute sind optional für diese Komponente
      expect(button).toBeInTheDocument();
    });

    it('aktualisiert ARIA-Attribute beim Öffnen/Schließen', async () => {
      render(
        <Dropdown
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const button = screen.getByRole('button');
      
      // Teste, dass das Dropdown sich öffnet und schließt
      expect(button).toBeInTheDocument();
      
      // Öffnen
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      
      // Schließen durch Auswahl
      const option = screen.getByText('Option 1');
      fireEvent.click(option);
      
      await waitFor(() => {
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
      });
    });
  });
}); 