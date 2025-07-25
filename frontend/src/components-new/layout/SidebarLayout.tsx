import React from 'react';
import { Container } from '../ui/Container';

export interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: 'sm' | 'md' | 'lg';
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Sidebar-Layout-Komponente
 */
export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  sidebar,
  sidebarPosition = 'left',
  sidebarWidth = 'md',
  className = '',
  containerSize = 'lg',
  padding = 'md'
}) => {
  const sidebarColClass = sidebarWidth === 'sm' ? 'col-lg-3' : 
                         sidebarWidth === 'lg' ? 'col-lg-4' : 'col-lg-3';
  const contentColClass = sidebarWidth === 'sm' ? 'col-lg-9' : 
                         sidebarWidth === 'lg' ? 'col-lg-8' : 'col-lg-9';

  const sidebarElement = (
    <div className={sidebarColClass}>
      {sidebar}
    </div>
  );

  const contentElement = (
    <div className={contentColClass}>
      {children}
    </div>
  );

  return (
    <div className={className}>
      <Container size={containerSize} padding={padding}>
        <div className="row g-4">
          {sidebarPosition === 'left' ? (
            <>
              {sidebarElement}
              {contentElement}
            </>
          ) : (
            <>
              {contentElement}
              {sidebarElement}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SidebarLayout; 