import React from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  actionLabel?: string;
  actionVariant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary';
  onAction?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  showBorder?: boolean;
}

/**
 * Empty-State-Komponente für leere Zustände
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'inbox',
  iconColor = '#6c757d',
  iconSize = 'xl',
  actionLabel,
  actionVariant = 'primary',
  onAction,
  className = '',
  size = 'md',
  centered = true,
  showBorder = false
}) => {
  const getEmptyStateClass = () => {
    const classes = [
      'p-4',
      size === 'sm' ? 'p-3' : size === 'lg' ? 'p-5' : '',
      centered ? 'text-center' : '',
      showBorder ? 'border rounded' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div className={getEmptyStateClass()}>
      <div>
        {icon && (
          <div className="mb-3">
            <Icon 
              name={icon as any} 
              color={iconColor}
              size={iconSize}
            />
          </div>
        )}
        
        <div className="mb-2">
          <h4 className="mb-0">{title}</h4>
        </div>
        
        {description && (
          <div className="mb-4">
            <p className="text-muted mb-0">{description}</p>
          </div>
        )}
        
        {actionLabel && onAction && (
          <div>
            <Button
              variant={actionVariant}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState; 