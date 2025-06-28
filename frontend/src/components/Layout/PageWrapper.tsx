import { ReactNode } from 'react';

interface PageWrapperProps {
  children?: ReactNode;
  headerContent?: ReactNode;
}

export function PageWrapper({ children, headerContent }: PageWrapperProps) {
  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="page-header d-print-none">
          <div className="align-items-center row">
            {headerContent}
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-fluid">
          {children}
        </div>
      </div>
    </div>
  );
}
