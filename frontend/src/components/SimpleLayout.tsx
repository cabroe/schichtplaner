import { ReactNode } from 'react';

interface SimpleLayoutProps {
  children: ReactNode;
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="page">
      <div className="page-wrapper">
        <div className="page-body">
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
