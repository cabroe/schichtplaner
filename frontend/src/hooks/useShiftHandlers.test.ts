import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useShiftHandlers } from './useShiftHandlers';
import type { Employee } from '../types/shift';

describe('useShiftHandlers', () => {
  const mockSetShift = vi.fn();

  const mockEmployee: Employee = {
    id: 'emp1',
    name: 'Max Mustermann',
    username: 'max',
    email: 'max@example.com',
    color: '#ff0000',
    role: 'employee'
  };

  const mockDay = new Date('2024-01-15'); // Montag
  const mockShiftType = 'S';

  let hook: ReturnType<typeof useShiftHandlers>;

  beforeEach(() => {
    vi.clearAllMocks();
    const { result } = renderHook(() => useShiftHandlers(mockSetShift));
    hook = result.current;
  });

  it('initialisiert mit geschlossenem Modal', () => {
    expect(hook.showTemplateModal).toBe(false);
    expect(hook.selectedCell).toBeNull();
  });

  it('hat Schichtvorlagen verfügbar', () => {
    expect(hook.shiftTemplates).toBeDefined();
    expect(hook.shiftTemplates.length).toBeGreaterThan(0);
  });

  it('kann eine Zelle auswählen und Modal öffnen', () => {
    act(() => {
      hook.handleCellClick(mockEmployee, mockDay, mockShiftType);
    });

    expect(hook.showTemplateModal).toBe(true);
    expect(hook.selectedCell).toEqual({
      employee: mockEmployee,
      day: mockDay,
      shiftType: mockShiftType
    });
  });

  it('kann eine Schichtvorlage auswählen', () => {
    // Öffne zuerst das Modal
    act(() => {
      hook.handleCellClick(mockEmployee, mockDay, mockShiftType);
    });

    // Wähle eine Vorlage aus (Frühschicht-Woche für Montag)
    act(() => {
      hook.handleTemplateSelect('1');
    });

    // Überprüfe, dass setShift mit der korrekten Schicht aufgerufen wurde
    expect(mockSetShift).toHaveBeenCalledWith('emp1', mockDay, 'F');
    expect(hook.showTemplateModal).toBe(false);
    expect(hook.selectedCell).toBeNull();
  });

  it('kann das Modal schließen', () => {
    // Öffne zuerst das Modal
    act(() => {
      hook.handleCellClick(mockEmployee, mockDay, mockShiftType);
    });

    expect(hook.showTemplateModal).toBe(true);

    // Schließe das Modal
    act(() => {
      hook.handleCloseModal();
    });

    expect(hook.showTemplateModal).toBe(false);
    expect(hook.selectedCell).toBeNull();
  });

  it('behandelt Template-Auswahl ohne ausgewählte Zelle korrekt', () => {
    act(() => {
      hook.handleTemplateSelect('1');
    });

    expect(mockSetShift).not.toHaveBeenCalled();
    expect(hook.showTemplateModal).toBe(false);
  });

  it('behandelt nicht gefundene Templates korrekt', () => {
    // Öffne das Modal
    act(() => {
      hook.handleCellClick(mockEmployee, mockDay, mockShiftType);
    });

    // Wähle eine nicht existierende Vorlage aus
    act(() => {
      hook.handleTemplateSelect('999');
    });

    expect(mockSetShift).not.toHaveBeenCalled();
    expect(hook.showTemplateModal).toBe(false);
  });

  it('behandelt Templates ohne Schicht für den Wochentag korrekt', () => {
    // Öffne das Modal für einen Samstag (Tag 6)
    const saturday = new Date('2024-01-20'); // Samstag
    act(() => {
      hook.handleCellClick(mockEmployee, saturday, mockShiftType);
    });

    // Wähle eine Vorlage aus, die für Samstag keine Schicht hat
    act(() => {
      hook.handleTemplateSelect('1'); // Frühschicht-Woche hat null für Samstag
    });

    expect(mockSetShift).not.toHaveBeenCalled();
    expect(hook.showTemplateModal).toBe(false);
  });

  it('berechnet Wochentage korrekt für verschiedene Tage', () => {
    const testCases = [
      { day: new Date('2024-01-15'), expectedShift: 'F' }, // Montag -> F
      { day: new Date('2024-01-16'), expectedShift: 'F' }, // Dienstag -> F
      { day: new Date('2024-01-17'), expectedShift: 'F' }, // Mittwoch -> F
      { day: new Date('2024-01-18'), expectedShift: 'F' }, // Donnerstag -> F
      { day: new Date('2024-01-19'), expectedShift: 'F' }, // Freitag -> F
      { day: new Date('2024-01-20'), expectedShift: null }, // Samstag -> null
      { day: new Date('2024-01-21'), expectedShift: null }, // Sonntag -> null
    ];

    testCases.forEach(({ day, expectedShift }) => {
      // Reset für jeden Test
      vi.clearAllMocks();
      const { result } = renderHook(() => useShiftHandlers(mockSetShift));
      const testHook = result.current;

      // Öffne das Modal
      act(() => {
        testHook.handleCellClick(mockEmployee, day, mockShiftType);
      });

      // Wähle die Frühschicht-Vorlage aus
      act(() => {
        testHook.handleTemplateSelect('1');
      });

      if (expectedShift) {
        expect(mockSetShift).toHaveBeenCalledWith('emp1', day, expectedShift);
      } else {
        expect(mockSetShift).not.toHaveBeenCalled();
      }
    });
  });

  it('hat korrekte Schichtvorlagen-Daten', () => {
    expect(hook.shiftTemplates).toHaveLength(4);

    // Überprüfe die erste Vorlage (Frühschicht-Woche)
    const earlyShiftTemplate = hook.shiftTemplates[0];
    expect(earlyShiftTemplate.id).toBe('1');
    expect(earlyShiftTemplate.name).toBe('Frühschicht-Woche');
    expect(earlyShiftTemplate.description).toBe('5 Tage Frühschicht');
    expect(earlyShiftTemplate.weekPattern).toEqual(['F', 'F', 'F', 'F', 'F', null, null]);
    expect(earlyShiftTemplate.color).toBe('#ff6b6b');

    // Überprüfe die zweite Vorlage (Spätschicht-Woche)
    const lateShiftTemplate = hook.shiftTemplates[1];
    expect(lateShiftTemplate.id).toBe('2');
    expect(lateShiftTemplate.name).toBe('Spätschicht-Woche');
    expect(lateShiftTemplate.weekPattern).toEqual(['S', 'S', 'S', 'S', 'S', null, null]);
  });

  it('behandelt Sonntag als Tag 6 korrekt', () => {
    const sunday = new Date('2024-01-21'); // Sonntag
    
    // Öffne das Modal
    act(() => {
      hook.handleCellClick(mockEmployee, sunday, mockShiftType);
    });

    // Wähle eine Vorlage aus
    act(() => {
      hook.handleTemplateSelect('1');
    });

    // Sonntag sollte als Tag 6 behandelt werden (null in der Vorlage)
    expect(mockSetShift).not.toHaveBeenCalled();
  });
}); 