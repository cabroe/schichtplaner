import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../ui/Icon';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuItem[];
  badge?: string | number;
  shortcut?: string;
}

export interface MenuProps {
  items: MenuItem[];
  trigger?: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'dropdown' | 'context';
  showArrow?: boolean;
  autoClose?: boolean;
}

/**
 * Menu-Komponente
 */
export const Menu: React.FC<MenuProps> = ({
  items,
  trigger,
  placement = 'bottom',
  className = '',
  showArrow = false,
  autoClose = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveSubmenu(null);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;

    if (item.children && item.children.length > 0) {
      // Toggle submenu
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    } else {
      item.onClick?.();
      if (autoClose) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    }
  };

  const getMenuClass = () => {
    const classes = [
      'dropdown-menu',
      `dropdown-menu-${placement}`,
      isOpen ? 'show' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getItemClass = (item: MenuItem) => {
    const classes = [
      'dropdown-item',
      item.disabled ? 'disabled' : '',
      item.divider ? 'dropdown-divider' : '',
      item.children && item.children.length > 0 ? 'dropdown-item-has-children' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getLinkClass = (item: MenuItem) => {
    const classes = [
      'dropdown-item',
      item.disabled ? 'disabled' : '',
      item.divider ? 'dropdown-divider' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const renderItem = (item: MenuItem, level = 0) => {
    if (item.divider) {
      return <div key={item.id} className="dropdown-divider" />;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isSubmenuOpen = activeSubmenu === item.id;

    return (
      <div key={item.id} className={getItemClass(item)}>
        <div 
          className={getLinkClass(item)}
          onClick={() => handleItemClick(item)}
          style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {item.icon && (
                <div className="me-2">
                  <Icon name={item.icon as any} size="sm" />
                </div>
              )}
              
              <div>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="badge bg-secondary ms-2">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
            
            <div className="d-flex align-items-center">
              {item.shortcut && (
                <div className="text-muted small me-2">
                  {item.shortcut}
                </div>
              )}
              
              {hasChildren && (
                <div>
                  <Icon 
                    name={isSubmenuOpen ? 'chevron-down' : 'chevron-right'} 
                    size="sm" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {hasChildren && isSubmenuOpen && (
          <div className="dropdown-menu dropdown-menu-end">
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dropdown">
      <div 
        ref={triggerRef}
        className="dropdown-toggle"
        onClick={handleTriggerClick}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div ref={menuRef} className={getMenuClass()}>
          {showArrow && <div className="dropdown-arrow" />}
          <div>
            {items.map(item => renderItem(item))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu; 