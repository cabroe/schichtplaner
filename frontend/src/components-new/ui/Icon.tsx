import React from 'react';

export type IconType = 
  | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'chevron-down'
  | 'sync' | 'spinner' | 'check' | 'times' | 'plus' | 'minus'
  | 'edit' | 'delete' | 'save' | 'cancel' | 'close'
  | 'calendar' | 'clock' | 'user' | 'settings' | 'search'
  | 'filter' | 'sort' | 'download' | 'upload' | 'print'
  | 'eye' | 'eye-slash' | 'lock' | 'unlock' | 'key'
  | 'home' | 'dashboard' | 'chart' | 'list' | 'grid'
  | 'star' | 'heart' | 'flag' | 'bookmark' | 'tag'
  | 'phone' | 'envelope' | 'map-marker' | 'link' | 'external-link'
  | 'question' | 'info' | 'warning' | 'error' | 'success'
  | 'play' | 'pause' | 'stop' | 'forward' | 'backward'
  | 'volume' | 'mute' | 'camera' | 'video' | 'image'
  | 'file' | 'folder' | 'database' | 'server' | 'cloud'
  | 'wifi' | 'bluetooth' | 'battery' | 'signal' | 'location';

export interface IconProps {
  name: IconType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  spin?: boolean;
  fixedWidth?: boolean;
  color?: string;
  onClick?: () => void;
  title?: string;
}

/**
 * Icon-Komponente basierend auf Tabler Icons
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className = '',
  spin = false,
  fixedWidth = false,
  color,
  onClick,
  title
}) => {
  const sizeClass = size !== 'md' ? `ti-${size}` : '';
  const spinClass = spin ? 'fa-spin' : '';
  const fixedWidthClass = fixedWidth ? 'fa-fw' : '';
  
  const iconClasses = [
    'ti',
    `ti-${name}`,
    sizeClass,
    spinClass,
    fixedWidthClass,
    className
  ].filter(Boolean).join(' ');

  const style = color ? { color } : undefined;

  const iconElement = (
    <i 
      className={iconClasses}
      style={style}
      title={title}
      onClick={onClick}
    />
  );

  if (onClick) {
    return (
      <button 
        type="button" 
        className="btn btn-link p-0 border-0"
        onClick={onClick}
        title={title}
      >
        {iconElement}
      </button>
    );
  }

  return iconElement;
};

export default Icon; 