import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  /** Modal-ID für Accessibility */
  id?: string;
  /** Modal-Titel */
  title?: string;
  /** Modal-Inhalt */
  children?: React.ReactNode;
  /** Benutzerdefinierter Footer */
  footer?: React.ReactNode;
  /** Modal-Größe */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  /** Modal zentriert anzeigen */
  centered?: boolean;
  /** Modal scrollbar machen */
  scrollable?: boolean;
  /** Modal öffnet sich */
  isOpen: boolean;
  /** Callback beim Schließen */
  onClose: () => void;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche Header-Klassen */
  headerClassName?: string;
  /** Zusätzliche Body-Klassen */
  bodyClassName?: string;
  /** Zusätzliche Footer-Klassen */
  footerClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  id = 'modal',
  title,
  children,
  footer,
  size = 'lg',
  centered = true,
  scrollable = false,
  isOpen,
  onClose,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = ''
}) => {
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`modal show d-block ${className}`}
      id={id}
      tabIndex={-1}
      role="dialog"
      aria-labelledby={`${id}_label`}
      aria-modal="true"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className={`modal-dialog ${size !== 'md' ? `modal-${size}` : ''} ${centered ? 'modal-dialog-centered' : ''} ${scrollable ? 'modal-dialog-scrollable' : ''}`}
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          {(title || true) && (
            <div className={`modal-header ${headerClassName}`}>
              {title && (
                <h5 className="modal-title" id={`${id}_label`}>
                  {title}
                </h5>
              )}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Schließen"
                onClick={onClose}
              />
            </div>
          )}
          
          <div className={`modal-body ${bodyClassName}`}>
            {children}
          </div>
          
          {(footer || true) && (
            <div className={`modal-footer ${footerClassName}`}>
              {footer || (
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={onClose}
                >
                  Schließen
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default React.memo(Modal); 