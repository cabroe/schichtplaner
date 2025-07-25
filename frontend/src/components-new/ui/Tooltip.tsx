import React, { useState, useRef, useEffect } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: TooltipPosition;
  className?: string;
  delay?: number;
  disabled?: boolean;
}

/**
 * Tooltip-Komponente
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className = '',
  delay = 200,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({ x: rect.left, y: rect.top });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      maxWidth: '200px',
      wordWrap: 'break-word',
      pointerEvents: 'none'
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          left: coords.x + (triggerRef.current?.offsetWidth || 0) / 2,
          top: coords.y - 10,
          transform: 'translateX(-50%) translateY(-100%)'
        };
      case 'bottom':
        return {
          ...baseStyle,
          left: coords.x + (triggerRef.current?.offsetWidth || 0) / 2,
          top: coords.y + (triggerRef.current?.offsetHeight || 0) + 10,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          ...baseStyle,
          left: coords.x - 10,
          top: coords.y + (triggerRef.current?.offsetHeight || 0) / 2,
          transform: 'translateX(-100%) translateY(-50%)'
        };
      case 'right':
        return {
          ...baseStyle,
          left: coords.x + (triggerRef.current?.offsetWidth || 0) + 10,
          top: coords.y + (triggerRef.current?.offsetHeight || 0) / 2,
          transform: 'translateY(-50%)'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`tooltip-trigger ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
                      className="bg-dark text-white p-2 rounded small"
          style={getTooltipStyle()}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip; 