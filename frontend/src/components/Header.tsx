import React from "react";
import UserDropdown from "./UserDropdown";
import TicktacActions from "./TicktacActions";
import RecentActivities from "./RecentActivities";

interface HeaderProps {
  title: string;
}

// Header-Komponente im Tabler-Stil
const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="navbar navbar-expand-md d-none d-lg-flex d-print-none">
      <div className="container-fluid">
        {/* Toggler-Button (optional, für Responsive) */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Rechte Seite: Aktionen und User-Menü */}
        <div className="navbar-nav flex-row order-md-last">
          <TicktacActions />
          <RecentActivities />
          <UserDropdown />
        </div>

        {/* Titel */}
        <div className="collapse navbar-collapse" id="navbar-menu">
          <h2 className="page-title me-2">{title}</h2>
        </div>
      </div>
    </header>
  );
};

export default Header; 