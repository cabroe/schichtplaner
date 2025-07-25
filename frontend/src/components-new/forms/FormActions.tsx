import React from 'react';
import { Button } from '../ui/Button';

export interface FormAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export interface FormActionsProps {
  actions: FormAction[];
  className?: string;
  align?: 'left' | 'center' | 'right';
  spacing?: 'sm' | 'md' | 'lg';
}

/**
 * Form-Aktionen-Komponente
 */
export const FormActions: React.FC<FormActionsProps> = ({
  actions,
  className = '',
  align = 'right',
  spacing = 'md'
}) => {
  const alignClass = align !== 'right' ? `justify-content-${align}` : 'justify-content-end';
  const spacingClass = spacing !== 'md' ? `gap-${spacing}` : 'gap-2';

  return (
    <div className={`form-actions d-flex ${alignClass} ${spacingClass} ${className}`}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'secondary'}
          type={action.type || 'button'}
          onClick={action.onClick}
          disabled={action.disabled}
          loading={action.loading}
          icon={action.icon}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default FormActions; 