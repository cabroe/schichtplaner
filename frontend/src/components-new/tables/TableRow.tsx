import React from 'react';

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  hover?: boolean;
  disabled?: boolean;
}

/**
 * Tabellen-Zeilen-Komponente
 */
export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = '',
  selected = false,
  onClick,
  onContextMenu,
  hover = true,
  disabled = false
}) => {
  const selectedClass = selected ? 'table-active' : '';
  const hoverClass = hover ? 'table-hover' : '';
  const disabledClass = disabled ? 'table-disabled' : '';
  
  const rowClasses = [
    selectedClass,
    hoverClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    if (!disabled && onContextMenu) {
      event.preventDefault();
      onContextMenu(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const isInteractive = !!onClick || !!onContextMenu;

  if (isInteractive) {
    return (
      <tr 
        className={rowClasses}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        style={{ cursor: !disabled ? 'pointer' : undefined }}
      >
        {children}
      </tr>
    );
  }

  return (
    <tr className={rowClasses}>
      {children}
    </tr>
  );
};

export default TableRow; 