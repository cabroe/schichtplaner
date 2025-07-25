import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserHeader from './UserHeader';

describe('UserHeader', () => {
  it('rendert die SearchForm-Komponente', () => {
    render(<UserHeader />);
    expect(screen.getByPlaceholderText('Suchen')).toBeInTheDocument();
  });

  it('rendert den Darstellung anpassen Button', () => {
    render(<UserHeader />);
    expect(screen.getByTitle('Darstellung anpassen')).toBeInTheDocument();
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
    render(<UserHeader />);
    const btnList = screen.getByTitle('Darstellung anpassen').closest('.btn-list');
    expect(btnList).toHaveClass('btn-list');
  });

  it('öffnet das Dropdown-Menü beim Klick auf Filter-Button', async () => {
    render(<UserHeader />);
    
    const filterButton = screen.getByTitle('Suchfilter');
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText('Sichtbar')).toBeInTheDocument();
      expect(screen.getByText('Ergebnisse')).toBeInTheDocument();
      expect(screen.getByText('Sortieren nach')).toBeInTheDocument();
    });
  });

  it('führt eine Suche durch und zeigt Ergebnisse an', async () => {
    render(<UserHeader />);
    
    const searchInput = screen.getByPlaceholderText('Suchen');
    const searchButton = screen.getByLabelText('Suchen');

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Suchparameter:')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
}); 