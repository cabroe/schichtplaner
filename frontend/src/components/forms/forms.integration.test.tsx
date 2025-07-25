import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as FormsModule from './index';
import { Dropdown, ColorDropdown } from '../ui';

describe('Forms Module Integration Tests', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];

  const mockColorOptions = [
    { value: '#206bc4', label: 'Blau' },
    { value: '#4299e1', label: 'Hellblau' }
  ];

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Forms Module Exports', () => {
    it('exportiert Dropdown-Komponenten aus forms-Modul', () => {
      expect(FormsModule.Dropdown).toBeDefined();
      expect(FormsModule.ColorDropdown).toBeDefined();
    });

    it('exportiert Dropdown-Komponenten korrekt', () => {
      expect(FormsModule.Dropdown).toBe(Dropdown);
      expect(FormsModule.ColorDropdown).toBe(ColorDropdown);
    });

    it('exportiert alle erwarteten Komponenten', () => {
      const expectedExports = [
        'Form',
        'FormGroup',
        'Input',
        'Textarea',
        'Select',
        'Checkbox',
        'RadioGroup',
        'Dropdown',
        'ColorDropdown'
      ];

      expectedExports.forEach(exportName => {
        expect(FormsModule).toHaveProperty(exportName);
      });
    });
  });

  describe('Dropdown Integration in Forms', () => {
    it('funktioniert korrekt als Teil des forms-Moduls', async () => {
      render(
        <FormsModule.Dropdown
          value=""
          onChange={mockOnChange}
          options={mockOptions}
          placeholder="Test Dropdown"
        />
      );

      expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('ColorDropdown funktioniert korrekt als Teil des forms-Moduls', async () => {
      render(
        <FormsModule.ColorDropdown
          value="#206bc4"
          onChange={mockOnChange}
          options={mockColorOptions}
        />
      );

      expect(screen.getByText('Blau')).toBeInTheDocument();
      
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Hellblau')).toBeInTheDocument();
      });
    });
  });

  describe('Forms Module Default Export', () => {
    it('hat korrekte Default-Export-Struktur', () => {
      const defaultExport = FormsModule.default;
      
      expect(defaultExport).toBeDefined();
      expect(typeof defaultExport).toBe('object');
      
      // Prüfe, dass alle Komponenten im Default-Export vorhanden sind
      expect(defaultExport).toHaveProperty('Dropdown');
      expect(defaultExport).toHaveProperty('ColorDropdown');
      expect(defaultExport).toHaveProperty('Form');
      expect(defaultExport).toHaveProperty('Input');
    });

    it('ermöglicht Destructuring aus Default-Export', () => {
      const { Dropdown: DefaultDropdown, ColorDropdown: DefaultColorDropdown } = FormsModule.default;
      
      expect(DefaultDropdown).toBe(Dropdown);
      expect(DefaultColorDropdown).toBe(ColorDropdown);
    });
  });

  describe('Import-Kompatibilität', () => {
    it('unterstützt verschiedene Import-Methoden', () => {
      // Named imports
      expect(FormsModule.Dropdown).toBe(Dropdown);
      expect(FormsModule.ColorDropdown).toBe(ColorDropdown);

      // Default export destructuring
      const { Dropdown: DefaultDropdown } = FormsModule.default;
      expect(DefaultDropdown).toBe(Dropdown);
    });

    it('behält Funktionalität bei verschiedenen Import-Methoden', async () => {
      // Teste mit Named Import
      const { rerender } = render(
        <FormsModule.Dropdown
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      const button1 = screen.getByRole('button');
      fireEvent.click(button1);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      // Teste mit Default Export
      rerender(
        <FormsModule.default.Dropdown
          value=""
          onChange={mockOnChange}
          options={mockOptions}
        />
      );

      // Prüfe, dass die Komponente korrekt gerendert wird
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
}); 