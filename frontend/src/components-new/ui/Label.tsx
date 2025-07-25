import React from 'react';

export interface LabelProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'default';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  outline?: boolean;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
  tooltip?: string;
  onClick?: () => void;
  asButton?: boolean;
}

const Label: React.FC<LabelProps> = React.memo(({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  outline = false,
  dot = false,
  className = '',
  style,
  tooltip,
  onClick,
  asButton = false
}) => {
  const getVariantClass = () => {
    if (outline) {
      const outlineClasses = {
        primary: 'badge-outline-primary',
        secondary: 'badge-outline-secondary',
        success: 'badge-outline-success',
        danger: 'badge-outline-danger',
        warning: 'badge-outline-warning',
        info: 'badge-outline-info',
        light: 'badge-outline-light',
        dark: 'badge-outline-dark',
        default: 'badge-outline-secondary'
      };
      return outlineClasses[variant] || 'badge-outline-primary';
    }

    const variantClasses = {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      success: 'bg-success',
      danger: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info',
      light: 'bg-light text-dark',
      dark: 'bg-dark',
      default: 'bg-secondary'
    };
    return variantClasses[variant] || 'bg-primary';
  };

  const getSizeClass = () => {
    const sizeClasses = {
      sm: 'badge-sm',
      md: '',
      lg: 'badge-lg'
    };
    return sizeClasses[size] || '';
  };

  const getClasses = () => {
    const classes = [
      'badge',
      getVariantClass(),
      getSizeClass(),
      pill ? 'badge-pill' : '',
      className
    ].filter(Boolean);
    return classes.join(' ');
  };

  const renderContent = () => {
    if (dot) {
      return (
        <>
          <span className="badge-dot"></span>
          {children}
        </>
      );
    }
    return children;
  };

  const commonProps = {
    className: getClasses(),
    style,
    title: tooltip,
    onClick: asButton ? onClick : undefined,
    role: asButton ? 'button' : undefined,
    tabIndex: asButton ? 0 : undefined
  };

  if (asButton) {
    return (
      <button
        type="button"
        {...commonProps}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        {renderContent()}
      </button>
    );
  }

  return (
    <span {...commonProps}>
      {renderContent()}
    </span>
  );
});

Label.displayName = 'Label';

export default Label; 