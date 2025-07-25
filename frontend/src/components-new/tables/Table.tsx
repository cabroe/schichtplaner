import React from 'react';

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

export interface TableProps {
  id?: string;
  columns: TableColumn[];
  data: any[];
  sortable?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  hover?: boolean;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string | ((row: any, index: number) => string);
  onRowClick?: (row: any, index: number) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

const Table: React.FC<TableProps> = React.memo(({
  id,
  columns,
  data,
  sortable = false,
  sortBy,
  sortDirection = 'asc',
  onSort,
  hover = true,
  striped = false,
  bordered = false,
  compact = false,
  responsive = true,
  className = '',
  style,
  headerClassName = '',
  bodyClassName = '',
  rowClassName,
  onRowClick,
  emptyState,
  loading = false,
  loadingText = 'Lade Daten...'
}) => {
  const getTableClasses = () => {
    const classes = [
      'table',
      hover ? 'table-hover' : '',
      striped ? 'table-striped' : '',
      bordered ? 'table-bordered' : '',
      compact ? 'table-sm' : '',
      className
    ].filter(Boolean);
    return classes.join(' ');
  };

  const getColumnClasses = (column: TableColumn) => {
    const classes = [
      column.align ? `text-${column.align}` : '',
      column.width ? 'w-min' : '',
      column.className || ''
    ].filter(Boolean);
    return classes.join(' ');
  };

  const getRowClasses = (row: any, index: number) => {
    const baseClasses = ['table-row'];
    
    if (onRowClick) {
      baseClasses.push('cursor-pointer');
    }
    
    if (typeof rowClassName === 'function') {
      baseClasses.push(rowClassName(row, index));
    } else if (rowClassName) {
      baseClasses.push(rowClassName);
    }
    
    return baseClasses.filter(Boolean).join(' ');
  };

  const handleSort = (column: TableColumn) => {
    if (!sortable || !column.sortable || !onSort) return;

    const newDirection = sortBy === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newDirection);
  };

  const handleRowClick = (row: any, index: number) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  const renderSortIcon = (column: TableColumn) => {
    if (!sortable || !column.sortable) return null;

    if (sortBy !== column.key) {
      return <i className="fas fa-sort text-muted ms-1" />;
    }

    return (
      <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`} />
    );
  };

  const renderHeader = () => {
    return (
      <thead className={headerClassName}>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={getColumnClasses(column)}
              style={column.width ? { width: column.width } : undefined}
              onClick={() => handleSort(column)}
              role={sortable && column.sortable ? 'button' : undefined}
              tabIndex={sortable && column.sortable ? 0 : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSort(column);
                }
              }}
            >
              <div className="d-flex align-items-center">
                <span>{column.title}</span>
                {renderSortIcon(column)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderBody = () => {
    if (loading) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="text-center py-4">
              <div className="d-flex align-items-center justify-content-center">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Laden...</span>
                </div>
                {loadingText}
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    if (data.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="text-center py-4">
              {emptyState || (
                <div className="text-muted">
                  <i className="fas fa-inbox fa-2x mb-2" />
                  <p>Keine Daten gefunden</p>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className={bodyClassName}>
        {data.map((row, index) => (
          <tr
            key={row.id || index}
            className={getRowClasses(row, index)}
            onClick={() => handleRowClick(row, index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRowClick(row, index);
              }
            }}
            tabIndex={onRowClick ? 0 : undefined}
            role={onRowClick ? 'button' : undefined}
          >
            {columns.map((column) => (
              <td
                key={column.key}
                className={getColumnClasses(column)}
              >
                {column.render
                  ? column.render(row[column.key], row, index)
                  : row[column.key] || ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  const tableElement = (
    <table
      id={id}
      className={getTableClasses()}
      style={style}
    >
      {renderHeader()}
      {renderBody()}
    </table>
  );

  if (responsive) {
    return (
      <div className="table-responsive">
        {tableElement}
      </div>
    );
  }

  return tableElement;
});

Table.displayName = 'Table';

export default Table; 