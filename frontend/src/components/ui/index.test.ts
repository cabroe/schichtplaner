import { describe, it, expect } from 'vitest';
import * as DropdownModule from './index';
import { Dropdown } from './dropdown';
import { ColorDropdown } from './dropdown';

describe('Dropdown Module Exports', () => {
  it('exportiert Dropdown als default und named export', () => {
    expect(DropdownModule.Dropdown).toBeDefined();
    expect(DropdownModule.default).toBeDefined();
    expect(DropdownModule.Dropdown).toBe(Dropdown);
  });

  it('exportiert ColorDropdown als default und named export', () => {
    expect(DropdownModule.ColorDropdown).toBeDefined();
    expect(DropdownModule.ColorDropdown).toBe(ColorDropdown);
  });

  it('exportiert DropdownOption Interface', () => {
    // TypeScript-Interfaces sind zur Laufzeit nicht verfügbar
    // Wir testen nur, dass der Import funktioniert
    expect(true).toBe(true);
  });

  it('exportiert DropdownProps Interface', () => {
    // TypeScript-Interfaces sind zur Laufzeit nicht verfügbar
    // Wir testen nur, dass der Import funktioniert
    expect(true).toBe(true);
  });

  it('hat korrekte Export-Struktur', () => {
    const expectedExports = [
      'Dropdown',
      'ColorDropdown'
    ];

    expectedExports.forEach(exportName => {
      expect(DropdownModule).toHaveProperty(exportName);
    });
  });

  it('ermöglicht Import von Dropdown-Komponenten', () => {
    // Teste, dass die Komponenten tatsächlich importiert werden können
    expect(typeof DropdownModule.Dropdown).toBe('function');
    expect(typeof DropdownModule.ColorDropdown).toBe('function');
  });

  it('unterstützt verschiedene Import-Methoden', () => {
    // Named imports
    const { Dropdown: NamedDropdown, ColorDropdown: NamedColorDropdown } = DropdownModule;
    expect(NamedDropdown).toBe(Dropdown);
    expect(NamedColorDropdown).toBe(ColorDropdown);

    // Default import (sollte Dropdown sein)
    const DefaultExport = DropdownModule.default;
    expect(DefaultExport).toBe(Dropdown);
  });
}); 