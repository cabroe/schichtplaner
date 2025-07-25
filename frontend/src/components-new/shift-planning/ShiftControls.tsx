import React from 'react';
import { Button } from '../ui/Button';
import Card from '../ui/Card';
import { Icon } from '../ui/Icon';

export interface ShiftControl {
  id: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface ShiftControlsProps {
  controls: ShiftControl[];
  title?: string;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Schicht-Steuerungskomponente
 */
export const ShiftControls: React.FC<ShiftControlsProps> = ({
  controls,
  title = 'Schicht-Steuerung',
  className = '',
  layout = 'horizontal',
  size = 'md'
}) => {
  const layoutClass = layout === 'vertical' ? 'd-flex flex-column' : 'd-flex flex-wrap';
  const gapClass = layout === 'vertical' ? 'gap-2' : 'gap-2';

  return (
    <Card 
      title={title}
      className={className}
    >
      <div className={`${layoutClass} ${gapClass}`}>
        {controls.map((control) => (
          <Button
            key={control.id}
            variant={control.variant || 'secondary'}
            size={size}
            onClick={control.onClick}
            disabled={control.disabled}
            loading={control.loading}
            icon={control.icon ? <Icon name={control.icon as any} /> : undefined}
          >
            {control.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default ShiftControls; 