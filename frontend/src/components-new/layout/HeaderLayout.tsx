import React from 'react';
import { Container } from '../ui/Container';

export interface HeaderLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  headerSticky?: boolean;
  headerShadow?: boolean;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Header-Layout-Komponente
 */
export const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  children,
  header,
  headerSticky = false,
  headerShadow = true,
  className = '',
  containerSize = 'lg',
  padding = 'md'
}) => {
  const headerClasses = [
    headerSticky ? 'sticky-top' : '',
    headerShadow ? 'shadow-sm' : '',
    'bg-white',
    'border-bottom'
  ].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <header className={headerClasses}>
        <Container size={containerSize} padding={padding}>
          {header}
        </Container>
      </header>
      
      <main>
        <Container size={containerSize} padding={padding}>
          {children}
        </Container>
      </main>
    </div>
  );
};

export default HeaderLayout; 