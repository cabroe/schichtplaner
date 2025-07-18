import React, { useMemo } from 'react';
import type { ReactNode } from 'react';

interface DataTableProps {
  id?: string;
  children: ReactNode;
  className?: string;
  responsive?: boolean | string;
  striped?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'lg' | undefined;
  darkMode?: boolean;
}

/**
 * Eine wiederverwendbare Tabellen-Komponente mit Tabler-Styling
 */
const DataTable = React.memo<DataTableProps>(({
  id,
  children,
  className = '',
  responsive = true,
  striped = false,
  bordered = false,
  size,
  darkMode = false
}) => {
  // Kombiniere die Standard-Klassen mit zusätzlichen Klassen
  const tableClasses = useMemo(() => {
    const classes = [
      'table',
      'table-vcenter',
      'table-hover',
      'dataTable',
      className
    ];

    // Füge optionale Klassen hinzu
    if (striped) classes.push('table-striped');
    if (bordered) classes.push('table-bordered');
    if (size) classes.push(`table-${size}`);
    if (darkMode) classes.push('table-dark');
    
    return classes.join(' ');
  }, [className, striped, bordered, size, darkMode]);

  const tableElement = (
    <table
      id={id}
      className={tableClasses}
    >
      {children}
    </table>
  );
  
  // Wenn responsive, umschließe die Tabelle mit einem div.table-responsive
  if (responsive) {
    const responsiveClass = typeof responsive === 'string' 
      ? `table-responsive-${responsive}` 
      : 'table-responsive';
      
    return (
      <div className={responsiveClass}>
        {tableElement}
      </div>
    );
  }
  
  return tableElement;
});

export default DataTable; 