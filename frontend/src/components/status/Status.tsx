import React from 'react';

export interface StatusProps {
  /** Der anzuzeigende Text oder Inhalt */
  children: React.ReactNode;
  /** Die Farbe des Status (entspricht Tabler.io Status-Klassen) */
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'teal' | 'purple' | 'pink' | 'yellow' | 'orange' | 'green' | 'blue' | 'red' | 'gray';
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Größe des Status */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Status-Komponente für die Anzeige von Status-Informationen
 * 
 * Verwendet Tabler.io Status-Klassen für konsistentes Styling
 * 
 * @example
 * ```tsx
 * <Status variant="teal">Aktiv</Status>
 * <Status variant="success" size="lg">Erfolgreich</Status>
 * <Status variant="warning">Warnung</Status>
 * ```
 */
export const Status: React.FC<StatusProps> = ({ 
  children, 
  variant = 'primary', 
  className = '',
  size = 'md'
}) => {
  const baseClass = 'status';
  const variantClass = `status-${variant}`;
  const sizeClass = size !== 'md' ? `status-${size}` : '';
  
  const combinedClasses = [
    baseClass,
    variantClass,
    sizeClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={combinedClasses}>
      {children}
    </span>
  );
};

export default Status; 