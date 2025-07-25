import React from 'react';

export type ValidationType = 'error' | 'warning' | 'info' | 'success';

export interface ValidationMessageProps {
  type: ValidationType;
  message: string;
  className?: string;
  showIcon?: boolean;
}

/**
 * Validierungs-Nachrichten-Komponente
 */
export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  type,
  message,
  className = '',
  showIcon = true
}) => {
  const getIcon = () => {
    if (!showIcon) return null;
    
    const iconMap = {
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
      success: 'fas fa-check-circle'
    };
    
    return <i className={`${iconMap[type]} me-2`} />;
  };

  const getClasses = () => {
    const baseClasses = 'd-flex align-items-center small';
    const typeClasses = {
      error: 'text-danger',
      warning: 'text-warning',
      info: 'text-info',
      success: 'text-success'
    };
    
    return `${baseClasses} ${typeClasses[type]} ${className}`;
  };

  return (
    <div className={getClasses()}>
      {getIcon()}
      <span>{message}</span>
    </div>
  );
};

export default ValidationMessage; 