import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import DataTable from './DataTable';

describe('DataTable', () => {
  const mockChildren = (
    <tbody>
      <tr>
        <td>Test Data</td>
      </tr>
    </tbody>
  );

  describe('Grundlegende Funktionalität', () => {
    it('rendert eine Tabelle mit Standard-Klassen', () => {
      render(<DataTable>{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveClass('table', 'table-vcenter', 'table-hover', 'dataTable');
    });

    it('rendert children korrekt', () => {
      render(<DataTable>{mockChildren}</DataTable>);
      
      expect(screen.getByText('Test Data')).toBeInTheDocument();
    });

    it('wendet benutzerdefinierte className an', () => {
      render(<DataTable className="custom-class">{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('custom-class');
    });

    it('setzt die id korrekt', () => {
      render(<DataTable id="test-table">{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('id', 'test-table');
    });
  });

  describe('Responsive Verhalten', () => {
    it('umschließt Tabelle mit table-responsive div standardmäßig', () => {
      render(<DataTable>{mockChildren}</DataTable>);
      
      const responsiveDiv = screen.getByRole('table').parentElement;
      expect(responsiveDiv).toHaveClass('table-responsive');
    });

    it('umschließt Tabelle mit table-responsive div wenn responsive=true', () => {
      render(<DataTable responsive={true}>{mockChildren}</DataTable>);
      
      const responsiveDiv = screen.getByRole('table').parentElement;
      expect(responsiveDiv).toHaveClass('table-responsive');
    });

    it('umschließt Tabelle mit benutzerdefinierter responsive Klasse', () => {
      render(<DataTable responsive="lg">{mockChildren}</DataTable>);
      
      const responsiveDiv = screen.getByRole('table').parentElement;
      expect(responsiveDiv).toHaveClass('table-responsive-lg');
    });

    it('rendert Tabelle ohne responsive Wrapper wenn responsive=false', () => {
      render(<DataTable responsive={false}>{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      const parent = table.parentElement;
      
      // Tabelle sollte direkt im Container sein, nicht in einem responsive div
      expect(parent).not.toHaveClass('table-responsive');
    });
  });

  describe('Tabellen-Styling Props', () => {
    it('wendet striped Styling an', () => {
      render(<DataTable striped>{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('table-striped');
    });

    it('wendet bordered Styling an', () => {
      render(<DataTable bordered>{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('table-bordered');
    });

    it('wendet darkMode Styling an', () => {
      render(<DataTable darkMode>{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('table-dark');
    });

    it('wendet size="sm" an', () => {
      render(<DataTable size="sm">{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('table-sm');
    });

    it('wendet size="lg" an', () => {
      render(<DataTable size="lg">{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('table-lg');
    });

    it('wendet size=undefined nicht an', () => {
      render(<DataTable size={undefined}>{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).not.toHaveClass('table-undefined');
    });
  });

  describe('Kombinierte Props', () => {
    it('wendet mehrere Styling-Props gleichzeitig an', () => {
      render(
        <DataTable 
          striped 
          bordered 
          darkMode 
          size="lg"
          className="custom-class"
        >
          {mockChildren}
        </DataTable>
      );
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass(
        'table',
        'table-vcenter', 
        'table-hover',
        'dataTable',
        'table-striped',
        'table-bordered',
        'table-dark',
        'table-lg',
        'custom-class'
      );
    });

    it('kombiniert responsive mit anderen Props korrekt', () => {
      render(
        <DataTable 
          responsive="xl"
          striped 
          bordered
          className="test-class"
        >
          {mockChildren}
        </DataTable>
      );
      
      const table = screen.getByRole('table');
      const responsiveDiv = table.parentElement;
      
      expect(responsiveDiv).toHaveClass('table-responsive-xl');
      expect(table).toHaveClass('table-striped', 'table-bordered', 'test-class');
    });
  });

  describe('Edge Cases', () => {
    it('behandelt leere children korrekt', () => {
      render(<DataTable>{null}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('behandelt null children korrekt', () => {
      render(<DataTable>{null}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('behandelt undefined children korrekt', () => {
      render(<DataTable>{undefined}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('behandelt leere className korrekt', () => {
      render(<DataTable className="">{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('table', 'table-vcenter', 'table-hover', 'dataTable');
      // Leere Klasse sollte nicht hinzugefügt werden
      expect(table.className).not.toContain('  '); // Keine doppelten Leerzeichen
    });

    it('behandelt whitespace in className korrekt', () => {
      render(<DataTable className="  class1  class2  ">{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toHaveClass('class1', 'class2');
    });
  });

  describe('Performance und Memoization', () => {
    it('verwendet React.memo für Performance-Optimierung', () => {
      // Teste, dass die Komponente mit React.memo exportiert wird
      expect(DataTable).toBeDefined();
      expect(typeof DataTable).toBe('object');
    });

    it('verwendet useMemo für CSS-Klassen-Berechnung', () => {
      // Da wir useMemo verwenden, sollten wir testen, dass die Klassen korrekt berechnet werden
      const { rerender } = render(
        <DataTable striped bordered>
          {mockChildren}
        </DataTable>
      );
      
      let table = screen.getByRole('table');
      expect(table).toHaveClass('table-striped', 'table-bordered');
      
      // Ändere Props und teste, dass neue Klassen angewendet werden
      rerender(
        <DataTable striped={false} bordered={false} darkMode>
          {mockChildren}
        </DataTable>
      );
      
      table = screen.getByRole('table');
      expect(table).not.toHaveClass('table-striped', 'table-bordered');
      expect(table).toHaveClass('table-dark');
    });
  });

  describe('Accessibility', () => {
    it('hat korrekte table Rolle', () => {
      render(<DataTable>{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('behält table Rolle auch ohne responsive Wrapper', () => {
      render(<DataTable responsive={false}>{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('DOM-Struktur', () => {
    it('erstellt korrekte DOM-Struktur mit responsive Wrapper', () => {
      render(<DataTable>{mockChildren}</DataTable>);
      
      const responsiveDiv = screen.getByRole('table').parentElement;
      expect(responsiveDiv?.tagName).toBe('DIV');
      expect(responsiveDiv).toHaveClass('table-responsive');
    });

    it('erstellt korrekte DOM-Struktur ohne responsive Wrapper', () => {
      render(<DataTable responsive={false}>{mockChildren}</DataTable>);
      
      const table = screen.getByRole('table');
      const parent = table.parentElement;
      
      // Tabelle sollte direkt im Container sein, nicht in einem responsive div
      expect(parent).not.toHaveClass('table-responsive');
    });
  });
}); 