import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dropdown from './Dropdown';

describe('Dropdown', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true }
  ];

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('rendert das Dropdown mit Platzhalter', () => {
    render(<Dropdown value="" onChange={mockOnChange} options={mockOptions} />);
    expect(screen.getByText('Auswählen...')).toBeInTheDocument();
  });

  it('rendert den ausgewählten Wert', () => {
    render(<Dropdown value="option1" onChange={mockOnChange} options={mockOptions} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('öffnet das Dropdown-Menü beim Klick', async () => {
    render(<Dropdown value="" onChange={mockOnChange} options={mockOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  it('ruft onChange auf, wenn eine Option ausgewählt wird', async () => {
    render(<Dropdown value="" onChange={mockOnChange} options={mockOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const option1 = screen.getByText('Option 1');
      fireEvent.click(option1);
    });

    expect(mockOnChange).toHaveBeenCalledWith('option1');
  });

  it('schließt das Dropdown nach Auswahl einer Option', async () => {
    render(<Dropdown value="" onChange={mockOnChange} options={mockOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const option1 = screen.getByText('Option 1');
      fireEvent.click(option1);
    });

    await waitFor(() => {
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });
  });

  it('zeigt deaktivierte Optionen an', async () => {
    render(<Dropdown value="" onChange={mockOnChange} options={mockOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const disabledOption = screen.getByText('Option 3');
      expect(disabledOption.closest('button')).toBeDisabled();
    });
  });

  it('ruft onChange nicht auf für deaktivierte Optionen', async () => {
    render(<Dropdown value="" onChange={mockOnChange} options={mockOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const disabledOption = screen.getByText('Option 3');
      fireEvent.click(disabledOption);
    });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('zeigt Fehlermeldungen an', () => {
    render(
      <Dropdown 
        value="" 
        onChange={mockOnChange} 
        options={mockOptions} 
        error="Dies ist ein Fehler"
      />
    );
    
    expect(screen.getByText('Dies ist ein Fehler')).toBeInTheDocument();
  });

  it('ist deaktiviert, wenn disabled prop gesetzt ist', () => {
    render(<Dropdown value="" onChange={mockOnChange} options={mockOptions} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('verwendet custom placeholder', () => {
    render(
      <Dropdown 
        value="" 
        onChange={mockOnChange} 
        options={mockOptions} 
        placeholder="Bitte wählen"
      />
    );
    
    expect(screen.getByText('Bitte wählen')).toBeInTheDocument();
  });

  it('rendert custom Optionen mit renderOption', async () => {
    const customRenderOption = (option: any, isSelected: boolean) => (
      <span data-testid={`option-${option.value}`} className={isSelected ? 'selected' : ''}>
        Custom: {option.label}
      </span>
    );

    render(
      <Dropdown 
        value="" 
        onChange={mockOnChange} 
        options={mockOptions} 
        renderOption={customRenderOption}
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('option-option1')).toBeInTheDocument();
      expect(screen.getByText('Custom: Option 1')).toBeInTheDocument();
    });
  });
}); 