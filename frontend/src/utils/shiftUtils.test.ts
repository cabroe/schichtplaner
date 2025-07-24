import { describe, it, expect } from 'vitest';
import {
  formatWeekday,
  getWeekdayClass,
  getWeekNumberClass,
  getTooltipForShift,
  getShiftColor,
  getShiftIcon,
  isWeekendShift,
  isHolidayShift,
  isAbsenceShift,
  getShiftDuration,
  formatShiftDuration
} from './shiftUtils';

describe('shiftUtils', () => {
  describe('Wochentag-Formatierung', () => {
    it('formatiert Wochentage korrekt', () => {
      const monday = new Date('2024-01-15'); // Montag
      const friday = new Date('2024-01-19'); // Freitag
      const sunday = new Date('2024-01-21'); // Sonntag
      
      expect(formatWeekday(monday)).toBe('Mo');
      expect(formatWeekday(friday)).toBe('Fr');
      expect(formatWeekday(sunday)).toBe('So');
    });
  });

  describe('Wochentag-Klassen', () => {
    it('gibt korrekte CSS-Klassen für Wochentage zurück', () => {
      const monday = new Date('2024-01-15'); // Montag
      const saturday = new Date('2024-01-20'); // Samstag
      const sunday = new Date('2024-01-21'); // Sonntag
      
      expect(getWeekdayClass(monday)).toBe('');
      expect(getWeekdayClass(saturday)).toBe('text-danger');
      expect(getWeekdayClass(sunday)).toBe('text-danger');
    });
  });

  describe('Kalenderwoche-Klassen', () => {
    it('gibt korrekte CSS-Klassen für Kalenderwochen zurück', () => {
      expect(getWeekNumberClass()).toBe('bg-dark');
    });
  });

  describe('Schicht-Tooltips', () => {
    it('gibt korrekte Tooltips für Schichttypen zurück', () => {
      expect(getTooltipForShift('F')).toBe('Frühschicht');
      expect(getTooltipForShift('S')).toBe('Spätschicht');
      expect(getTooltipForShift('N')).toBe('Nachtschicht');
      expect(getTooltipForShift('U')).toBe('Urlaub');
      expect(getTooltipForShift('K')).toBe('Krank');
      expect(getTooltipForShift('FR')).toBe('Frei');
      expect(getTooltipForShift('FT')).toBe('Feiertag');
      expect(getTooltipForShift('WE')).toBe('Wochenende');
      expect(getTooltipForShift(null)).toBe('Keine Schicht');
      expect(getTooltipForShift('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('Schicht-Farben', () => {
    it('gibt korrekte Farben für Schichttypen zurück', () => {
      expect(getShiftColor('F')).toBe('#ff6b6b');
      expect(getShiftColor('S')).toBe('#4ecdc4');
      expect(getShiftColor('N')).toBe('#45b7d1');
      expect(getShiftColor('U')).toBe('#ffd93d');
      expect(getShiftColor('K')).toBe('#ff8a80');
      expect(getShiftColor('FR')).toBe('#6c757d');
      expect(getShiftColor('FT')).toBe('#28a745');
      expect(getShiftColor('WE')).toBe('#343a40');
      expect(getShiftColor(null)).toBe('transparent');
      expect(getShiftColor('UNKNOWN')).toBe('#6c757d');
    });
  });

  describe('Schicht-Icons', () => {
    it('gibt korrekte Icons für Schichttypen zurück', () => {
      expect(getShiftIcon('F')).toBe('fas fa-sunrise');
      expect(getShiftIcon('S')).toBe('fas fa-sun');
      expect(getShiftIcon('N')).toBe('fas fa-moon');
      expect(getShiftIcon('U')).toBe('fas fa-calendar-check');
      expect(getShiftIcon('K')).toBe('fas fa-bandaid');
      expect(getShiftIcon('FR')).toBe('fas fa-calendar-x');
      expect(getShiftIcon('FT')).toBe('fas fa-calendar-event');
      expect(getShiftIcon('WE')).toBe('fas fa-calendar-weekend');
      expect(getShiftIcon(null)).toBe('fas fa-calendar');
      expect(getShiftIcon('UNKNOWN')).toBe('fas fa-calendar');
    });
  });

  describe('Schicht-Typ-Prüfungen', () => {
    it('erkennt Wochenende-Schichten korrekt', () => {
      expect(isWeekendShift('WE')).toBe(true);
      expect(isWeekendShift('F')).toBe(false);
      expect(isWeekendShift(null)).toBe(false);
    });

    it('erkennt Feiertags-Schichten korrekt', () => {
      expect(isHolidayShift('FT')).toBe(true);
      expect(isHolidayShift('F')).toBe(false);
      expect(isHolidayShift(null)).toBe(false);
    });

    it('erkennt Abwesenheits-Schichten korrekt', () => {
      expect(isAbsenceShift('U')).toBe(true);
      expect(isAbsenceShift('K')).toBe(true);
      expect(isAbsenceShift('F')).toBe(false);
      expect(isAbsenceShift(null)).toBe(false);
    });
  });

  describe('Schicht-Dauer', () => {
    it('berechnet Schichtdauer korrekt', () => {
      expect(getShiftDuration('F')).toBe(8);
      expect(getShiftDuration('S')).toBe(8);
      expect(getShiftDuration('N')).toBe(8);
      expect(getShiftDuration('U')).toBe(0);
      expect(getShiftDuration('K')).toBe(0);
      expect(getShiftDuration('FR')).toBe(0);
      expect(getShiftDuration('FT')).toBe(0);
      expect(getShiftDuration('WE')).toBe(0);
      expect(getShiftDuration(null)).toBe(0);
      expect(getShiftDuration('UNKNOWN')).toBe(0);
    });
  });

  describe('Schicht-Dauer-Formatierung', () => {
    it('formatiert Schichtdauer korrekt', () => {
      expect(formatShiftDuration('F')).toBe('8h');
      expect(formatShiftDuration('S')).toBe('8h');
      expect(formatShiftDuration('N')).toBe('8h');
      expect(formatShiftDuration('U')).toBe('-');
      expect(formatShiftDuration('K')).toBe('-');
      expect(formatShiftDuration('FR')).toBe('-');
      expect(formatShiftDuration('FT')).toBe('-');
      expect(formatShiftDuration('WE')).toBe('-');
      expect(formatShiftDuration(null)).toBe('-');
    });
  });
}); 