import { ReactNode } from 'react';
import { PageHeader } from './PageHeader';

interface PageWrapperProps {
  children?: ReactNode;
  headerContent?: ReactNode;
}

export function PageWrapper({ children, headerContent }: PageWrapperProps) {
  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {headerContent && (
          <PageHeader>
            {headerContent}
          </PageHeader>
        )}
      </div>
      <div className="page-body">
        <div className="container-fluid">
          {children}
        </div>
      </div>
    </div>
  );
}
