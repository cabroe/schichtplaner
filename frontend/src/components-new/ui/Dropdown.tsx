import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  className?: string;
}

export interface DropdownProps {
  id?: string;
  trigger: React.ReactNode;
  items: DropdownItem[];
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'end' | 'center';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  autoClose?: boolean | 'inside' | 'outside';
  onToggle?: (isOpen: boolean) => void;
}

const Dropdown: React.FC<DropdownProps> = React.memo(({
  id,
  trigger,
  items,
  variant = 'primary',
  size = 'md',
  align = 'start',
  className = '',
  style,
  disabled = false,
  autoClose = true,
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);
  }, [isOpen, disabled, onToggle]);

  const handleItemClick = useCallback((item: DropdownItem) => {
    if (item.disabled || item.divider) return;
    
    item.onClick?.();
    
    if (autoClose === true || autoClose === 'inside') {
      setIsOpen(false);
      onToggle?.(false);
    }
  }, [autoClose, onToggle]);

  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      onToggle?.(false);
    }
  }, [onToggle]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      onToggle?.(false);
    }
  }, [onToggle]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleOutsideClick, handleKeyDown]);

  const getVariantClass = () => {
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      success: 'btn-success',
      danger: 'btn-danger',
      warning: 'btn-warning',
      info: 'btn-info',
      light: 'btn-light',
      dark: 'btn-dark'
    };
    return variantClasses[variant] || 'btn-primary';
  };

  const getSizeClass = () => {
    const sizeClasses = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg'
    };
    return sizeClasses[size] || '';
  };

  const getAlignClass = () => {
    const alignClasses = {
      start: 'dropdown-menu-start',
      end: 'dropdown-menu-end',
      center: 'dropdown-menu-center'
    };
    return alignClasses[align] || 'dropdown-menu-start';
  };

  const renderTrigger = () => {
    if (React.isValidElement(trigger)) {
      return React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: handleToggle,
        'data-bs-toggle': 'dropdown',
        'aria-haspopup': 'true',
        'aria-expanded': isOpen,
        disabled,
        className: `dropdown-toggle ${(trigger as any).props?.className || ''}`.trim()
      });
    }

    return (
      <button
        ref={triggerRef}
        type="button"
        className={`btn ${getVariantClass()} ${getSizeClass()} dropdown-toggle`}
        onClick={handleToggle}
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        {trigger}
      </button>
    );
  };

  const renderItems = () => {
    return items.map((item, index) => {
      if (item.divider) {
        return <div key={`divider-${index}`} className="dropdown-divider" />;
      }

      return (
        <button
          key={item.id}
          type="button"
          className={`dropdown-item ${item.disabled ? 'disabled' : ''} ${item.className || ''}`}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
        >
          {item.icon && <i className={`me-2 ${item.icon}`} />}
          {item.label}
        </button>
      );
    });
  };

  return (
    <div
      ref={dropdownRef}
      id={id}
      className={`dropdown ${className}`}
      style={style}
    >
      {renderTrigger()}
      {isOpen && createPortal(
        <div
          className={`dropdown-menu ${getAlignClass()} show`}
          style={{
            position: 'absolute',
            top: triggerRef.current?.getBoundingClientRect().bottom || 0,
            left: triggerRef.current?.getBoundingClientRect().left || 0,
            zIndex: 1000
          }}
        >
          {renderItems()}
        </div>,
        document.body
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown; 