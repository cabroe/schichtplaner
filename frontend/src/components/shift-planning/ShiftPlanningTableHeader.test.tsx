import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ShiftPlanningTableHeader from './ShiftPlanningTableHeader';
import type { WeekGroup } from '../../types/shift';

describe('ShiftPlanningTableHeader', () => {
  const createMockWeekGroups = (): WeekGroup[] => [
    {
      week: 1,
      days: [
        new Date('2024-01-15'), // Montag
        new Date('2024-01-16'), // Dienstag
        new Date('2024-01-17'), // Mittwoch
        new Date('2024-01-18'), // Donnerstag
        new Date('2024-01-19'), // Freitag
      ]
    },
    {
      week: 2,
      days: [
        new Date('2024-01-22'), // Montag
        new Date('2024-01-23'), // Dienstag
        new Date('2024-01-24'), // Mittwoch
        new Date('2024-01-25'), // Donnerstag
        new Date('2024-01-26'), // Freitag
      ]
    }
  ];

  const createMockCalendarDays = (): Date[] => [
    new Date('2024-01-15'), // Montag
    new Date('2024-01-16'), // Dienstag
    new Date('2024-01-17'), // Mittwoch
    new Date('2024-01-18'), // Donnerstag
    new Date('2024-01-19'), // Freitag
    new Date('2024-01-22'), // Montag
    new Date('2024-01-23'), // Dienstag
    new Date('2024-01-24'), // Mittwoch
    new Date('2024-01-25'), // Donnerstag
    new Date('2024-01-26'), // Freitag
  ];

  const renderHeader = (weekGroups: WeekGroup[], calendarDays: Date[]) => {
    return render(
      <table>
        <ShiftPlanningTableHeader weekGroups={weekGroups} calendarDays={calendarDays} />
      </table>
    );
  };

  describe('Grundlegende Struktur', () => {
    it('rendert ohne Fehler', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      renderHeader(weekGroups, calendarDays);
      
      expect(screen.getByText('Mitarbeiter')).toBeInTheDocument();
    });

    it('rendert Kalenderwochen korrekt', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      renderHeader(weekGroups, calendarDays);
      
      expect(screen.getByText('KW 1')).toBeInTheDocument();
      expect(screen.getByText('KW 2')).toBeInTheDocument();
    });

    it('rendert Wochentage korrekt', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      renderHeader(weekGroups, calendarDays);
      
      // Prüfe einige Wochentage (verwende getAllByText da es mehrere gibt)
      expect(screen.getAllByText('Mo')).toHaveLength(2);
      expect(screen.getAllByText('Di')).toHaveLength(2);
      expect(screen.getAllByText('Mi')).toHaveLength(2);
      expect(screen.getAllByText('Do')).toHaveLength(2);
      expect(screen.getAllByText('Fr')).toHaveLength(2);
    });
  });

  describe('Kalenderwochen', () => {
    it('zeigt korrekte Kalenderwochen-Nummern', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      renderHeader(weekGroups, calendarDays);
      
      expect(screen.getByText('KW 1')).toBeInTheDocument();
      expect(screen.getByText('KW 2')).toBeInTheDocument();
    });

    it('hat korrekte colspan für Kalenderwochen', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      const { container } = renderHeader(weekGroups, calendarDays);
      
      const weekHeaders = container.querySelectorAll('th[colspan]');
      expect(weekHeaders[0]).toHaveAttribute('colspan', '5'); // KW 1 hat 5 Tage
      expect(weekHeaders[1]).toHaveAttribute('colspan', '5'); // KW 2 hat 5 Tage
    });
  });

  describe('Wochentage', () => {
    it('zeigt korrekte Wochentags-Abkürzungen', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      renderHeader(weekGroups, calendarDays);
      
      // Deutsche Wochentags-Abkürzungen (verwende getAllByText da es mehrere gibt)
      expect(screen.getAllByText('Mo')).toHaveLength(2);
      expect(screen.getAllByText('Di')).toHaveLength(2);
      expect(screen.getAllByText('Mi')).toHaveLength(2);
      expect(screen.getAllByText('Do')).toHaveLength(2);
      expect(screen.getAllByText('Fr')).toHaveLength(2);
    });

    it('zeigt korrekte Datums-Formatierung', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      renderHeader(weekGroups, calendarDays);
      
      // Prüfe einige Datums-Formate (verwende regex für locale-spezifische Formatierung)
      expect(screen.getByText(/15\.?0?1\.?2024/)).toBeInTheDocument();
      expect(screen.getByText(/16\.?0?1\.?2024/)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('hat korrekte CSS-Klassen für Mitarbeiter-Header', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      const { container } = renderHeader(weekGroups, calendarDays);
      
      const employeeHeader = container.querySelector('th[rowspan="2"]');
      expect(employeeHeader).toHaveStyle({ minWidth: '150px' });
    });

    it('hat korrekte CSS-Klassen für Wochentags-Header', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      const { container } = renderHeader(weekGroups, calendarDays);
      
      const dayHeaders = container.querySelectorAll('th.text-center.p-1');
      expect(dayHeaders.length).toBeGreaterThan(0);
      
      dayHeaders.forEach(header => {
        expect(header).toHaveStyle({ minWidth: '100px' });
      });
    });

    it('hat korrekte CSS-Klassen für Kalenderwochen', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      const { container } = renderHeader(weekGroups, calendarDays);
      
      const weekHeaders = container.querySelectorAll('th.text-center');
      expect(weekHeaders.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('hat responsive Styling für Mitarbeiter-Header', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      const { container } = renderHeader(weekGroups, calendarDays);
      
      const employeeHeader = container.querySelector('th[rowspan="2"]');
      expect(employeeHeader).toHaveStyle({ minWidth: '150px' });
    });

    it('hat responsive Styling für Wochentags-Header', () => {
      const weekGroups = createMockWeekGroups();
      const calendarDays = createMockCalendarDays();
      
      const { container } = renderHeader(weekGroups, calendarDays);
      
      const dayHeaders = container.querySelectorAll('th.text-center.p-1');
      dayHeaders.forEach(header => {
        expect(header).toHaveStyle({ minWidth: '100px' });
      });
    });
  });

  describe('Edge Cases', () => {
    it('behandelt leere Kalenderwochen korrekt', () => {
      const weekGroups: WeekGroup[] = [];
      const calendarDays: Date[] = [];
      
      renderHeader(weekGroups, calendarDays);
      
      expect(screen.getByText('Mitarbeiter')).toBeInTheDocument();
    });

    it('behandelt einzelne Kalenderwoche korrekt', () => {
      const weekGroups: WeekGroup[] = [
        {
          week: 1,
          days: [
            new Date('2024-01-15'),
            new Date('2024-01-16'),
            new Date('2024-01-17'),
          ]
        }
      ];
      const calendarDays = weekGroups[0].days;
      
      renderHeader(weekGroups, calendarDays);
      
      expect(screen.getByText('KW 1')).toBeInTheDocument();
      expect(screen.getAllByText('Mo')).toHaveLength(1);
      expect(screen.getAllByText('Di')).toHaveLength(1);
      expect(screen.getAllByText('Mi')).toHaveLength(1);
    });

    it('behandelt Wochenende korrekt', () => {
      const weekGroups: WeekGroup[] = [
        {
          week: 1,
          days: [
            new Date('2024-01-20'), // Samstag
            new Date('2024-01-21'), // Sonntag
          ]
        }
      ];
      const calendarDays = weekGroups[0].days;
      
      renderHeader(weekGroups, calendarDays);
      
      expect(screen.getByText('KW 1')).toBeInTheDocument();
      expect(screen.getAllByText('Sa')).toHaveLength(1);
      expect(screen.getAllByText('So')).toHaveLength(1);
    });
  });

  describe('Datum-Formatierung', () => {
    it('formatiert verschiedene Datums-Formate korrekt', () => {
      const weekGroups: WeekGroup[] = [
        {
          week: 1,
          days: [
            new Date('2024-01-01'), // 1. Januar
            new Date('2024-12-31'), // 31. Dezember
            new Date('2024-02-29'), // Schaltjahr
          ]
        }
      ];
      const calendarDays = weekGroups[0].days;
      
      renderHeader(weekGroups, calendarDays);
      
      expect(screen.getByText(/1\.?0?1\.?2024/)).toBeInTheDocument();
      expect(screen.getByText(/31\.?12\.?2024/)).toBeInTheDocument();
      expect(screen.getByText(/29\.?0?2\.?2024/)).toBeInTheDocument();
    });
  });
}); 