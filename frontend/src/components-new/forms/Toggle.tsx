import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
  showLabel?: boolean;
  id?: string;
}

/**
 * Toggle-Switch-Komponente
 */
export const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  disabled = false,
  label,
  description,
  className = '',
  onChange,
  id,
  showLabel = true
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const getToggleClass = () => {
    const classes = [
      'form-check form-switch',
      disabled ? 'opacity-50' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getSwitchClass = () => {
    const classes = [
      'form-check-input',
      disabled ? 'opacity-50' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div className={getToggleClass()}>
      <div className="d-flex align-items-center">
        <div className="form-check form-switch">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className={getSwitchClass()}
          />
        </div>
        
        {showLabel && (label || description) && (
          <div className="ms-3">
            {label && (
              <div className="fw-bold">{label}</div>
            )}
            {description && (
              <div className="text-muted small">{description}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toggle; 