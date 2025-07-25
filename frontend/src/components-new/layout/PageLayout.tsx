import React from 'react';
import { Container } from '../ui/Container';

export interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Seitenlayout-Komponente
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  header,
  sidebar,
  footer,
  className = '',
  containerSize = 'lg',
  padding = 'md'
}) => {
  const renderHeader = () => {
    if (!header && !title) return null;
    
    return (
      <div className="mb-4">
        {header || (
          <>
            {title && <h1 className="h2 mb-2">{title}</h1>}
            {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (sidebar) {
      return (
        <div className="row">
          <div className="col-lg-9">
            {children}
          </div>
          <div className="col-lg-3">
            {sidebar}
          </div>
        </div>
      );
    }
    
    return children;
  };

  return (
    <div className={className}>
      <Container size={containerSize} padding={padding}>
        {renderHeader()}
        {renderContent()}
        {footer && (
          <div className="mt-5">
            {footer}
          </div>
        )}
      </Container>
    </div>
  );
};

export default PageLayout; 