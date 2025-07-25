import React, { useState, useEffect } from 'react';

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  onAfterChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  showValue?: boolean;
  showMarks?: boolean;
  marks?: Record<number, string>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'range';
  rangeValues?: [number, number];
  onRangeChange?: (values: [number, number]) => void;
}

/**
 * Slider-Komponente
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onAfterChange,
  disabled = false,
  className = '',
  showValue = false,
  showMarks = false,
  marks = {},
  variant = 'default',
  rangeValues = [min, max],
  onRangeChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [localRangeValues, setLocalRangeValues] = useState(rangeValues);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    setLocalRangeValues(rangeValues);
  }, [rangeValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseFloat(e.target.value);
    const newRangeValues: [number, number] = [...localRangeValues] as [number, number];
    newRangeValues[index] = newValue;
    
    // Ensure min <= max
    if (index === 0 && newValue > newRangeValues[1]) {
      newRangeValues[0] = newRangeValues[1];
    } else if (index === 1 && newValue < newRangeValues[0]) {
      newRangeValues[1] = newRangeValues[0];
    } else {
      newRangeValues[index] = newValue;
    }
    
    setLocalRangeValues(newRangeValues);
    onRangeChange?.(newRangeValues);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onAfterChange?.(localValue);
    }
  };

  const getSliderClass = () => {
    const classes = [
      'position-relative',
      disabled ? 'opacity-50' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getTrackClass = () => {
    const classes = [
      'position-relative',
      disabled ? 'opacity-50' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getThumbClass = () => {
    const classes = [
      'form-range',
      disabled ? 'opacity-50' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getProgressStyle = () => {
    if (variant === 'range') {
      const minVal = localRangeValues[0];
      const maxVal = localRangeValues[1];
      const left = ((minVal - min) / (max - min)) * 100;
      const width = ((maxVal - minVal) / (max - min)) * 100;
      return { left: `${left}%`, width: `${width}%` };
    } else {
      const percentage = ((localValue - min) / (max - min)) * 100;
      return { width: `${percentage}%` };
    }
  };

  const renderMarks = () => {
    if (!showMarks) return null;

    return (
      <div className="position-relative mt-2">
        {Object.entries(marks).map(([markValue, label]) => (
          <div
            key={markValue}
            className="position-absolute text-center"
            style={{
              left: `${((parseFloat(markValue) - min) / (max - min)) * 100}%`,
              transform: 'translateX(-50%)',
              fontSize: '0.75rem',
              color: '#6c757d'
            }}
          >
            <span>{label}</span>
          </div>
        ))}
      </div>
    );
  };

  if (variant === 'range') {
    return (
      <div className={getSliderClass()}>
        <div className="position-relative">
          <div className={getTrackClass()}>
            <div 
              className="position-absolute bg-primary rounded" 
              style={{ 
                ...getProgressStyle(),
                height: '4px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} 
            />
            {renderMarks()}
          </div>
          
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localRangeValues[0]}
            onChange={(e) => handleRangeChange(e, 0)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={handleMouseUp}
            disabled={disabled}
            className={`position-absolute ${getThumbClass()}`}
            style={{ zIndex: 2 }}
          />
          
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localRangeValues[1]}
            onChange={(e) => handleRangeChange(e, 1)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={handleMouseUp}
            disabled={disabled}
            className={`position-absolute ${getThumbClass()}`}
            style={{ zIndex: 2 }}
          />
        </div>
        
        {showValue && (
          <div className="d-flex justify-content-between mt-2">
            <span>{localRangeValues[0]}</span>
            <span className="text-muted">-</span>
            <span>{localRangeValues[1]}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={getSliderClass()}>
      <div className="position-relative">
        <div className={getTrackClass()}>
          <div 
            className="position-absolute bg-primary rounded" 
            style={{ 
              ...getProgressStyle(),
              height: '4px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} 
          />
          {renderMarks()}
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={handleMouseUp}
          disabled={disabled}
          className={`position-absolute ${getThumbClass()}`}
          style={{ zIndex: 2 }}
        />
      </div>
      
      {showValue && (
        <div className="text-center mt-2">
          {localValue}
        </div>
      )}
    </div>
  );
};

export default Slider; 