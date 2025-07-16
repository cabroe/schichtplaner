import React from "react";

interface PageHeaderProps {
  children: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ children }) => {
  return (
    <div className="page-header d-print-none">
      <div className="row align-items-center">
        {children}
      </div>
    </div>
  );
};

export default PageHeader; 