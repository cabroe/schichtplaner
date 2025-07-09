import React from 'react';

interface RemoteFormModalProps {
  id?: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'lg' | 'xl';
}

const RemoteFormModal: React.FC<RemoteFormModalProps> = ({
  id = 'remote_form_modal',
  title = '',
  isOpen,
  onClose,
  children,
  footer,
  size = 'lg'
}) => {
  // Modal schließen bei Escape-Taste
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Body-Scroll verhindern wenn Modal offen ist
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal d-block" 
      id={id}
      tabIndex={-1}
      role="dialog"
      aria-labelledby={`${id}_label`}
      aria-hidden={!isOpen}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className={`modal-dialog modal-${size}`}
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}_label`}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Schließen"
            />
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