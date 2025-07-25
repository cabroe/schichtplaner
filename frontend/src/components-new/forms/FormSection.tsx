import React from 'react';
import Card from '../ui/Card';

export interface FormSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

/**
 * Form-Sektion-Komponente
 */
export const FormSection: React.FC<FormSectionProps> = ({
  children,
  title,
  subtitle,
  className = '',
  collapsible = false,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card 
      title={title}
      subtitle={subtitle}
      className={className}
      collapsible={collapsible}
      collapsed={isCollapsed}
      onToggle={toggleCollapse}
    >
      {children}
    </Card>
  );
};

export default FormSection; 