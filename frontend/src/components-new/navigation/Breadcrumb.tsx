import React from 'react';
import { Icon } from '../ui/Icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  active?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: 'slash' | 'chevron' | 'arrow';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Breadcrumb-Navigation-Komponente
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  separator = 'chevron',
  size = 'md'
}) => {
  const separatorIcon = separator === 'chevron' ? 'chevron-right' :
                       separator === 'arrow' ? 'arrow-right' : undefined;

  const sizeClass = size === 'sm' ? 'small' : size === 'lg' ? 'fs-5' : '';

  return (
    <nav aria-label="Breadcrumb" className={`breadcrumb ${sizeClass} ${className}`}>
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li 
            key={index} 
            className={`breadcrumb-item ${item.active ? 'active' : ''}`}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.href && !item.active ? (
              <a href={item.href} className="text-decoration-none">
                {item.icon && <Icon name={item.icon as any} className="me-1" />}
                {item.label}
              </a>
            ) : (
              <span>
                {item.icon && <Icon name={item.icon as any} className="me-1" />}
                {item.label}
              </span>
            )}
            
            {index < items.length - 1 && separatorIcon && (
              <Icon 
                name={separatorIcon as any} 
                className="ms-2 me-2 text-muted"
                size="sm"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 