import React from 'react';
import type { ShiftType } from '../../types/shift';

export interface ShiftCellProps {
  shiftType: ShiftType;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  readOnly?: boolean;
}

export const ShiftCell: React.FC<ShiftCellProps> = ({
  shiftType,
  onClick,
  onContextMenu,
  readOnly = false
}) => {
  const getShiftColor = (type: ShiftType) => {
    switch (type) {
      case 'F': return '#28a745'; // Frühschicht
      case 'S': return '#007bff'; // Spätschicht
      case 'N': return '#6f42c1'; // Nachtschicht
      case 'U': return '#ffc107'; // Urlaub
      case 'K': return '#dc3545'; // Krank
      case 'FR': return '#6c757d'; // Frei
      case 'FT': return '#fd7e14'; // Feiertag
      case 'WE': return '#e83e8c'; // Wochenende
      default: return '#f8f9fa';
    }
  };

  return (
    <div
      className="border rounded d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: getShiftColor(shiftType),
        color: 'white',
        padding: '0.5rem',
        cursor: readOnly ? 'default' : 'pointer',
        textAlign: 'center' as const,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        minWidth: '40px',
        minHeight: '40px'
      }}
      onClick={readOnly ? undefined : onClick}
      onContextMenu={onContextMenu}
    >
      {shiftType}
    </div>
  );
};

export default ShiftCell; 