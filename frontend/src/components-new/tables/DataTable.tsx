import React from 'react';

export interface DataTableColumn<T = any> {
  /** Spalten-Schlüssel */
  key: string;
  /** Spalten-Titel */
  title: string;
  /** Spalten-Breite */
  width?: string;
  /** Spalten ausrichtbar */
  align?: 'left' | 'center' | 'right';
  /** Spalten sortierbar */
  sortable?: boolean;
  /** Spalten sichtbar */
  visible?: boolean;
  /** Spalten-Funktion für Zellen-Inhalt */
  render?: (value: any, row: T, index: number) => React.ReactNode;
  /** Spalten-Klassen */
  className?: string;
}

export interface DataTableProps<T = any> {
  /** Tabellen-Daten */
  data: T[];
  /** Tabellen-Spalten */
  columns: DataTableColumn<T>[];
  /** Tabellen-ID */
  id?: string;
  /** Tabellen-Klassen */
  className?: string;
  /** Tabellen-Styles */
  style?: React.CSSProperties;
  /** Tabellen mit Hover-Effekt */
  hover?: boolean;
  /** Tabellen mit Stripes */
  striped?: boolean;
  /** Tabellen mit Border */
  bordered?: boolean;
  /** Tabellen kompakt */
  compact?: boolean;
  /** Tabellen responsive */
  responsive?: boolean;
  /** Tabellen mit Pagination */
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
  /** Tabellen mit Sortierung */
  sorting?: {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    onSort: (column: string, direction: 'asc' | 'desc') => void;
  };
  /** Tabellen mit Auswahl */
  selection?: {
    selectedRows: string[];
    onSelectionChange: (selectedRows: string[]) => void;
    rowKey: keyof T;
  };
  /** Tabellen mit Aktionen */
  actions?: {
    title: string;
    render: (row: T, index: number) => React.ReactNode;
  };
  /** Tabellen leer-Zustand */
  emptyState?: React.ReactNode;
  /** Tabellen-Loading */
  loading?: boolean;
  /** Tabellen-Loading-Text */
  loadingText?: string;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  id = 'datatable',
  className = '',
  style,
  hover = true,
  striped = false,
  bordered = false,
  compact = false,
  responsive = true,
  pagination,
  sorting,
  selection,
  actions,
  emptyState,
  loading = false,
  loadingText = 'Lade Daten...'
}: DataTableProps<T>) => {
  const visibleColumns = columns.filter(col => col.visible !== false);
  
  const baseClasses = 'table';
  const hoverClasses = hover ? 'table-hover' : '';
  const stripedClasses = striped ? 'table-striped' : '';
  const borderedClasses = bordered ? 'table-bordered' : '';
  const compactClasses = compact ? 'table-sm' : '';
  
  const tableClasses = [
    baseClasses,
    hoverClasses,
    stripedClasses,
    borderedClasses,
    compactClasses,
    className
  ].filter(Boolean).join(' ');

  const handleSort = (column: DataTableColumn<T>) => {
    if (!sorting || !column.sortable) return;
    
    const newDirection = sorting.sortBy === column.key && sorting.sortDirection === 'asc' ? 'desc' : 'asc';
    sorting.onSort(column.key, newDirection);
  };

  const handleRowSelection = (row: T, checked: boolean) => {
    if (!selection) return;
    
    const rowKey = String(row[selection.rowKey]);
    const newSelection = checked
      ? [...selection.selectedRows, rowKey]
      : selection.selectedRows.filter(key => key !== rowKey);
    
    selection.onSelectionChange(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selection) return;
    
    const newSelection = checked ? data.map(row => String(row[selection.rowKey])) : [];
    selection.onSelectionChange(newSelection);
  };

  const isAllSelected = Boolean(selection && data.length > 0 && selection.selectedRows.length === data.length);
  const isIndeterminate = Boolean(selection && selection.selectedRows.length > 0 && selection.selectedRows.length < data.length);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        <div className="spinner-border text-primary me-2" role="status">
          <span className="visually-hidden">Lade...</span>
        </div>
        <span>{loadingText}</span>
      </div>
    );
  }

  const tableContent = (
    <table className={tableClasses} id={id} style={style}>
      <thead>
        <tr>
          {selection && (
            <th style={{ width: '40px' }}>
              <input
                type="checkbox"
                className="form-check-input"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = isIndeterminate;
                  }
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
          )}
          
          {visibleColumns.map(column => (
            <th
              key={column.key}
              className={`${column.className || ''} ${column.align ? `text-${column.align}` : ''}`}
              style={{ width: column.width }}
              onClick={() => handleSort(column)}
            >
              {column.title}
              {sorting && column.sortable && (
                <span className="ms-1">
                  {sorting.sortBy === column.key ? (
                    sorting.sortDirection === 'asc' ? '↑' : '↓'
                  ) : (
                    '↕'
                  )}
                </span>
              )}
            </th>
          ))}
          
          {actions && (
            <th style={{ width: '100px' }}>{actions.title}</th>
          )}
        </tr>
      </thead>
      
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={visibleColumns.length + (selection ? 1 : 0) + (actions ? 1 : 0)} className="text-center py-4">
              {emptyState || 'Keine Daten verfügbar'}
            </td>
          </tr>
        ) : (
          data.map((row, index) => (
            <tr key={index}>
              {selection && (
                <td style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selection.selectedRows.includes(String(row[selection.rowKey]))}
                    onChange={(e) => handleRowSelection(row, e.target.checked)}
                  />
                </td>
              )}
              
              {visibleColumns.map(column => (
                <td
                  key={column.key}
                  className={`${column.className || ''} ${column.align ? `text-${column.align}` : ''}`}
                >
                  {column.render
                    ? column.render(row[column.key], row, index)
                    : row[column.key]
                  }
                </td>
              ))}
              
              {actions && (
                <td style={{ width: '100px' }}>
                  {actions.render(row, index)}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div>
      {responsive ? (
        <div className="table-responsive">
          {tableContent}
        </div>
      ) : (
        tableContent
      )}
      
      {pagination && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted">
            Zeige {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} bis{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} von{' '}
            {pagination.totalItems} Einträgen
          </div>
          
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Zurück
                </button>
              </li>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <li key={page} className={`page-item ${page === pagination.currentPage ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => pagination.onPageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Weiter
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default React.memo(DataTable) as <T extends Record<string, any>>(props: DataTableProps<T>) => React.ReactElement; 