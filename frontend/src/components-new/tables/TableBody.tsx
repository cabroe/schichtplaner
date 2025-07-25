import React from 'react';

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

/**
 * Tabellen-Body-Komponente
 */
export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = '',
  loading = false,
  emptyMessage = 'Keine Daten verfügbar',
  emptyIcon
}) => {
  if (loading) {
    return (
      <tbody className={className}>
        <tr>
          <td colSpan={100} className="text-center py-4">
            <div className="d-flex align-items-center justify-content-center">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Lädt...</span>
              </div>
              <span>Lädt...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  const hasChildren = React.Children.count(children) > 0;

  if (!hasChildren) {
    return (
      <tbody className={className}>
        <tr>
          <td colSpan={100} className="text-center py-4">
            <div className="d-flex flex-column align-items-center">
              {emptyIcon && <div className="mb-2">{emptyIcon}</div>}
              <span className="text-muted">{emptyMessage}</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
};

export default TableBody; 