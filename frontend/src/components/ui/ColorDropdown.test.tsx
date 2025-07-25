import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ColorDropdown from './ColorDropdown';

describe('ColorDropdown', () => {
  const mockColorOptions = [
    { value: '#206bc4', label: 'Blau' },
    { value: '#4299e1', label: 'Hellblau' },
    { value: '#2d3748', label: 'Grau' },
    { value: '#48bb78', label: 'Grün' },
    { value: '#ed8936', label: 'Orange' },
    { value: '#e53e3e', label: 'Rot' }
  ];

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('rendert das ColorDropdown mit Platzhalter', () => {
    render(<ColorDropdown value="" onChange={mockOnChange} options={mockColorOptions} />);
    expect(screen.getByText('Farbe auswählen')).toBeInTheDocument();
  });

  it('rendert die ausgewählte Farbe', () => {
    render(<ColorDropdown value="#206bc4" onChange={mockOnChange} options={mockColorOptions} />);
    expect(screen.getByText('Blau')).toBeInTheDocument();
  });

  it('zeigt Farbvorschau für ausgewählte Farbe', () => {
    render(<ColorDropdown value="#206bc4" onChange={mockOnChange} options={mockColorOptions} />);
    
    const colorPreview = screen.getByText('Blau').previousElementSibling;
    expect(colorPreview).toHaveStyle({ backgroundColor: '#206bc4' });
  });

  it('öffnet das Dropdown-Menü beim Klick', async () => {
    render(<ColorDropdown value="" onChange={mockOnChange} options={mockColorOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Blau')).toBeInTheDocument();
      expect(screen.getByText('Hellblau')).toBeInTheDocument();
      expect(screen.getByText('Grau')).toBeInTheDocument();
    });
  });

  it('zeigt Farbvorschau für alle Optionen im Dropdown', async () => {
    render(<ColorDropdown value="" onChange={mockOnChange} options={mockColorOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      // Prüfe, dass alle Farbvorschauen vorhanden sind (6 im Dropdown + 1 im Button)
      const colorPreviews = document.querySelectorAll('.color-preview');
      expect(colorPreviews).toHaveLength(mockColorOptions.length + 1);
      
      // Prüfe spezifische Farben
      const bluePreview = screen.getByText('Blau').previousElementSibling;
      expect(bluePreview).toHaveStyle({ backgroundColor: '#206bc4' });
      
      const redPreview = screen.getByText('Rot').previousElementSibling;
      expect(redPreview).toHaveStyle({ backgroundColor: '#e53e3e' });
    });
  });

  it('ruft onChange auf, wenn eine Farbe ausgewählt wird', async () => {
    render(<ColorDropdown value="" onChange={mockOnChange} options={mockColorOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const blueOption = screen.getByText('Blau');
      fireEvent.click(blueOption);
    });

    expect(mockOnChange).toHaveBeenCalledWith('#206bc4');
  });

  it('schließt das Dropdown nach Auswahl einer Farbe', async () => {
    render(<ColorDropdown value="" onChange={mockOnChange} options={mockColorOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const blueOption = screen.getByText('Blau');
      fireEvent.click(blueOption);
    });

    await waitFor(() => {
      expect(screen.queryByText('Hellblau')).not.toBeInTheDocument();
    });
  });

  it('zeigt Fehlermeldungen an', () => {
    render(
      <ColorDropdown 
        value="" 
        onChange={mockOnChange} 
        options={mockColorOptions} 
        error="Ungültige Farbe"
      />
    );
    
    expect(screen.getByText('Ungültige Farbe')).toBeInTheDocument();
  });

  it('ist deaktiviert, wenn disabled prop gesetzt ist', () => {
    render(<ColorDropdown value="" onChange={mockOnChange} options={mockColorOptions} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('hat korrekte CSS-Klassen für Farbvorschau', () => {
    render(<ColorDropdown value="#206bc4" onChange={mockOnChange} options={mockColorOptions} />);
    
    const colorPreview = screen.getByText('Blau').previousElementSibling;
    expect(colorPreview).toHaveClass('color-preview', 'me-2');
  });

  it('hat korrekte Styling-Eigenschaften für Farbvorschau', () => {
    render(<ColorDropdown value="#206bc4" onChange={mockOnChange} options={mockColorOptions} />);
    
    const colorPreview = screen.getByText('Blau').previousElementSibling;
    expect(colorPreview).toHaveStyle({
      display: 'inline-block',
      width: '20px',
      height: '20px',
      borderRadius: '3px'
    });
  });

  it('zeigt ausgewählte Farbe als fett markiert im Dropdown', async () => {
    render(<ColorDropdown value="#206bc4" onChange={mockOnChange} options={mockColorOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const blueOptions = screen.getAllByText('Blau');
      // Der erste ist im Button, der zweite im Dropdown-Menü
      const dropdownOption = blueOptions[1];
      expect(dropdownOption).toHaveClass('fw-bold');
    });
  });

  it('verwendet korrekte name und id Props', () => {
    render(
      <ColorDropdown 
        value="" 
        onChange={mockOnChange} 
        options={mockColorOptions} 
        name="user-color"
        id="color-selector"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('id', 'color-selector');
    
    const hiddenInput = document.querySelector('input[name="user-color"]');
    expect(hiddenInput).toBeInTheDocument();
  });
}); 