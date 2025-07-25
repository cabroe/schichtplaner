import React from 'react';

export interface ProgressBarProps {
  /** Aktueller Wert */
  value: number;
  /** Maximaler Wert */
  max?: number;
  /** ProgressBar-Variante */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  /** ProgressBar-Größe */
  size?: 'sm' | 'md' | 'lg';
  /** ProgressBar mit Streifen-Animation */
  striped?: boolean;
  /** ProgressBar mit Animation */
  animated?: boolean;
  /** ProgressBar mit Label */
  showLabel?: boolean;
  /** Benutzerdefiniertes Label */
  label?: string;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche Styles */
  style?: React.CSSProperties;
  /** Zusätzliche Bar-Klassen */
  barClassName?: string;
  /** Zusätzliche Bar-Styles */
  barStyle?: React.CSSProperties;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  striped = false,
  animated = false,
  showLabel = false,
  label,
  className = '',
  style,
  barClassName = '',
  barStyle
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const baseClasses = 'progress';
  const sizeClasses = size === 'sm' ? 'progress-sm' : size === 'lg' ? 'progress-lg' : '';
  
  const combinedClasses = [
    baseClasses,
    sizeClasses,
    className
  ].filter(Boolean).join(' ');

  const barClasses = [
    'progress-bar',
    `bg-${variant}`,
    striped && 'progress-bar-striped',
    animated && 'progress-bar-animated',
    barClassName
  ].filter(Boolean).join(' ');

  const displayLabel = label || (showLabel ? `${Math.round(percentage)}%` : '');

  return (
    <div className={combinedClasses} style={style}>
      <div
        className={barClasses}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{
          width: `${percentage}%`,
          ...barStyle
        }}
      >
        {displayLabel && (
          <span>
            {displayLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProgressBar); 