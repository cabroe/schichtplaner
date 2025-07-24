import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useShiftContextMenu } from './useShiftContextMenu';
import type { Employee } from '../types/shift';

describe('useShiftContextMenu', () => {
  const mockSetShift = vi.fn();
  const mockDeleteWeek = vi.fn();
  const mockSetCopiedShift = vi.fn();
  const mockCopiedShift = 'F';

  const mockEmployee: Employee = {
    id: 'emp1',
    name: 'Max Mustermann',
    username: 'max',
    email: 'max@example.com',
    color: '#ff0000',
    role: 'employee'
  };

  const mockDay = new Date('2024-01-15');
  const mockShiftType = 'S';

  let hook: ReturnType<typeof useShiftContextMenu>;

  beforeEach(() => {
    vi.clearAllMocks();
    const { result } = renderHook(() => 
      useShiftContextMenu(mockSetShift, mockDeleteWeek, mockSetCopiedShift, mockCopiedShift)
    );
    hook = result.current;
  });

  it('initialisiert mit geschlossenem Context-Menu', () => {
    expect(hook.contextMenu.isOpen).toBe(false);
    expect(hook.contextMenu.x).toBe(0);
    expect(hook.contextMenu.y).toBe(0);
  });

  it('kann das Context-Menu öffnen', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200
    } as unknown as React.MouseEvent;

    act(() => {
      hook.openContextMenu(mockEvent, mockEmployee, mockDay, mockShiftType);
    });

    expect(hook.contextMenu.isOpen).toBe(true);
    expect(hook.contextMenu.x).toBe(100);
    expect(hook.contextMenu.y).toBe(200);
    expect(hook.contextMenu.employee).toBe(mockEmployee);
    expect(hook.contextMenu.day).toBe(mockDay);
    expect(hook.contextMenu.shiftType).toBe(mockShiftType);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('kann das Context-Menu schließen', () => {
    // Öffne zuerst das Menu
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200
    } as unknown as React.MouseEvent;

    act(() => {
      hook.openContextMenu(mockEvent, mockEmployee, mockDay, mockShiftType);
    });

    expect(hook.contextMenu.isOpen).toBe(true);

    // Schließe das Menu
    act(() => {
      hook.closeContextMenu();
    });

    expect(hook.contextMenu.isOpen).toBe(false);
  });

  it('kann eine Schicht über das Context-Menu setzen', () => {
    // Öffne das Menu
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200
    } as unknown as React.MouseEvent;

    act(() => {
      hook.openContextMenu(mockEvent, mockEmployee, mockDay, mockShiftType);
    });

    // Setze eine Schicht
    act(() => {
      hook.handleSetShift('F');
    });

    expect(mockSetShift).toHaveBeenCalledWith('emp1', mockDay, 'F');
    expect(hook.contextMenu.isOpen).toBe(false);
  });

  it('kann eine Schicht kopieren', () => {
    // Öffne das Menu
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200
    } as unknown as React.MouseEvent;

    act(() => {
      hook.openContextMenu(mockEvent, mockEmployee, mockDay, mockShiftType);
    });

    // Kopiere die Schicht
    act(() => {
      hook.handleCopyShift();
    });

    expect(mockSetCopiedShift).toHaveBeenCalledWith('S');
    expect(hook.contextMenu.isOpen).toBe(false);
  });

  it('kann eine kopierte Schicht einfügen', () => {
    // Öffne das Menu
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200
    } as unknown as React.MouseEvent;

    act(() => {
      hook.openContextMenu(mockEvent, mockEmployee, mockDay, mockShiftType);
    });

    // Füge die kopierte Schicht ein
    act(() => {
      hook.handlePasteShift();
    });

    expect(mockSetShift).toHaveBeenCalledWith('emp1', mockDay, 'F');
    expect(hook.contextMenu.isOpen).toBe(false);
  });

  it('kann eine einzelne Schicht löschen', () => {
    // Öffne das Menu
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200
    } as unknown as React.MouseEvent;

    act(() => {
      hook.openContextMenu(mockEvent, mockEmployee, mockDay, mockShiftType);
    });

    // Lösche die Schicht
    act(() => {
      hook.handleDeleteShift();
    });

    expect(mockSetShift).toHaveBeenCalledWith('emp1', mockDay, null);
    expect(hook.contextMenu.isOpen).toBe(false);
  });

  it('kann eine Woche löschen', () => {
    // Öffne das Menu
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200
    } as unknown as React.MouseEvent;

    act(() => {
      hook.openContextMenu(mockEvent, mockEmployee, mockDay, mockShiftType);
    });

    // Lösche die Woche
    act(() => {
      hook.handleDeleteWeek();
    });

    // Überprüfe, dass deleteWeek mit dem Montag der Woche aufgerufen wurde
    expect(mockDeleteWeek).toHaveBeenCalled();
    const calledDate = mockDeleteWeek.mock.calls[0][0];
    expect(calledDate.getDay()).toBe(1); // Montag
    expect(hook.contextMenu.isOpen).toBe(false);
  });

  it('behandelt fehlende Context-Menu-Daten korrekt', () => {
    // Versuche Aktionen ohne geöffnetes Menu
    act(() => {
      hook.handleSetShift('F');
    });

    expect(mockSetShift).not.toHaveBeenCalled();
    expect(hook.contextMenu.isOpen).toBe(false);
  });

  it('berechnet den Montag korrekt für verschiedene Wochentage', () => {
    const testCases = [
      { day: new Date('2024-01-15'), expectedDay: 1 }, // Montag
      { day: new Date('2024-01-16'), expectedDay: 1 }, // Dienstag
      { day: new Date('2024-17'), expectedDay: 1 }, // Mittwoch
      { day: new Date('2024-01-18'), expectedDay: 1 }, // Donnerstag
      { day: new Date('2024-01-19'), expectedDay: 1 }, // Freitag
      { day: new Date('2024-01-20'), expectedDay: 1 }, // Samstag
      { day: new Date('2024-01-21'), expectedDay: 1 }, // Sonntag
    ];

    testCases.forEach(({ day, expectedDay }) => {
      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 200
      } as unknown as React.MouseEvent;

      act(() => {
        hook.openContextMenu(mockEvent, mockEmployee, day, mockShiftType);
      });

      act(() => {
        hook.handleDeleteWeek();
      });

      const calledDate = mockDeleteWeek.mock.calls[mockDeleteWeek.mock.calls.length - 1][0];
      expect(calledDate.getDay()).toBe(expectedDay);

      // Reset für nächsten Test
      mockDeleteWeek.mockClear();
    });
  });
}); 