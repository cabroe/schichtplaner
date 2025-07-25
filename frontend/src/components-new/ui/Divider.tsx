import React from 'react';

export interface DividerProps {
  className?: string;
  margin?: 'none' | 'sm' | 'md' | 'lg';
  color?: string;
  thickness?: number;
}

/**
 * Divider-Komponente für visuelle Trennung
 */
export const Divider: React.FC<DividerProps> = ({
  className = '',
  margin = 'md',
  color = 'var(--tblr-border-color)',
  thickness = 1
}) => {
  const marginClass = margin !== 'md' ? `my-${margin}` : 'my-3';
  
  return (
    <hr 
      className={`divider ${marginClass} ${className}`}
      style={{
        borderColor: color,
        borderWidth: thickness,
        opacity: 0.25
      }}
    />
  );
};

export default Divider; 