import React, { useRef, useEffect } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ContextMenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * Einfache Kontextmenü-Komponente
 */
export function ContextMenu({ x, y, isOpen, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="dropdown-menu show"
      style={{
        position: 'fixed',
        top: y,
        left: x,
        zIndex: 1000,
        minWidth: '150px'
      }}
    >
      {children}
    </div>
  );
}

/**
 * Kontextmenü-Eintrag
 */
export function ContextMenuItem({ onClick, children, disabled = false }: ContextMenuItemProps) {
  return (
    <a 
      href="#" 
      className={`dropdown-item ${disabled ? 'disabled' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) onClick();
      }}
    >
      {children}
    </a>
  );
}

/**
 * Trennstrich für Kontextmenü
 */
export function ContextMenuDivider() {
  return <hr className="dropdown-divider" />;
} 