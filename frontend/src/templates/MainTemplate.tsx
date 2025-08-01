import React from "react";
import { Sidebar, HeaderWithRoute, PageHeader } from "../components";
import { useLocation } from "react-router-dom";
import { getHeaderComponentForRoute } from "../utils/routeUtils";

interface MainTemplateProps {
  children: React.ReactNode;
}

function PageHeaderContent() {
  const location = useLocation();
  const { pathname } = location;
  const HeaderComponent = getHeaderComponentForRoute(pathname);
  if (HeaderComponent) {
    return <HeaderComponent />;
  }
  return null;
}

const MainTemplate: React.FC<MainTemplateProps> = ({ children }) => {
  return (
    <div className="page">
      <Sidebar />
      <HeaderWithRoute />
      <div className="page-wrapper">
        <div className="container-fluid">
          <PageHeader>
            <PageHeaderContent />
          </PageHeader>
        </div>
        <div className="page-body">
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTemplate; 