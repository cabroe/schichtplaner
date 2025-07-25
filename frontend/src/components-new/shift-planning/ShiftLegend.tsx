import React from 'react';
import Card from '../ui/Card';
import { getShiftColor, getTooltipForShift } from '../../utils/shiftUtils';
import type { ShiftType } from '../../types/shift';

export interface ShiftLegendProps {
  className?: string;
  compact?: boolean;
}

/**
 * Schicht-Legende-Komponente
 */
export const ShiftLegend: React.FC<ShiftLegendProps> = ({
  className = '',
  compact = false
}) => {
  const shiftTypes: Array<{ type: ShiftType; label: string; description: string }> = [
    { type: 'F', label: 'F', description: 'Frühschicht' },
    { type: 'S', label: 'S', description: 'Spätschicht' },
    { type: 'N', label: 'N', description: 'Nachtschicht' },
    { type: 'U', label: 'U', description: 'Urlaub' },
    { type: 'K', label: 'K', description: 'Krank' },
    { type: 'FR', label: 'FR', description: 'Frei' },
    { type: 'FT', label: 'FT', description: 'Feiertag' },
    { type: 'WE', label: 'WE', description: 'Wochenende' }
  ];

  const badgeStyle = (shiftType: ShiftType): React.CSSProperties => ({
    backgroundColor: getShiftColor(shiftType),
    color: 'white',
    display: 'inline-block',
    textAlign: 'center' as const,
    padding: compact ? '0.2em 0.3em' : '0.25em 0.4em',
    fontSize: compact ? '0.8em' : '0.85em',
    borderRadius: '0.375rem',
    fontWeight: '500',
    minWidth: compact ? '25px' : '30px'
  });

  return (
    <Card 
      title="Schicht-Legende" 
      className={className}
    >
      <div className={`d-flex flex-wrap gap-${compact ? '1' : '2'}`}>
        {shiftTypes.map(({ type, label, description }) => (
          <div 
            key={type} 
            className="d-flex align-items-center me-3 mb-2"
            title={getTooltipForShift(type)}
          >
            <span 
              className="badge"
              style={badgeStyle(type)}
            >
              {label}
            </span>
            {!compact && (
              <span className="ms-2 text-muted small">{description}</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ShiftLegend; 