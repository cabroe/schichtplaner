import { useState } from 'react';
import { generateCalendarDays, addDays } from '../utils/dateUtils';
import type { ShiftType } from '../types/shift';

/**
 * Hook für die Schichtplanung
 * Verwaltet Kalendertage, Schichten und kopierte Schichten
 */
export const useShiftPlanning = (weeksToShow: number) => {
  const [calendarDays] = useState(() => generateCalendarDays(weeksToShow));
  const [shifts, setShifts] = useState<Record<string, ShiftType>>({});
  const [copiedShift, setCopiedShift] = useState<ShiftType>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  /**
   * Holt eine Schicht für einen Mitarbeiter an einem bestimmten Tag
   */
  const getShift = (employeeId: string, day: Date): ShiftType => {
    const key = `${employeeId}-${day.toISOString().split('T')[0]}`;
    return shifts[key] || null;
  };

  /**
   * Setzt eine Schicht für einen Mitarbeiter an einem bestimmten Tag
   */
  const setShift = (employeeId: string, day: Date, shift: ShiftType) => {
    const key = `${employeeId}-${day.toISOString().split('T')[0]}`;
    setShifts(prev => ({
      ...prev,
      [key]: shift
    }));
  };

  /**
   * Löscht alle Schichten einer Woche
   */
  const deleteWeek = (weekStart: Date) => {
    const newShifts = { ...shifts };
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dayKey = day.toISOString().split('T')[0];
      
      Object.keys(newShifts).forEach(key => {
        if (key.includes(dayKey)) {
          delete newShifts[key];
        }
      });
    }
    setShifts(newShifts);
  };

  return {
    calendarDays,
    getShift,
    setShift,
    deleteWeek,
    copiedShift,
    setCopiedShift,
    activeSubmenu,
    setActiveSubmenu
  };
}; 