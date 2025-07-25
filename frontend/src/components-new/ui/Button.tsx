import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-light' | 'outline-dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Moderne Button-Komponente mit Tabler.io Styling
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  title,
  icon,
  iconPosition = 'left'
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const widthClass = fullWidth ? 'w-100' : '';
  
  const buttonClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    widthClass,
    className
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick(event);
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = (
      <span className={loading ? 'spinner-border spinner-border-sm' : ''}>
        {icon}
      </span>
    );

    return iconPosition === 'right' ? (
      <>
        {children}
        {iconElement}
      </>
    ) : (
      <>
        {iconElement}
        {children}
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={handleClick}
      title={title}
    >
      {renderIcon()}
    </button>
  );
};

export default Button; 