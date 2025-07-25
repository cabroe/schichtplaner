import React from 'react';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'fluid';

export interface ContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: string;
}

/**
 * Container-Komponente für responsive Layouts
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
  padding = 'md',
  maxWidth
}) => {
  const containerClass = size === 'fluid' ? 'container-fluid' : `container-${size}`;
  const paddingClass = padding !== 'md' ? `p-${padding === 'none' ? '0' : padding}` : '';
  
  const containerClasses = [
    containerClass,
    paddingClass,
    className
  ].filter(Boolean).join(' ');

  const style = maxWidth ? { maxWidth } : undefined;

  return (
    <div className={containerClasses} style={style}>
      {children}
    </div>
  );
};

export default Container; 