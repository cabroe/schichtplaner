import React from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

/**
 * Loading-Spinner-Komponente
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
  text,
  fullScreen = false
}) => {
  const spinnerClasses = [
    'spinner-border',
    `spinner-border-${size}`,
    `text-${variant}`,
    className
  ].filter(Boolean).join(' ');

  const spinnerElement = (
    <div className="d-flex flex-column align-items-center">
      <div className={spinnerClasses} role="status">
        <span className="visually-hidden">Lädt...</span>
      </div>
      {text && <div className="mt-2 text-muted">{text}</div>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 9999 }}>
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default LoadingSpinner; 