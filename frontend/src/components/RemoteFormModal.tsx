import React, { useEffect } from 'react';

interface RemoteFormModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
  size?: 'sm' | 'lg' | 'xl';
  children: React.ReactNode;
}

const RemoteFormModal: React.FC<RemoteFormModalProps> = ({
  title,
  isOpen,
  onClose,
  footer,
  size = 'lg',
  children
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = size ? `modal-${size}` : '';

  return (
    <div 
      className="modal show d-block" 
      tabIndex={-1} 
      role="dialog" 
      aria-labelledby="modal-title"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`modal-dialog ${sizeClass}`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modal-title">{title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Schließen"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoteFormModal;