import React, { useState } from 'react';
import { Icon } from '../ui/Icon';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  disabled?: boolean;
  children?: SidebarItem[];
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  logo?: React.ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
  variant?: 'default' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showToggle?: boolean;
  sticky?: boolean;
}

/**
 * Sidebar-Komponente
 */
export const Sidebar: React.FC<SidebarProps> = ({
  items,
  title,
  logo,
  collapsed = false,
  onCollapse,
  className = '',
  variant = 'default',
  showToggle = true,
  sticky = false
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggleCollapse = () => {
    onCollapse?.(!collapsed);
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.disabled) return;

    if (item.children && item.children.length > 0) {
      // Toggle submenu
      setExpandedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      item.onClick?.();
    }
  };

  const getSidebarClass = () => {
    const classes = [
      'border-end bg-light',
      variant === 'dark' ? 'bg-dark text-white' : '',
      collapsed ? 'opacity-75' : '',
      sticky ? 'position-sticky' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getItemClass = (item: SidebarItem) => {
    const classes = [
      'border-bottom',
      item.active ? 'bg-primary text-white' : '',
      item.disabled ? 'opacity-50' : '',
      item.children && item.children.length > 0 ? 'has-children' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getLinkClass = (item: SidebarItem) => {
    const classes = [
      'd-block p-3 text-decoration-none',
      item.active ? 'text-white' : 'text-dark',
      item.disabled ? 'pointer-events-none' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    return (
      <div key={item.id} className={getItemClass(item)}>
        <div 
          className={getLinkClass(item)}
          onClick={() => handleItemClick(item)}
          style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        >
          <div className="d-flex align-items-center">
            {item.icon && (
              <div className="me-2">
                <Icon name={item.icon as any} size="md" />
              </div>
            )}
            
            {!collapsed && (
              <div className="flex-fill">
                <span>{item.label}</span>
                {item.badge && (
                  <span className="badge bg-secondary ms-2">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
            
            {hasChildren && !collapsed && (
              <div className="ms-2">
                <Icon 
                  name={isExpanded ? 'chevron-down' : 'chevron-right'} 
                  size="sm" 
                />
              </div>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && !collapsed && (
          <div className="bg-light">
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={getSidebarClass()}>
      {(title || logo || showToggle) && (
        <div className="p-3 border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            {logo && (
              <div className="me-2">
                {logo}
              </div>
            )}
            
            {title && !collapsed && (
              <div className="flex-fill">
                <h5 className="mb-0">{title}</h5>
              </div>
            )}
            
            {showToggle && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={handleToggleCollapse}
                title={collapsed ? 'Erweitern' : 'Einklappen'}
              >
                <Icon 
                  name={collapsed ? 'chevron-right' : 'chevron-left'} 
                  size="sm" 
                />
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="p-0">
        <div>
          {items.map(item => renderItem(item))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 