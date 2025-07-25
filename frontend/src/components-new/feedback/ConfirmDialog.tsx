import React from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  persistent?: boolean;
}

/**
 * Bestätigungsdialog-Komponente
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Bestätigen',
  cancelLabel = 'Abbrechen',
  type = 'info',
  onConfirm,
  onCancel,
  onClose,
  size = 'md',
  showIcon = true,
  persistent = false
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleClose = () => {
    if (!persistent) {
      onCancel();
    }
    onClose?.();
  };

  const getIconName = () => {
    switch (type) {
      case 'success': return 'check';
      case 'warning': return 'warning';
      case 'danger': return 'error';
      default: return 'info';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'danger': return '#dc3545';
      default: return '#17a2b8';
    }
  };

  const getConfirmButtonVariant = () => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'danger': return 'danger';
      default: return 'primary';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={size}
    >
      <div className="text-center">
        {showIcon && (
          <div className="mb-3">
            <Icon 
              name={getIconName() as any} 
              color={getIconColor()}
              size="xl"
            />
          </div>
        )}
        
        <div className="mb-3">
          <h4 className="mb-0">{title}</h4>
        </div>
        
        <div className="mb-4">
          <p className="mb-0">{message}</p>
        </div>
        
        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant="outline-secondary"
            onClick={handleCancel}
            disabled={persistent}
          >
            {cancelLabel}
          </Button>
          
          <Button
            variant={getConfirmButtonVariant()}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog; 