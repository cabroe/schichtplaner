import React from 'react';

export interface CardTool {
  id: string;
  icon: string;
  title: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

export interface CardProps {
  id?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  tools?: CardTool[];
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  fullsize?: boolean;
  bordered?: boolean;
  shadow?: boolean;
}

const Card: React.FC<CardProps> = React.memo(({
  id,
  title,
  subtitle,
  tools,
  children,
  variant = 'default',
  size = 'md',
  className = '',
  style,
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  collapsible = false,
  collapsed = false,
  onToggle,
  fullsize = false,
  bordered = true,
  shadow = true
}) => {
  const getVariantClass = () => {
    const variantClasses = {
      default: '',
      primary: 'border-primary',
      secondary: 'border-secondary',
      success: 'border-success',
      danger: 'border-danger',
      warning: 'border-warning',
      info: 'border-info'
    };
    return variantClasses[variant] || '';
  };

  const getSizeClass = () => {
    const sizeClasses = {
      sm: 'p-2',
      md: '',
      lg: 'p-4'
    };
    return sizeClasses[size] || '';
  };

  const getClasses = () => {
    const classes = [
      'card',
      getVariantClass(),
      getSizeClass(),
      fullsize ? 'h-100' : '',
      bordered ? '' : 'border-0',
      shadow ? '' : 'shadow-none',
      className
    ].filter(Boolean);
    return classes.join(' ');
  };

  const handleToggle = () => {
    if (collapsible && onToggle) {
      onToggle(!collapsed);
    }
  };

  const renderHeader = () => {
    if (!title && !subtitle && !tools) return null;

    return (
      <div className={`card-header ${headerClassName}`}>
        <div className="d-flex align-items-center">
          {collapsible && (
            <button
              type="button"
              className="btn btn-link p-0 me-2"
              onClick={handleToggle}
              aria-expanded={!collapsed}
            >
              <i className={`fas fa-chevron-${collapsed ? 'right' : 'down'}`} />
            </button>
          )}
          {title && <h3 className="h5 mb-0">{title}</h3>}
          {subtitle && <div className="text-muted small ms-2">{subtitle}</div>}
        </div>
        {tools && tools.length > 0 && (
          <div className="ms-auto">
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`btn btn-sm btn-outline-secondary ${tool.className || ''}`}
                title={tool.title}
                onClick={tool.onClick}
                disabled={tool.disabled}
                aria-label={tool.title}
              >
                <i className={tool.icon} />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBody = () => {
    if (collapsible && collapsed) return null;

    return (
      <div className={`card-body ${bodyClassName}`}>
        {children}
      </div>
    );
  };

  const renderFooter = () => {
    if (!footer) return null;

    return (
      <div className={`card-footer ${footerClassName}`}>
        {footer}
      </div>
    );
  };

  return (
    <div
      id={id}
      className={getClasses()}
      style={style}
    >
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </div>
  );
});

Card.displayName = 'Card';

export default Card; 