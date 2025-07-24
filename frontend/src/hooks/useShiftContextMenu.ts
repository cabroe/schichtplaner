import { useState } from 'react';
import type { Employee, ShiftType } from '../types/shift';

interface ContextMenuState {
  x: number;
  y: number;
  isOpen: boolean;
  employee?: Employee;
  day?: Date;
  shiftType?: ShiftType;
}

/**
 * Hook für das Context-Menu der Schichtplanung
 * Verwaltet das Öffnen, Schließen und die Aktionen des Context-Menus
 */
export const useShiftContextMenu = (
  setShift: (employeeId: string, day: Date, shift: ShiftType) => void,
  deleteWeek: (weekStart: Date) => void,
  setCopiedShift: (shift: ShiftType) => void,
  copiedShift: ShiftType
) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ 
    x: 0, 
    y: 0, 
    isOpen: false 
  });

  /**
   * Öffnet das Context-Menu an der Mausposition
   */
  const openContextMenu = (event: React.MouseEvent, employee: Employee, day: Date, shiftType: ShiftType) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      isOpen: true,
      employee,
      day,
      shiftType
    });
  };

  /**
   * Schließt das Context-Menu
   */
  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };

  /**
   * Setzt eine Schicht über das Context-Menu
   */
  const handleSetShift = (shift: ShiftType) => {
    if (contextMenu.employee && contextMenu.day) {
      setShift(contextMenu.employee.id, contextMenu.day, shift);
    }
    closeContextMenu();
  };

  /**
   * Kopiert eine Schicht in die Zwischenablage
   */
  const handleCopyShift = () => {
    if (contextMenu.employee && contextMenu.day) {
      const shift = contextMenu.shiftType;
      if (shift) {
        setCopiedShift(shift);
      }
    }
    closeContextMenu();
  };

  /**
   * Fügt eine kopierte Schicht ein
   */
  const handlePasteShift = () => {
    if (contextMenu.employee && contextMenu.day && copiedShift) {
      setShift(contextMenu.employee.id, contextMenu.day, copiedShift);
    }
    closeContextMenu();
  };

  /**
   * Löscht eine einzelne Schicht
   */
  const handleDeleteShift = () => {
    if (contextMenu.employee && contextMenu.day) {
      setShift(contextMenu.employee.id, contextMenu.day, null);
    }
    closeContextMenu();
  };

  /**
   * Löscht alle Schichten einer Woche
   */
  const handleDeleteWeek = () => {
    if (contextMenu.day) {
      // Finde den Montag der Woche
      const dayOfWeek = contextMenu.day.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(contextMenu.day);
      monday.setDate(monday.getDate() + mondayOffset);
      
      deleteWeek(monday);
    }
    closeContextMenu();
  };

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
    handleSetShift,
    handleCopyShift,
    handlePasteShift,
    handleDeleteShift,
    handleDeleteWeek
  };
}; 