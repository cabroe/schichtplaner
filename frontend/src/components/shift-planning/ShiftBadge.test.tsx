import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ShiftBadge from './ShiftBadge';
import type { ShiftType } from '../../types/shift';

describe('ShiftBadge', () => {
  const renderShiftBadge = (shiftType: ShiftType, compact = true) => {
    return render(<ShiftBadge shiftType={shiftType} compact={compact} />);
  };

  describe('Schichttypen', () => {
    it('rendert Frühschicht korrekt', () => {
      renderShiftBadge('F');
      expect(screen.getByText('F')).toBeInTheDocument();
      expect(screen.getByTitle('Frühschicht')).toBeInTheDocument();
    });

    it('rendert Spätschicht korrekt', () => {
      renderShiftBadge('S');
      expect(screen.getByText('S')).toBeInTheDocument();
      expect(screen.getByTitle('Spätschicht')).toBeInTheDocument();
    });

    it('rendert Nachtschicht korrekt', () => {
      renderShiftBadge('N');
      expect(screen.getByText('N')).toBeInTheDocument();
      expect(screen.getByTitle('Nachtschicht')).toBeInTheDocument();
    });

    it('rendert Urlaub korrekt', () => {
      renderShiftBadge('U');
      expect(screen.getByText('U')).toBeInTheDocument();
      expect(screen.getByTitle('Urlaub')).toBeInTheDocument();
    });

    it('rendert Krank korrekt', () => {
      renderShiftBadge('K');
      expect(screen.getByText('K')).toBeInTheDocument();
      expect(screen.getByTitle('Krank')).toBeInTheDocument();
    });

    it('rendert Frei korrekt', () => {
      renderShiftBadge('FR');
      expect(screen.getByText('FR')).toBeInTheDocument();
      expect(screen.getByTitle('Frei')).toBeInTheDocument();
    });

    it('rendert Feiertag korrekt', () => {
      renderShiftBadge('FT');
      expect(screen.getByText('FT')).toBeInTheDocument();
      expect(screen.getByTitle('Feiertag')).toBeInTheDocument();
    });

    it('rendert Wochenende korrekt', () => {
      renderShiftBadge('WE');
      expect(screen.getByText('WE')).toBeInTheDocument();
      expect(screen.getByTitle('Wochenende')).toBeInTheDocument();
    });
  });

  describe('Leere Schicht', () => {
    it('rendert leere Schicht korrekt', () => {
      renderShiftBadge(null);
      const emptyBadge = screen.getByText('').closest('span');
      expect(emptyBadge).toHaveClass('shift-badge', 'empty');
    });
  });

  describe('Unbekannte Schichttypen', () => {
    it('rendert unbekannte Schichttypen korrekt', () => {
      renderShiftBadge('UNKNOWN' as ShiftType);
      expect(screen.getByText('UN')).toBeInTheDocument();
      expect(screen.getByTitle('UNKNOWN')).toBeInTheDocument();
    });
  });

  describe('Kompakt-Modus', () => {
    it('rendert kompakten Badge korrekt', () => {
      renderShiftBadge('F', true);
      const badge = screen.getByText('F');
      expect(badge).toBeInTheDocument();
    });

    it('rendert normalen Badge korrekt', () => {
      renderShiftBadge('F', false);
      const badge = screen.getByText('F');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('hat korrekte CSS-Klassen für Frühschicht', () => {
      renderShiftBadge('F');
      const badge = screen.getByText('F');
      expect(badge).toHaveClass('badge', 'bg-primary');
    });

    it('hat korrekte CSS-Klassen für Spätschicht', () => {
      renderShiftBadge('S');
      const badge = screen.getByText('S');
      expect(badge).toHaveClass('badge', 'bg-success');
    });

    it('hat korrekte CSS-Klassen für Nachtschicht', () => {
      renderShiftBadge('N');
      const badge = screen.getByText('N');
      expect(badge).toHaveClass('badge', 'bg-danger');
    });

    it('hat korrekte CSS-Klassen für Urlaub', () => {
      renderShiftBadge('U');
      const badge = screen.getByText('U');
      expect(badge).toHaveClass('badge', 'bg-warning');
    });

    it('hat korrekte CSS-Klassen für Krank', () => {
      renderShiftBadge('K');
      const badge = screen.getByText('K');
      expect(badge).toHaveClass('badge', 'bg-info');
    });

    it('hat korrekte CSS-Klassen für Frei', () => {
      renderShiftBadge('FR');
      const badge = screen.getByText('FR');
      expect(badge).toHaveClass('badge', 'bg-secondary');
    });

    it('hat korrekte CSS-Klassen für Feiertag', () => {
      renderShiftBadge('FT');
      const badge = screen.getByText('FT');
      expect(badge).toHaveClass('badge', 'bg-light', 'text-dark');
    });

    it('hat korrekte CSS-Klassen für Wochenende', () => {
      renderShiftBadge('WE');
      const badge = screen.getByText('WE');
      expect(badge).toHaveClass('badge', 'bg-dark');
    });
  });

  describe('Tooltips', () => {
    it('zeigt korrekte Tooltips für alle Schichttypen', () => {
      const testCases = [
        { shift: 'F', tooltip: 'Frühschicht' },
        { shift: 'S', tooltip: 'Spätschicht' },
        { shift: 'N', tooltip: 'Nachtschicht' },
        { shift: 'U', tooltip: 'Urlaub' },
        { shift: 'K', tooltip: 'Krank' },
        { shift: 'FR', tooltip: 'Frei' },
        { shift: 'FT', tooltip: 'Feiertag' },
        { shift: 'WE', tooltip: 'Wochenende' }
      ];

      testCases.forEach(({ shift, tooltip }) => {
        const { unmount } = renderShiftBadge(shift as ShiftType);
        expect(screen.getByTitle(tooltip)).toBeInTheDocument();
        unmount();
      });
    });
  });
}); 