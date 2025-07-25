import React from 'react';

export type AlertVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Alert-Komponente für Feedback und Benachrichtigungen
 */
export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className = '',
  icon
}) => {
  const alertClasses = [
    'alert',
    `alert-${variant}`,
    dismissible ? 'alert-dismissible' : '',
    className
  ].filter(Boolean).join(' ');

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className={alertClasses} role="alert">
      {icon && <span className="me-2">{icon}</span>}
      {children}
      {dismissible && (
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Schließen"
          onClick={handleDismiss}
        />
      )}
    </div>
  );
};

export default Alert; 