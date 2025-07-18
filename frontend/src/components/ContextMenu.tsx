import React, { useRef, useEffect, useState } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ContextMenuItemProps {
  onClick: () => void;
  icon?: string;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}

interface ContextSubmenuProps {
  title: string;
  id: string;
  icon?: string;
  children: React.ReactNode;
  activeSubmenu: string | null;
  setActiveSubmenu: (id: string | null) => void;
}

/**
 * Kontextmenü-Komponente mit Bootstrap-Dropdown-Styling
 */
export function ContextMenu({ x, y, isOpen, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: y, left: x });

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

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newLeft = x;
      let newTop = y;

      // Prüfe horizontale Überlappung
      if (x + rect.width > viewportWidth) {
        newLeft = viewportWidth - rect.width - 10; // 10px Abstand vom Rand
      }

      // Prüfe vertikale Überlappung
      if (y + rect.height > viewportHeight) {
        newTop = viewportHeight - rect.height - 10; // 10px Abstand vom Rand
      }

      // Stelle sicher, dass das Menü nicht außerhalb der linken/oberen Grenzen liegt
      newLeft = Math.max(10, newLeft);
      newTop = Math.max(10, newTop);

      setPosition({ top: newTop, left: newLeft });
    }
  }, [isOpen, x, y]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="dropdown-menu action-dropdown d-block"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 1000,
        maxWidth: '250px',
        minWidth: '180px'
      }}
      onContextMenu={handleContextMenu}
    >
      {children}
    </div>
  );
}

/**
 * Kontextmenü-Eintrag Komponente
 */
export function ContextMenuItem({ 
  onClick, 
  icon, 
  disabled = false, 
  danger = false, 
  children 
}: ContextMenuItemProps) {
  const className = `dropdown-item ${disabled ? 'disabled' : ''} ${danger ? 'text-danger' : ''}`;
  
  return (
    <a 
      href="#" 
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) onClick();
      }}
    >
      {icon && <i className={`${icon} me-2`}></i>}
      {children}
    </a>
  );
}

/**
 * Trennstrich-Komponente für Kontextmenü
 */
export function ContextMenuDivider() {
  return <hr className="dropdown-divider" />;
}

/**
 * Untermenü-Komponente für Kontextmenü
 * Öffnet sich bei Klick und Hover
 */
export function ContextSubmenu({ 
  title, 
  id, 
  icon, 
  children, 
  activeSubmenu, 
  setActiveSubmenu 
}: ContextSubmenuProps) {
  const isOpen = activeSubmenu === id;
  const submenuRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    if (isHovering && activeSubmenu !== id) {
      timeoutId = setTimeout(() => {
        setActiveSubmenu(id);
      }, 100);
    } else if (!isHovering && activeSubmenu === id) {
      timeoutId = setTimeout(() => {
        if (!isHovering) {
          setActiveSubmenu(null);
        }
      }, 300);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isHovering, activeSubmenu, id, setActiveSubmenu]);
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSubmenu(isOpen ? null : id);
  };
  
  return (
    <div 
      className="dropend" 
      ref={submenuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a 
        className="dropdown-item dropdown-toggle"
        href="#"
        onClick={handleClick}
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        role="button"
        aria-expanded={isOpen}
      >
        {icon && <i className={`${icon} me-2`}></i>}
        {title}
      </a>
      <div 
        className={`dropdown-menu ${isOpen ? 'show' : ''}`} 
        style={{ 
          display: isOpen ? 'block' : 'none',
          position: 'absolute',
          inset: '0px auto auto 100%',
          margin: '0px',
          transform: 'translate3d(0px, 0px, 0px)'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
}