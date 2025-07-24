
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShiftPlanningTableBody from './ShiftPlanningTableBody';
import type { Employee, ShiftType } from '../../types/shift';

describe('ShiftPlanningTableBody', () => {
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

  const createMockCalendarDays = (): Date[] => [
    new Date('2024-01-15'), // Montag
    new Date('2024-01-16'), // Dienstag
    new Date('2024-01-17'), // Mittwoch
    new Date('2024-01-18'), // Donnerstag
    new Date('2024-01-19'), // Freitag
  ];

  const mockGetShift = vi.fn((employeeId: string, day: Date): ShiftType => {
    if (employeeId === '1' && day.getDate() === 15) return 'F';
    if (employeeId === '1' && day.getDate() === 16) return 'S';
    if (employeeId === '2' && day.getDate() === 15) return 'N';
    return null;
  });

  const mockOnCellClick = vi.fn();
  const mockOnContextMenu = vi.fn();

  const renderRows = (props = {}) => {
    const defaultProps = {
      employees: createMockEmployees(),
      calendarDays: createMockCalendarDays(),
      getShift: mockGetShift,
      onCellClick: mockOnCellClick,
      onContextMenu: mockOnContextMenu,
      readOnly: false,
      ...props
    };

    return render(
      <table>
        <ShiftPlanningTableBody {...defaultProps} />
      </table>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Grundlegende Struktur', () => {
    it('rendert ohne Fehler', () => {
      renderRows();
      expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
      expect(screen.getByText('Anna Schmidt')).toBeInTheDocument();
    });

    it('rendert alle Mitarbeiter korrekt', () => {
      renderRows();
      
      expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
      expect(screen.getByText('max.mustermann')).toBeInTheDocument();
      expect(screen.getByText('Anna Schmidt')).toBeInTheDocument();
      expect(screen.getByText('anna.schmidt')).toBeInTheDocument();
    });

    it('rendert Schicht-Badges korrekt', () => {
      renderRows();
      
      // Prüfe, ob Schicht-Badges gerendert werden
      expect(screen.getByText('F')).toBeInTheDocument(); // Frühschicht
      expect(screen.getByText('S')).toBeInTheDocument(); // Spätschicht
      expect(screen.getByText('N')).toBeInTheDocument(); // Nachtschicht
    });
  });

  describe('Mitarbeiter-Darstellung', () => {
    it('zeigt Mitarbeiter-Namen korrekt an', () => {
      renderRows();
      
      expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
      expect(screen.getByText('Anna Schmidt')).toBeInTheDocument();
    });

    it('zeigt Benutzernamen korrekt an', () => {
      renderRows();
      
      expect(screen.getByText('max.mustermann')).toBeInTheDocument();
      expect(screen.getByText('anna.schmidt')).toBeInTheDocument();
    });

    it('zeigt Mitarbeiter-Farben korrekt an', () => {
      const { container } = renderRows();
      
      const colorDots = container.querySelectorAll('.rounded-circle');
      expect(colorDots[0]).toHaveStyle({ backgroundColor: '#ff0000' });
      expect(colorDots[1]).toHaveStyle({ backgroundColor: '#00ff00' });
    });

    it('verwendet Standard-Farbe wenn keine Farbe definiert', () => {
      const employeesWithoutColor: Employee[] = [
        {
          id: '1',
          name: 'Max Mustermann',
          username: 'max.mustermann',
          email: 'max@example.com',
          color: '',
          role: 'employee'
        }
      ];

      const { container } = renderRows({ employees: employeesWithoutColor });
      
      const colorDot = container.querySelector('.rounded-circle');
      expect(colorDot).toHaveStyle({ backgroundColor: '#6c757d' });
    });
  });

  describe('Schicht-Zellen', () => {
    it('ruft getShift für jede Zelle auf', () => {
      renderRows();
      
      // 2 Mitarbeiter × 5 Tage = 10 Aufrufe
      expect(mockGetShift).toHaveBeenCalledTimes(10);
    });

    it('zeigt korrekte Schicht-Badges an', () => {
      renderRows();
      
      expect(screen.getByText('F')).toBeInTheDocument();
      expect(screen.getByText('S')).toBeInTheDocument();
      expect(screen.getByText('N')).toBeInTheDocument();
    });

    it('zeigt leere Zellen für null-Schichten', () => {
      renderRows();
      
      // Die meisten Zellen sollten leer sein (null-Schichten)
      const emptyCells = screen.getAllByText('').filter(el => el.closest('td'));
      expect(emptyCells.length).toBeGreaterThan(0);
    });

    it('hat korrekte Tooltips für Schicht-Zellen', () => {
      renderRows();
      
      const fBadge = screen.getByText('F');
      expect(fBadge).toHaveAttribute('title', 'Frühschicht');
      
      const sBadge = screen.getByText('S');
      expect(sBadge).toHaveAttribute('title', 'Spätschicht');
      
      const nBadge = screen.getByText('N');
      expect(nBadge).toHaveAttribute('title', 'Nachtschicht');
    });
  });

  describe('Interaktionen', () => {
    it('ruft onCellClick beim Klick auf eine Zelle auf', () => {
      renderRows();
      
      const cells = screen.getAllByRole('cell');
      const firstShiftCell = cells.find(cell => cell.textContent === 'F');
      
      if (firstShiftCell) {
        fireEvent.click(firstShiftCell);
        expect(mockOnCellClick).toHaveBeenCalledTimes(1);
      }
    });

    it('ruft onContextMenu beim Rechtsklick auf eine Zelle auf', () => {
      renderRows();
      
      const cells = screen.getAllByRole('cell');
      const firstShiftCell = cells.find(cell => cell.textContent === 'F');
      
      if (firstShiftCell) {
        fireEvent.contextMenu(firstShiftCell);
        expect(mockOnContextMenu).toHaveBeenCalledTimes(1);
      }
    });


  });

  describe('ReadOnly-Modus', () => {
    it('deaktiviert Interaktionen im ReadOnly-Modus', () => {
      renderRows({ readOnly: true });
      
      const cells = screen.getAllByRole('cell');
      const firstShiftCell = cells.find(cell => cell.textContent === 'F');
      
      if (firstShiftCell) {
        expect(firstShiftCell).toHaveStyle({ cursor: 'default' });
      }
    });

    it('ruft keine Callbacks im ReadOnly-Modus auf', () => {
      renderRows({ readOnly: true });
      
      const cells = screen.getAllByRole('cell');
      const firstShiftCell = cells.find(cell => cell.textContent === 'F');
      
      if (firstShiftCell) {
        fireEvent.click(firstShiftCell);
        fireEvent.contextMenu(firstShiftCell);
        
        expect(mockOnCellClick).not.toHaveBeenCalled();
        expect(mockOnContextMenu).not.toHaveBeenCalled();
      }
    });
  });

  describe('Styling', () => {
    it('hat korrekte CSS-Klassen für Tabellen-Zellen', () => {
      const { container } = renderRows();
      
      const cells = container.querySelectorAll('td.text-center.position-relative');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('hat korrekte Mindesthöhe für Zellen', () => {
      const { container } = renderRows();
      
      const cells = container.querySelectorAll('td.text-center.position-relative');
      cells.forEach(cell => {
        expect(cell).toHaveStyle({ minHeight: '60px' });
      });
    });

    it('hat korrekte Mitarbeiter-Zellen-Struktur', () => {
      const { container } = renderRows();
      
      const employeeCells = container.querySelectorAll('td');
      const firstEmployeeCell = employeeCells[0];
      
      expect(firstEmployeeCell).toContainElement(screen.getByText('Max Mustermann'));
      expect(firstEmployeeCell).toContainElement(screen.getByText('max.mustermann'));
    });
  });

  describe('Edge Cases', () => {
    it('behandelt leere Mitarbeiter-Liste korrekt', () => {
      renderRows({ employees: [] });
      
      // Sollte keine Fehler werfen
      expect(screen.queryByText('Max Mustermann')).not.toBeInTheDocument();
    });

    it('behandelt leere Kalender-Tage korrekt', () => {
      renderRows({ calendarDays: [] });
      
      // Sollte keine Fehler werfen
      expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    });

    it('behandelt Mitarbeiter ohne Namen korrekt', () => {
      const employeesWithoutName: Employee[] = [
        {
          id: '1',
          name: '',
          username: 'max.mustermann',
          email: 'max@example.com',
          color: '#ff0000',
          role: 'employee'
        }
      ];

      renderRows({ employees: employeesWithoutName });
      
      expect(screen.getByText('max.mustermann')).toBeInTheDocument();
    });

    it('behandelt Mitarbeiter ohne Benutzername korrekt', () => {
      const employeesWithoutUsername: Employee[] = [
        {
          id: '1',
          name: 'Max Mustermann',
          username: '',
          email: 'max@example.com',
          color: '#ff0000',
          role: 'employee'
        }
      ];

      renderRows({ employees: employeesWithoutUsername });
      
      expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    });
  });

  describe('Callback-Parameter', () => {
    it('übergibt korrekte Parameter an onCellClick', () => {
      renderRows();
      
      const cells = screen.getAllByRole('cell');
      const firstShiftCell = cells.find(cell => cell.textContent === 'F');
      
      if (firstShiftCell) {
        fireEvent.click(firstShiftCell);
        
        expect(mockOnCellClick).toHaveBeenCalledWith(
          expect.objectContaining({
            id: '1',
            name: 'Max Mustermann'
          }),
          expect.any(Date),
          'F'
        );
      }
    });

    it('übergibt korrekte Parameter an onContextMenu', () => {
      renderRows();
      
      const cells = screen.getAllByRole('cell');
      const firstShiftCell = cells.find(cell => cell.textContent === 'F');
      
      if (firstShiftCell) {
        fireEvent.contextMenu(firstShiftCell);
        
        expect(mockOnContextMenu).toHaveBeenCalledWith(
          expect.any(Object), // Event
          expect.objectContaining({
            id: '1',
            name: 'Max Mustermann'
          }),
          expect.any(Date),
          'F'
        );
      }
    });
  });
}); 