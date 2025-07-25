import React from 'react';
import Status from './Status';
import type { StatusProps } from './Status';

export interface StatusListProps {
  /** Array von Status-Elementen */
  items: Array<{
    /** Der anzuzeigende Text oder Inhalt */
    content: React.ReactNode;
    /** Die Farbe des Status */
    variant?: StatusProps['variant'];
    /** Größe des Status */
    size?: StatusProps['size'];
    /** Zusätzliche CSS-Klassen */
    className?: string;
    /** Optional: Key für React */
    key?: string | number;
  }>;
  /** Zusätzliche CSS-Klassen für die Liste */
  className?: string;
}

/**
 * StatusList-Komponente für die Anzeige mehrerer Status-Elemente
 * 
 * Verwendet Tabler.io btn-list Klasse für horizontale Anordnung
 * 
 * @example
 * ```tsx
 * <StatusList
 *   items={[
 *     { content: '1', variant: 'teal' },
 *     { content: '2', variant: 'success' },
 *     { content: '3', variant: 'warning' }
 *   ]}
 * />
 * ```
 */
export const StatusList: React.FC<StatusListProps> = ({ 
  items, 
  className = ''
}) => {
  const combinedClasses = ['btn-list', className].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses}>
      {items.map((item, index) => (
        <Status
          key={item.key || index}
          variant={item.variant}
          size={item.size}
          className={item.className}
        >
          {item.content}
        </Status>
      ))}
    </div>
  );
};

export default StatusList; 