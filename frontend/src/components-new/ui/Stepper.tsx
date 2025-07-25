import React from 'react';
import { Icon } from './Icon';

export interface StepperStep {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  completed?: boolean;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  variant?: 'default' | 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStepNumbers?: boolean;
  allowStepNavigation?: boolean;
}

/**
 * Stepper-Komponente für Schritt-für-Schritt-Navigation
 */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  variant = 'default',
  size = 'md',
  className = '',
  showStepNumbers = true,
  allowStepNavigation = true
}) => {
  const getStepperClass = () => {
    const classes = [
      'd-flex',
      variant === 'vertical' ? 'flex-column' : 'flex-row',
      size === 'sm' ? 'small' : size === 'lg' ? 'large' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getStepClass = (index: number) => {
    const step = steps[index];
    const isActive = index === currentStep;
    const isCompleted = step.completed || index < currentStep;
    const isDisabled = step.disabled || (!allowStepNavigation && index > currentStep);
    
    const classes = [
      'd-flex align-items-center',
      isActive ? 'text-primary' : '',
      isCompleted ? 'text-success' : '',
      isDisabled ? 'opacity-50' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getStepIconClass = (index: number) => {
    const step = steps[index];
    const isActive = index === currentStep;
    const isCompleted = step.completed || index < currentStep;
    
    const classes = [
      'rounded-circle d-flex align-items-center justify-content-center me-3',
      isActive ? 'bg-primary text-white' : '',
      isCompleted ? 'bg-success text-white' : 'bg-light text-muted'
    ];
    return classes.filter(Boolean).join(' ');
  };

  const handleStepClick = (index: number) => {
    const step = steps[index];
    if (step.disabled || (!allowStepNavigation && index > currentStep)) return;
    onStepClick?.(index);
  };

  const renderStepIcon = (step: StepperStep, index: number) => {
    const isCompleted = step.completed || index < currentStep;
    
    if (isCompleted) {
      return <Icon name="check" size="sm" />;
    }
    
    if (step.icon) {
      return <Icon name={step.icon as any} size="sm" />;
    }
    
    return showStepNumbers ? (index + 1).toString() : null;
  };

  const renderStep = (step: StepperStep, index: number) => {
    const isLast = index === steps.length - 1;
    
    return (
      <div key={step.id} className={getStepClass(index)}>
        <div 
          onClick={() => handleStepClick(index)}
          style={{ cursor: allowStepNavigation ? 'pointer' : 'default' }}
        >
          <div className={getStepIconClass(index)} style={{ width: '32px', height: '32px' }}>
            {renderStepIcon(step, index)}
          </div>
          
          <div>
            <div className="fw-bold">{step.title}</div>
            {step.description && (
              <div className="text-muted small">
                {step.description}
              </div>
            )}
          </div>
        </div>
        
        {!isLast && variant !== 'vertical' && (
          <div className="mx-3" style={{ width: '20px', height: '2px', backgroundColor: '#dee2e6' }} />
        )}
      </div>
    );
  };

  return (
    <div className={getStepperClass()}>
      {steps.map(renderStep)}
    </div>
  );
};

export default Stepper; 