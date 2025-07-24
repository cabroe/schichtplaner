import React from 'react';
import { getShiftColor, getTooltipForShift } from '../../utils/shiftUtils';
import type { ShiftType } from '../../types/shift';

interface ShiftBadgeProps {
  shiftType: ShiftType;
  compact?: boolean;
}

/**
 * Komponente für ein Schichtbadge
 */
const ShiftBadge: React.FC<ShiftBadgeProps> = ({ shiftType, compact = true }) => {
  if (!shiftType) {
    return <span className="shift-badge empty"></span>;
  }

  const shiftInfo: Record<string, { text: string; tooltip: string; className: string }> = {
    'F': { text: 'F', tooltip: 'Frühschicht', className: 'badge bg-primary' },
    'S': { text: 'S', tooltip: 'Spätschicht', className: 'badge bg-success' },
    'N': { text: 'N', tooltip: 'Nachtschicht', className: 'badge bg-danger' },
    'U': { text: 'U', tooltip: 'Urlaub', className: 'badge bg-warning' },
    'K': { text: 'K', tooltip: 'Krank', className: 'badge bg-info' },
    'FR': { text: 'FR', tooltip: 'Frei', className: 'badge bg-secondary' },
    'FT': { text: 'FT', tooltip: 'Feiertag', className: 'badge bg-light text-dark' },
    'WE': { text: 'WE', tooltip: 'Wochenende', className: 'badge bg-dark' }
  };

  const info = shiftInfo[shiftType] || {
    text: shiftType.substring(0, 2),
    tooltip: getTooltipForShift(shiftType),
    className: 'badge bg-secondary'
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: getShiftColor(shiftType),
    color: 'white',
    display: 'inline-block',
    textAlign: 'center' as const,
    padding: compact ? '0.25em 0.4em' : '0.5em 0.8em',
    fontSize: compact ? '0.85em' : '1em',
    borderRadius: '0.375rem',
    fontWeight: '500',
    minWidth: compact ? '30px' : '40px'
  };

  return (
    <span 
      className={info.className}
      style={badgeStyle}
      title={info.tooltip}
    >
      {info.text}
    </span>
  );
};

export default ShiftBadge; 