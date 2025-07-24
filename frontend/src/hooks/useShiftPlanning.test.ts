import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useShiftPlanning } from './useShiftPlanning';

describe('useShiftPlanning', () => {
  let hook: ReturnType<typeof useShiftPlanning>;

  beforeEach(() => {
    const { result } = renderHook(() => useShiftPlanning(4));
    hook = result.current;
  });

  it('initialisiert mit korrekten Standardwerten', () => {
    expect(hook.calendarDays).toBeDefined();
    expect(hook.calendarDays.length).toBeGreaterThan(0);
    expect(hook.copiedShift).toBeNull();
    expect(hook.activeSubmenu).toBeNull();
  });

  it('generiert Kalendertage für die angegebene Anzahl von Wochen', () => {
    const { result } = renderHook(() => useShiftPlanning(2));
    expect(result.current.calendarDays.length).toBe(14); // 2 Wochen * 7 Tage
  });

  it('kann Schichten setzen und abrufen', () => {
    const employeeId = 'emp1';
    const day = new Date('2024-01-15');
    const shiftType = 'F';

    act(() => {
      hook.setShift(employeeId, day, shiftType);
    });

    const retrievedShift = hook.getShift(employeeId, day);
    expect(retrievedShift).toBe(shiftType);
  });

  it('gibt null zurück für nicht gesetzte Schichten', () => {
    const employeeId = 'emp1';
    const day = new Date('2024-01-15');

    const retrievedShift = hook.getShift(employeeId, day);
    expect(retrievedShift).toBeNull();
  });

  it('kann kopierte Schichten setzen', () => {
    const shiftType = 'S';

    act(() => {
      hook.setCopiedShift(shiftType);
    });

    expect(hook.copiedShift).toBe(shiftType);
  });

  it('kann aktive Submenüs setzen', () => {
    const submenu = 'shifts';

    act(() => {
      hook.setActiveSubmenu(submenu);
    });

    expect(hook.activeSubmenu).toBe(submenu);
  });

  it('kann eine Woche löschen', () => {
    const employeeId = 'emp1';
    const weekStart = new Date('2024-01-15'); // Montag
    const day1 = new Date('2024-01-15');
    const day2 = new Date('2024-01-16');

    // Setze Schichten für verschiedene Tage
    act(() => {
      hook.setShift(employeeId, day1, 'F');
      hook.setShift(employeeId, day2, 'S');
    });

    // Überprüfe, dass Schichten gesetzt sind
    expect(hook.getShift(employeeId, day1)).toBe('F');
    expect(hook.getShift(employeeId, day2)).toBe('S');

    // Lösche die Woche
    act(() => {
      hook.deleteWeek(weekStart);
    });

    // Überprüfe, dass Schichten gelöscht wurden
    expect(hook.getShift(employeeId, day1)).toBeNull();
    expect(hook.getShift(employeeId, day2)).toBeNull();
  });

  it('verwendet korrekte Schlüssel für Schichten', () => {
    const employeeId = 'emp1';
    const day = new Date('2024-01-15T10:30:00'); // Mit Uhrzeit
    const shiftType = 'N';

    act(() => {
      hook.setShift(employeeId, day, shiftType);
    });

    // Sollte trotz Uhrzeit funktionieren (nur Datum wird verwendet)
    const retrievedShift = hook.getShift(employeeId, day);
    expect(retrievedShift).toBe(shiftType);
  });

  it('behält andere Schichten beim Löschen einer Woche', () => {
    const employeeId = 'emp1';
    const weekStart = new Date('2024-01-15'); // Woche 1
    const day1 = new Date('2024-01-15'); // Woche 1
    const day2 = new Date('2024-01-22'); // Woche 2

    // Setze Schichten für verschiedene Wochen
    act(() => {
      hook.setShift(employeeId, day1, 'F');
      hook.setShift(employeeId, day2, 'S');
    });

    // Lösche nur Woche 1
    act(() => {
      hook.deleteWeek(weekStart);
    });

    // Schicht in Woche 1 sollte gelöscht sein
    expect(hook.getShift(employeeId, day1)).toBeNull();
    // Schicht in Woche 2 sollte erhalten bleiben
    expect(hook.getShift(employeeId, day2)).toBe('S');
  });
}); 