import React, { useState, useEffect } from 'react';
import { Icon } from '../ui/Icon';

export interface NotificationProps {
  id?: string;
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
  closable?: boolean;
  persistent?: boolean;
}

/**
 * Notification-Komponente
 */
export const Notification: React.FC<NotificationProps> = ({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose,
  onAction,
  actionLabel,
  className = '',
  closable = true,
  persistent = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Animation duration
  };

  const handleAction = () => {
    onAction?.();
    handleClose();
  };

  const getNotificationClass = () => {
    const classes = [
      'alert',
      `alert-${type === 'error' ? 'danger' : type}`,
      'd-flex align-items-center justify-content-between',
      isClosing ? 'fade' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getIconName = () => {
    switch (type) {
      case 'success': return 'check';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'error': return '#dc3545';
      default: return '#17a2b8';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      id={id}
      className={getNotificationClass()}
      role="alert"
      aria-live="polite"
    >
      <div className="d-flex align-items-center">
        <div className="me-3">
          <Icon 
            name={getIconName() as any} 
            color={getIconColor()}
            size="md"
          />
        </div>
        
        <div className="flex-fill">
          <div className="fw-bold">{title}</div>
          {message && (
            <div className="small">{message}</div>
          )}
        </div>
        
        <div className="ms-3">
          {onAction && actionLabel && (
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={handleAction}
            >
              {actionLabel}
            </button>
          )}
          
          {closable && (
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Schließen"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification; 