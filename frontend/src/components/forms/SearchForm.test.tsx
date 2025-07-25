import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchForm from './SearchForm';

describe('SearchForm', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('rendert das Suchfeld', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText('Suchen')).toBeInTheDocument();
  });

  it('rendert den Filter-Button', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    expect(screen.getByTitle('Suchfilter')).toBeInTheDocument();
  });

  it('rendert den Such-Button', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    expect(screen.getByLabelText('Suchen')).toBeInTheDocument();
  });

  it('öffnet das Dropdown-Menü beim Klick auf Filter-Button', async () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const filterButton = screen.getByTitle('Suchfilter');
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText('Sichtbar')).toBeInTheDocument();
      expect(screen.getByText('Ergebnisse')).toBeInTheDocument();
      expect(screen.getByText('Sortieren nach')).toBeInTheDocument();
    });
  });

  it('ruft onSearch mit korrekten Daten auf', async () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Suchen');
    const searchButton = screen.getByLabelText('Suchen');

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({
        searchTerm: 'test',
        visibility: '1',
        size: '50',
        orderBy: 'name',
        order: 'ASC',
        page: 1
      });
    });
  });

  it('zeigt Loading-Zustand an', () => {
    render(<SearchForm onSearch={mockOnSearch} loading={true} />);
    
    expect(screen.getByText('Suchen...')).toBeInTheDocument();
    expect(screen.getByLabelText('Suchen')).toBeDisabled();
  });

  it('hat Standardwerte für alle Felder', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Suchen');
    expect(searchInput).toHaveValue('');
  });

  it('verhindert Standard-Formular-Submission', async () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalled();
    });
  });
}); 