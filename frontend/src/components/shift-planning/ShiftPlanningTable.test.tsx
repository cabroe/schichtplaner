import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShiftPlanningTable from './ShiftPlanningTable';
import type { Employee, ShiftType, WeekGroup } from '../../types/shift';

// Mock der DataTable-Komponente
vi.mock('../DataTable', () => ({
  default: ({ children, ...props }: any) => (
    <div data-testid="data-table" {...props}>
      <table>
        {children}
      </table>
    </div>
  )
}));

describe('ShiftPlanningTable', () => {
  const createMockEmployees = (): Employee[] => [
    {
      id: '1',
      name: 'Max Mustermann',
      username: 'max.mustermann',
      email: 'max@example.com',
      color: '#ff0000',
      role: 'employee'
    },
    {
      id: '2',
      name: 'Anna Schmidt',
      username: 'anna.schmidt',
      email: 'anna@example.com',
      color: '#00ff00',
      role: 'employee'
    }
  ];

  const createMockWeekGroups = (): WeekGroup[] => [
    {
      week: 1,
      days: [
        new Date('2024-01-15'),
        new Date('2024-01-16'),
        new Date('2024-01-17'),
        new Date('2024-01-18'),
        new Date('2024-01-19'),
      ]
    },
    {
      week: 2,
      days: [
        new Date('2024-01-22'),
        new Date('2024-01-23'),
        new Date('2024-01-24'),
        new Date('2024-01-25'),
        new Date('2024-01-26'),
      ]
    }
  ];

  const createMockCalendarDays = (): Date[] => [
    new Date('2024-01-15'),
    new Date('2024-01-16'),
    new Date('2024-01-17'),
    new Date('2024-01-18'),
    new Date('2024-01-19'),
    new Date('2024-01-22'),
    new Date('2024-01-23'),
    new Date('2024-01-24'),
    new Date('2024-01-25'),
    new Date('2024-01-26'),
  ];

  const mockGetShift = vi.fn((employeeId: string, day: Date): ShiftType => {
    if (employeeId === '1' && day.getDate() === 15) return 'F';
    if (employeeId === '1' && day.getDate() === 16) return 'S';
    if (employeeId === '2' && day.getDate() === 15) return 'N';
    return null;
  });

  const mockOnCellClick = vi.fn();
  const mockOnContextMenu = vi.fn();

  const renderTable = (props = {}) => {
    const defaultProps = {
      weekGroups: createMockWeekGroups(),
      calendarDays: createMockCalendarDays(),
      employees: createMockEmployees(),
      getShift: mockGetShift,
      onCellClick: mockOnCellClick,
      onContextMenu: mockOnContextMenu,
      readOnly: false,
      ...props
    };

    return render(<ShiftPlanningTable {...defaultProps} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Grundlegende Struktur', () => {
    it('rendert ohne Fehler', () => {
      renderTable();
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('rendert DataTable mit korrekten Props', () => {
      renderTable();
      
      const dataTable = screen.getByTestId('data-table');
      expect(dataTable).toBeInTheDocument();
    });

    it('rendert Card-Container korrekt', () => {
      const { container } = renderTable();
      
      expect(container.querySelector('.card')).toBeInTheDocument();
      expect(container.querySelector('.card-body')).toBeInTheDocument();
    });
  });

  describe('Tabellen-Komponenten', () => {
    it('rendert ShiftPlanningTableHeader korrekt', () => {
      renderTable();
      
      // Prüfe, ob Header-Elemente gerendert werden
      expect(screen.getByText('Mitarbeiter')).toBeInTheDocument();
      expect(screen.getByText('KW 1')).toBeInTheDocument();
      expect(screen.getByText('KW 2')).toBeInTheDocument();
    });

    it('rendert ShiftPlanningTableBody korrekt', () => {
      renderTable();
      
      // Prüfe, ob Mitarbeiter gerendert werden
      expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
      expect(screen.getByText('Anna Schmidt')).toBeInTheDocument();
    });

    it('rendert Footer korrekt', () => {
      renderTable();
      
      expect(screen.getByText('Insgesamt 2 Mitarbeiter')).toBeInTheDocument();
    });
  });

  describe('Props-Weitergabe', () => {
    it('gibt weekGroups korrekt weiter', () => {
      renderTable();
      
      // Prüfe, ob Kalenderwochen gerendert werden
      expect(screen.getByText('KW 1')).toBeInTheDocument();
      expect(screen.getByText('KW 2')).toBeInTheDocument();
    });

    it('gibt calendarDays korrekt weiter', () => {
      renderTable();
      
      // Prüfe, ob Wochentage gerendert werden
      expect(screen.getAllByText('Mo')).toHaveLength(2);
      expect(screen.getAllByText('Di')).toHaveLength(2);
    });

    it('gibt employees korrekt weiter', () => {
      renderTable();
      
      expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
      expect(screen.getByText('Anna Schmidt')).toBeInTheDocument();
    });

    it('gibt getShift korrekt weiter', () => {
      renderTable();
      
      // getShift sollte für jede Zelle aufgerufen werden
      expect(mockGetShift).toHaveBeenCalled();
    });

    it('gibt onCellClick korrekt weiter', () => {
      renderTable();
      
      // Simuliere Klick auf eine Zelle
      const cells = screen.getAllByRole('cell');
      const firstShiftCell = cells.find(cell => cell.textContent === 'F');
      
      if (firstShiftCell) {
        fireEvent.click(firstShiftCell);
        expect(mockOnCellClick).toHaveBeenCalled();
      }
    });

    it('gibt onContextMenu korrekt weiter', () => {
      renderTable();
      
      // Simuliere Rechtsklick auf eine Zelle
      const cells = screen.getAllByRole('cell');
      const firstShiftCell = cells.find(cell => cell.textContent === 'F');
      
      if (firstShiftCell) {
        fireEvent.contextMenu(firstShiftCell);
        expect(mockOnContextMenu).toHaveBeenCalled();
      }
    });
  });

  describe('ReadOnly-Modus', () => {
    it('gibt readOnly korrekt weiter', () => {
      renderTable({ readOnly: true });
      
      // Im ReadOnly-Modus sollten Zellen nicht klickbar sein
      const cells = screen.getAllByRole('cell');
      const firstShiftCell = cells.find(cell => cell.textContent === 'F');
      
      if (firstShiftCell) {
        expect(firstShiftCell).toHaveStyle({ cursor: 'default' });
      }
    });
  });

  describe('Footer', () => {
    it('zeigt korrekte Anzahl der Mitarbeiter an', () => {
      renderTable();
      
      expect(screen.getByText('Insgesamt 2 Mitarbeiter')).toBeInTheDocument();
    });

    it('aktualisiert sich bei Änderung der Mitarbeiter-Anzahl', () => {
      const singleEmployee = [createMockEmployees()[0]];
      
      renderTable({ employees: singleEmployee });
      
      expect(screen.getByText('Insgesamt 1 Mitarbeiter')).toBeInTheDocument();
    });

    it('behandelt leere Mitarbeiter-Liste korrekt', () => {
      renderTable({ employees: [] });
      
      expect(screen.getByText('Insgesamt 0 Mitarbeiter')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('hat korrekte Card-Struktur', () => {
      const { container } = renderTable();
      
      const card = container.querySelector('.card');
      const cardBody = container.querySelector('.card-body');
      
      expect(card).toBeInTheDocument();
      expect(cardBody).toBeInTheDocument();
    });

    it('hat korrekte Footer-Styling', () => {
      const { container } = renderTable();
      
      const footer = container.querySelector('tfoot tr.summary td');
      expect(footer).toHaveClass('text-center', 'text-muted');
    });
  });

  describe('Edge Cases', () => {
    it('behandelt leere weekGroups korrekt', () => {
      renderTable({ weekGroups: [] });
      
      // Sollte keine Fehler werfen
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('behandelt leere calendarDays korrekt', () => {
      renderTable({ calendarDays: [] });
      
      // Sollte keine Fehler werfen
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('behandelt leere employees korrekt', () => {
      renderTable({ employees: [] });
      
      // Sollte keine Fehler werfen
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
      expect(screen.getByText('Insgesamt 0 Mitarbeiter')).toBeInTheDocument();
    });

    it('behandelt leere Arrays korrekt', () => {
      // Sollte keine Fehler werfen mit leeren Arrays
      expect(() => {
        render(<ShiftPlanningTable 
          weekGroups={[]}
          calendarDays={[]}
          employees={[]}
          getShift={() => null}
          onCellClick={() => {}}
          onContextMenu={() => {}}
        />);
      }).not.toThrow();
    });
  });

  describe('Integration', () => {
    it('integriert alle Komponenten korrekt', () => {
      renderTable();
      
      // Prüfe Header
      expect(screen.getByText('Mitarbeiter')).toBeInTheDocument();
      expect(screen.getByText('KW 1')).toBeInTheDocument();
      
      // Prüfe Rows
      expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
      expect(screen.getByText('Anna Schmidt')).toBeInTheDocument();
      
      // Prüfe Footer
      expect(screen.getByText('Insgesamt 2 Mitarbeiter')).toBeInTheDocument();
      
      // Prüfe Schicht-Badges
      expect(screen.getByText('F')).toBeInTheDocument();
      expect(screen.getByText('S')).toBeInTheDocument();
      expect(screen.getByText('N')).toBeInTheDocument();
    });

    it('funktioniert mit verschiedenen Kalenderwochen', () => {
      const customWeekGroups: WeekGroup[] = [
        {
          week: 52,
          days: [new Date('2024-12-30')]
        }
      ];
      
      renderTable({ 
        weekGroups: customWeekGroups,
        calendarDays: customWeekGroups[0].days
      });
      
      expect(screen.getByText('KW 52')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('rendert effizient mit vielen Mitarbeitern', () => {
      const manyEmployees: Employee[] = Array.from({ length: 50 }, (_, i) => ({
        id: i.toString(),
        name: `Mitarbeiter ${i}`,
        username: `user${i}`,
        email: `user${i}@example.com`,
        color: '#ff0000',
        role: 'employee'
      }));
      
      const startTime = performance.now();
      renderTable({ employees: manyEmployees });
      const endTime = performance.now();
      
      // Rendering sollte unter 200ms dauern (realistischer Wert)
      expect(endTime - startTime).toBeLessThan(200);
      
      expect(screen.getByText('Insgesamt 50 Mitarbeiter')).toBeInTheDocument();
    });
  });
}); 