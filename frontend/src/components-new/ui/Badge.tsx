import React from 'react';

export interface BadgeProps {
  /** Badge-Inhalt */
  children: React.ReactNode;
  /** Badge-Variante */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  /** Badge-Größe */
  size?: 'sm' | 'md' | 'lg';
  /** Badge als Pill (abgerundet) */
  pill?: boolean;
  /** Badge mit Outline-Style */
  outline?: boolean;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche Styles */
  style?: React.CSSProperties;
  /** Click-Handler */
  onClick?: () => void;
  /** Badge als Button behandeln */
  asButton?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  outline = false,
  className = '',
  style,
  onClick,
  asButton = false
}) => {
  const baseClasses = 'badge';
  const variantClasses = outline ? `badge-outline-${variant}` : `bg-${variant}`;
  const sizeClasses = size !== 'md' ? `badge-${size}` : '';
  const pillClasses = pill ? 'badge-pill' : '';
  const buttonClasses = asButton || onClick ? 'badge-button' : '';
  
  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    pillClasses,
    buttonClasses,
    className
  ].filter(Boolean).join(' ');

  const Component = asButton || onClick ? 'button' : 'span';
  const buttonProps = asButton || onClick ? {
    type: 'button' as const,
    onClick,
    role: 'button',
    tabIndex: 0
  } : {};

  return (
    <Component
      className={combinedClasses}
      style={style}
      {...buttonProps}
    >
      {children}
    </Component>
  );
};

export default React.memo(Badge); 