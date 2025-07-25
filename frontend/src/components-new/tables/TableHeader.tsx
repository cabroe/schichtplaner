import React from 'react';

export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Tabellen-Header-Komponente
 */
export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = '',
  sortable = false,
  sortDirection = null,
  onSort,
  width,
  align = 'left'
}) => {
  const alignClass = align !== 'left' ? `text-${align}` : '';
  const sortableClass = sortable ? 'sortable' : '';
  const sortClass = sortDirection ? `sorting_${sortDirection}` : '';
  
  const headerClasses = [
    alignClass,
    sortableClass,
    sortClass,
    className
  ].filter(Boolean).join(' ');

  const style = width ? { width } : undefined;

  const handleClick = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  const content = (
    <>
      {children}
      {sortable && (
        <span className="sorting-indicator">
          {sortDirection === 'asc' && <i className="ti ti-sort-ascending" />}
          {sortDirection === 'desc' && <i className="ti ti-sort-descending" />}
          {!sortDirection && <i className="ti ti-sort" />}
        </span>
      )}
    </>
  );

  if (sortable) {
    return (
      <th 
        className={headerClasses}
        style={style}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {content}
      </th>
    );
  }

  return (
    <th className={headerClasses} style={style}>
      {content}
    </th>
  );
};

export default TableHeader; 