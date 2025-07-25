import React from 'react';
import { Badge } from '../ui';

export type ShiftType = 'F' | 'S' | 'N' | 'FZ' | 'SZ' | 'NZ' | 'K' | 'U' | '';

export interface ShiftBadgeProps {
  /** Schicht-Typ */
  shiftType: ShiftType;
  /** Badge-Größe */
  size?: 'sm' | 'md' | 'lg';
  /** Badge als Button */
  asButton?: boolean;
  /** Click-Handler */
  onClick?: () => void;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche Styles */
  style?: React.CSSProperties;
  /** Badge mit Tooltip */
  tooltip?: string;
}

const ShiftBadge: React.FC<ShiftBadgeProps> = ({
  shiftType,
  size = 'md',
  asButton = false,
  onClick,
  className = '',
  style}) => {
  const getShiftConfig = (type: ShiftType) => {
    switch (type) {
      case 'F':
        return { label: 'F', variant: 'primary', color: '#206bc4' };
      case 'S':
        return { label: 'S', variant: 'success', color: '#2fb344' };
      case 'N':
        return { label: 'N', variant: 'dark', color: '#1e293b' };
      case 'FZ':
        return { label: 'FZ', variant: 'info', color: '#4299e1' };
      case 'SZ':
        return { label: 'SZ', variant: 'warning', color: '#f59e0b' };
      case 'NZ':
        return { label: 'NZ', variant: 'secondary', color: '#6c757d' };
      case 'K':
        return { label: 'K', variant: 'danger', color: '#dc3545' };
      case 'U':
        return { label: 'U', variant: 'light', color: '#f8f9fa' };
      default:
        return { label: '', variant: 'light', color: '#f8f9fa' };
    }
  };

  const config = getShiftConfig(shiftType);

  if (!shiftType) {
    return null;
  }

  return (
    <Badge
      variant={config.variant as any}
      size={size}
      asButton={asButton}
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: config.color,
        color: config.variant === 'light' ? '#000' : '#fff',
        ...style
      }}
    >
      {config.label}
    </Badge>
  );
};

export default React.memo(ShiftBadge); 