import React from 'react';

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  colSpan?: number;
  rowSpan?: number;
  nowrap?: boolean;
  truncate?: boolean;
}

/**
 * Tabellen-Zellen-Komponente
 */
export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  align = 'left',
  width,
  colSpan,
  rowSpan,
  nowrap = false,
  truncate = false
}) => {
  const alignClass = align !== 'left' ? `text-${align}` : '';
  const nowrapClass = nowrap ? 'text-nowrap' : '';
  const truncateClass = truncate ? 'text-truncate' : '';
  
  const cellClasses = [
    alignClass,
    nowrapClass,
    truncateClass,
    className
  ].filter(Boolean).join(' ');

  const style = width ? { width } : undefined;

  return (
    <td 
      className={cellClasses}
      style={style}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {children}
    </td>
  );
};

export default TableCell; 