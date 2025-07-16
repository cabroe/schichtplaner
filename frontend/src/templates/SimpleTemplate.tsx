import React from "react";

interface SimpleTemplateProps {
  children: React.ReactNode;
}

const SimpleTemplate: React.FC<SimpleTemplateProps> = ({ children }) => {
  return (
    <div className="page page-center">
      {children}
    </div>
  );
};

export default SimpleTemplate; 