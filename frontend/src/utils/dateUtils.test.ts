import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatDate,
  formatTime,
  formatDateTime,
  calculateDuration,
  isToday,
  isPast,
  isFuture,
  getTodayStart,
  getTodayEnd,
  addDays,
  daysBetween,
  getWeekStart,
  getWeekEnd,
  formatRelativeTime,
  // Neue Kalender-Funktionen
  getWeekNumber,
  groupDaysByWeek,
  generateCalendarDays,
  formatCalendarDate,
  formatCalendarDateLong,
  isWeekend,
  isHoliday,
  getMonthStart,
  getMonthEnd
} from './dateUtils';

describe('dateUtils', () => {
  let testDate: Date;

  beforeEach(() => {
    testDate = new Date('2024-01-15T10:30:00');
  });

  describe('Grundlegende Formatierungsfunktionen', () => {
    it('formatiert ein Datum korrekt', () => {
      const result = formatDate(testDate);
      // Prüfe verschiedene mögliche Formate
      expect(result).toMatch(/15\.?0?1\.?2024/);
    });

    it('formatiert eine Uhrzeit korrekt', () => {
      expect(formatTime(testDate)).toBe('10:30');
    });

    it('formatiert Datum und Uhrzeit korrekt', () => {
      const result = formatDateTime(testDate);
      // Prüfe verschiedene mögliche Formate
      expect(result).toMatch(/15\.?0?1\.?2024.*10:30/);
    });
  });

  describe('Dauer-Berechnungen', () => {
    it('berechnet die Dauer zwischen zwei Zeitpunkten', () => {
      const start = new Date('2024-01-15T10:00:00');
      const end = new Date('2024-01-15T12:30:00');
      expect(calculateDuration(start, end)).toBe('2h 30min');
    });

    it('berechnet die Dauer für weniger als eine Stunde', () => {
      const start = new Date('2024-01-15T10:00:00');
      const end = new Date('2024-01-15T10:30:00');
      expect(calculateDuration(start, end)).toBe('30min');
    });
  });

  describe('Datum-Vergleiche', () => {
    it('erkennt heute korrekt', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('erkennt vergangene Daten', () => {
      const pastDate = new Date('2020-01-01');
      expect(isPast(pastDate)).toBe(true);
    });

    it('erkennt zukünftige Daten', () => {
      const futureDate = new Date('2030-01-01');
      expect(isFuture(futureDate)).toBe(true);
    });
  });

  describe('Datum-Grenzen', () => {
    it('erstellt den Start des Tages', () => {
      const start = getTodayStart();
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
    });

    it('erstellt das Ende des Tages', () => {
      const end = getTodayEnd();
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
    });
  });

  describe('Datum-Arithmetik', () => {
    it('fügt Tage zu einem Datum hinzu', () => {
      const result = addDays(testDate, 5);
      expect(result.getDate()).toBe(20);
    });

    it('berechnet die Anzahl der Tage zwischen zwei Daten', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-10');
      expect(daysBetween(start, end)).toBe(9);
    });
  });

  describe('Wochen-Berechnungen', () => {
    it('findet den Start der Woche (Montag)', () => {
      const monday = new Date('2024-01-15'); // Montag
      const weekStart = getWeekStart(monday);
      expect(weekStart.getDay()).toBe(1); // Montag = 1
    });

    it('findet das Ende der Woche (Sonntag)', () => {
      const monday = new Date('2024-01-15'); // Montag
      const weekEnd = getWeekEnd(monday);
      expect(weekEnd.getDay()).toBe(0); // Sonntag = 0
    });
  });

  describe('Relative Zeit-Formatierung', () => {
    it('formatiert "gerade eben" für sehr kurze Zeit', () => {
      const justNow = new Date();
      expect(formatRelativeTime(justNow)).toBe('gerade eben');
    });

    it('formatiert Minuten für kurze Zeit', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('vor 5 Minuten');
    });

    it('formatiert Stunden für mittlere Zeit', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoHoursAgo)).toBe('vor 2 Stunden');
    });
  });

  // ===== NEUE KALENDER-FUNKTIONEN =====

  describe('Kalenderwoche-Berechnung', () => {
    it('berechnet die Kalenderwoche korrekt', () => {
      const date = new Date('2024-01-15'); // KW 3
      expect(getWeekNumber(date)).toBe(3);
    });

    it('berechnet die Kalenderwoche für Jahresanfang', () => {
      const date = new Date('2024-01-01'); // KW 1
      expect(getWeekNumber(date)).toBe(1);
    });
  });

  describe('Wochen-Gruppierung', () => {
    it('gruppiert Tage korrekt nach Wochen', () => {
      const days = [
        new Date('2024-01-15'), // Montag
        new Date('2024-01-16'), // Dienstag
        new Date('2024-01-17'), // Mittwoch
        new Date('2024-01-18'), // Donnerstag
        new Date('2024-01-19'), // Freitag
        new Date('2024-01-20'), // Samstag
        new Date('2024-01-21'), // Sonntag
        new Date('2024-01-22'), // Montag (nächste Woche)
      ];
      
      const weeks = groupDaysByWeek(days);
      expect(weeks).toHaveLength(2);
      expect(weeks[0]).toHaveLength(7);
      expect(weeks[1]).toHaveLength(1);
    });

    it('behandelt unvollständige Wochen korrekt', () => {
      const days = [
        new Date('2024-01-15'), // Montag
        new Date('2024-01-16'), // Dienstag
      ];
      
      const weeks = groupDaysByWeek(days);
      expect(weeks).toHaveLength(1);
      expect(weeks[0]).toHaveLength(2);
    });
  });

  describe('Kalendertage-Generierung', () => {
    it('generiert Kalendertage für eine Woche', () => {
      const days = generateCalendarDays(1);
      expect(days).toHaveLength(7);
      
      // Prüfe, dass alle Tage in der gleichen Woche sind
      const firstDay = days[0];
      const lastDay = days[6];
      const weekDiff = daysBetween(firstDay, lastDay);
      expect(weekDiff).toBe(6); // 7 Tage = 6 Tage Unterschied
    });

    it('generiert Kalendertage für mehrere Wochen', () => {
      const days = generateCalendarDays(2);
      expect(days).toHaveLength(14);
    });

    it('startet immer am Montag', () => {
      const days = generateCalendarDays(1);
      const monday = days[0];
      expect(monday.getDay()).toBe(1); // Montag = 1
    });
  });

  describe('Kalender-Datum-Formatierung', () => {
    it('formatiert Kalenderdatum im Kurzformat', () => {
      const monday = new Date('2024-01-15'); // Montag
      expect(formatCalendarDate(monday)).toBe('Mo');
    });

    it('formatiert Kalenderdatum im Langformat', () => {
      const date = new Date('2024-01-15');
      const result = formatCalendarDateLong(date);
      // Prüfe verschiedene mögliche Formate
      expect(result).toMatch(/15\.?0?1/);
    });
  });

  describe('Wochenende-Erkennung', () => {
    it('erkennt Samstag als Wochenende', () => {
      const saturday = new Date('2024-01-20'); // Samstag
      expect(isWeekend(saturday)).toBe(true);
    });

    it('erkennt Sonntag als Wochenende', () => {
      const sunday = new Date('2024-01-21'); // Sonntag
      expect(isWeekend(sunday)).toBe(true);
    });

    it('erkennt Wochentage korrekt', () => {
      const monday = new Date('2024-01-15'); // Montag
      expect(isWeekend(monday)).toBe(false);
    });
  });

  describe('Feiertags-Erkennung', () => {
    it('erkennt Neujahr als Feiertag', () => {
      const newYear = new Date('2024-01-01');
      expect(isHoliday(newYear)).toBe(true);
    });

    it('erkennt Tag der Arbeit als Feiertag', () => {
      const laborDay = new Date('2024-05-01');
      expect(isHoliday(laborDay)).toBe(true);
    });

    it('erkennt normale Tage korrekt', () => {
      const normalDay = new Date('2024-01-15');
      expect(isHoliday(normalDay)).toBe(false);
    });
  });

  describe('Monats-Grenzen', () => {
    it('findet den ersten Tag des Monats', () => {
      const monthStart = getMonthStart(testDate);
      expect(monthStart.getDate()).toBe(1);
      expect(monthStart.getMonth()).toBe(0); // Januar
    });

    it('findet den letzten Tag des Monats', () => {
      const monthEnd = getMonthEnd(testDate);
      expect(monthEnd.getMonth()).toBe(0); // Januar
      expect(monthEnd.getDate()).toBe(31); // Januar hat 31 Tage
    });

    it('behandelt Februar korrekt (Schaltjahr)', () => {
      const februaryDate = new Date('2024-02-15');
      const monthEnd = getMonthEnd(februaryDate);
      expect(monthEnd.getDate()).toBe(29); // 2024 ist Schaltjahr
    });
  });
}); 