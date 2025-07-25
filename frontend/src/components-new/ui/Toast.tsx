import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

export interface ToastProps {
  /** Toast-ID */
  id?: string;
  /** Toast-Titel */
  title?: string;
  /** Toast-Nachricht */
  message: string;
  /** Toast-Typ */
  type?: 'success' | 'error' | 'warning' | 'info';
  /** Toast anzeigen */
  show: boolean;
  /** Toast automatisch ausblenden (in ms) */
  autoHide?: number;
  /** Callback beim Schließen */
  onClose: () => void;
  /** Toast-Position */
  position?: 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche Styles */
  style?: React.CSSProperties;
  /** Toast nicht schließbar */
  persistent?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  id = 'toast',
  title,
  message,
  type = 'info',
  show,
  autoHide = 5000,
  onClose,
  position = 'top-center',
  className = '',
  style,
  persistent = false
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (show && autoHide > 0 && !persistent) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Warte auf Animation
      }, autoHide);

      return () => clearTimeout(timer);
    }
  }, [show, autoHide, persistent, onClose]);

  const handleClose = () => {
    if (!persistent) {
      setIsVisible(false);
      setTimeout(onClose, 300); // Warte auf Animation
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return 'check';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'warning':
        return 'bg-warning text-white';
      case 'info':
      default:
        return 'bg-info text-white';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-start':
        return 'top-0 start-0';
      case 'top-center':
        return 'top-0 start-50 translate-middle-x';
      case 'top-end':
        return 'top-0 end-0';
      case 'bottom-start':
        return 'bottom-0 start-0';
      case 'bottom-center':
        return 'bottom-0 start-50 translate-middle-x';
      case 'bottom-end':
        return 'bottom-0 end-0';
      default:
        return 'top-0 start-50 translate-middle-x';
    }
  };

  if (!show) return null;

  const toastContent = (
    <div
      className={`toast-container position-fixed p-3 ${getPositionClasses()}`}
      style={{ zIndex: 11 }}
    >
      <div
        className={`toast ${isVisible ? 'show' : ''} ${className}`}
        id={id}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={style}
      >
        <div className={`toast-header ${getTypeClasses()}`}>
          <Icon name={getTypeIcon()} className="me-2" />
          {title && <strong className="me-auto">{title}</strong>}
          {!persistent && (
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="toast"
              aria-label="Schließen"
              onClick={handleClose}
            />
          )}
        </div>
        <div className="p-3">
          {message}
        </div>
      </div>
    </div>
  );

  return createPortal(toastContent, document.body);
};

export default React.memo(Toast); 