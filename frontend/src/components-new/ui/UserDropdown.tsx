import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Avatar from './Avatar';

export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  color?: string;
  role?: string;
  isOnline?: boolean;
}

export interface UserDropdownItem {
  id: string;
  label?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  className?: string;
}

export interface UserDropdownProps {
  id?: string;
  user: User;
  items: UserDropdownItem[];
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'end' | 'center';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  showUserInfo?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = React.memo(({
  id,
  user,
  items,
  variant = 'light',
  size = 'md',
  align = 'end',
  className = '',
  style,
  disabled = false,
  showUserInfo = true,
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

  const handleItemClick = useCallback((item: UserDropdownItem) => {
    if (item.disabled || item.divider) return;
    
    item.onClick?.();
    setIsOpen(false);
    onToggle?.(false);
  }, [onToggle]);

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
    return variantClasses[variant] || 'btn-light';
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
    return alignClasses[align] || 'dropdown-menu-end';
  };

  const renderUserInfo = () => {
    if (!showUserInfo) return null;

    return (
      <div className="dropdown-header">
        <div className="d-flex align-items-center">
          <Avatar
            src={user.avatar}
            fallback={user.initials || user.name}
            size="md"
            backgroundColor={user.color}
            className="me-3"
          />
          <div className="flex-grow-1">
            <div className="fw-bold">{user.name}</div>
            <div className="text-muted small">{user.email}</div>
            {user.role && (
              <div className="text-muted small">{user.role}</div>
            )}
          </div>
          {user.isOnline !== undefined && (
            <div className={`status-dot ${user.isOnline ? 'status-green' : 'status-gray'}`} />
          )}
        </div>
      </div>
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
        <div className="d-flex align-items-center">
          <Avatar
            src={user.avatar}
            fallback={user.initials || user.name}
            size="sm"
            backgroundColor={user.color}
            className="me-2"
          />
          <span className="d-none d-sm-inline">{user.name}</span>
          <i className="fas fa-chevron-down ms-1" />
        </div>
      </button>
      
      {isOpen && createPortal(
        <div
          className={`dropdown-menu ${getAlignClass()} show`}
          style={{
            position: 'absolute',
            top: triggerRef.current?.getBoundingClientRect().bottom || 0,
            left: triggerRef.current?.getBoundingClientRect().left || 0,
            zIndex: 1000,
            minWidth: '200px'
          }}
        >
          {renderUserInfo()}
          {renderItems()}
        </div>,
        document.body
      )}
    </div>
  );
});

UserDropdown.displayName = 'UserDropdown';

export default UserDropdown; 