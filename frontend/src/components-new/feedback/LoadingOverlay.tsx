import React from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  backdrop?: boolean;
  zIndex?: number;
}

/**
 * Loading-Overlay-Komponente
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Laden...',
  size = 'md',
  className = '',
  backdrop = true,
  zIndex = 1050
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={`position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ${backdrop ? 'bg-dark bg-opacity-50' : ''} ${className}`}
      style={{ zIndex }}
    >
      <div className="text-center">
        <LoadingSpinner size={size} />
        {message && (
          <div className="mt-2 text-white">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay; 