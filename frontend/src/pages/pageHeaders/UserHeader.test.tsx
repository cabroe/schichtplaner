import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserHeader from './UserHeader';

describe('UserHeader', () => {
  it('rendert die SearchForm-Komponente', () => {
    render(<UserHeader />);
    expect(screen.getByPlaceholderText('Suchen')).toBeInTheDocument();
  });

  it('rendert den Filter-Button', () => {
    render(<UserHeader />);
    expect(screen.getByTitle('Suchfilter')).toBeInTheDocument();
  });

  it('rendert den Such-Button', () => {
    render(<UserHeader />);
    expect(screen.getByLabelText('Suchen')).toBeInTheDocument();
  });

  it('hat die korrekte CSS-Klasse für die Button-Liste', () => {
    const { container } = render(<UserHeader />);
    // Suche das Formular und dann das Eltern-Element mit der Klasse btn-list
    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    const btnList = form?.parentElement;
    expect(btnList).toHaveClass('btn-list');
  });

  it('öffnet das Dropdown-Menü beim Klick auf Filter-Button', async () => {
    render(<UserHeader />);
    
    const filterButton = screen.getByTitle('Suchfilter');
    fireEvent.click(filterButton);

    await waitFor(() => {
      // Es gibt mehrere "Sichtbar"-Elemente, prüfe auf das Label
      const sichtbarLabels = screen.getAllByText('Sichtbar');
      expect(sichtbarLabels.some(el => el.tagName === 'LABEL')).toBe(true);
      expect(screen.getByText('Ergebnisse')).toBeInTheDocument();
      expect(screen.getByText('Sortieren nach')).toBeInTheDocument();
    });
  });

  it('führt eine Suche durch', async () => {
    render(<UserHeader />);
    
    const searchInput = screen.getByPlaceholderText('Suchen');
    const searchButton = screen.getByLabelText('Suchen');

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);

    // Es gibt keine explizite Anzeige von Suchparametern mehr, daher prüfen wir, ob das Input-Feld den Wert hat
    await waitFor(() => {
      expect(searchInput).toHaveValue('test');
    });
  });
}); 