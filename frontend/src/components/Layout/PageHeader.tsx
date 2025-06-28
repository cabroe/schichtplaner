import { ReactNode } from 'react';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function PageHeader({ children, className, ...rest }: PageHeaderProps) {
  const combinedClassName = `page-header d-print-none ${className || ''}`.trim();

  return (
    <div className={combinedClassName} {...rest}>
      <div className="align-items-center row">
        {children}
      </div>
    </div>
  );
}
