import React from 'react';
import { Container } from '../ui/Container';

export interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'white' | 'light' | 'transparent';
  border?: boolean;
  shadow?: boolean;
}

/**
 * Content-Area-Komponente
 */
export const ContentArea: React.FC<ContentAreaProps> = ({
  children,
  className = '',
  containerSize = 'lg',
  padding = 'md',
  background = 'white',
  border = false,
  shadow = false
}) => {
  const backgroundClass = background === 'light' ? 'bg-light' : 
                         background === 'white' ? 'bg-white' : '';
  const borderClass = border ? 'border' : '';
  const shadowClass = shadow ? 'shadow-sm' : '';
  
  const contentClasses = [
    'content-area',
    backgroundClass,
    borderClass,
    shadowClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={contentClasses}>
      <Container size={containerSize} padding={padding}>
        {children}
      </Container>
    </section>
  );
};

export default ContentArea; 