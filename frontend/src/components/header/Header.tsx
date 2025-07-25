import React from "react";
import { UserDropdown, TicktacActions, RecentActivities, Status } from "../";

interface HeaderProps {
  title: string;
  /** Optionaler Status, der im Header angezeigt wird */
  status?: {
    /** Status-Text oder Inhalt */
    content: React.ReactNode;
    /** Status-Variante (Farbe) */
    variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'teal' | 'purple' | 'pink' | 'yellow' | 'orange' | 'green' | 'blue' | 'red' | 'gray';
    /** Status-Größe */
    size?: 'sm' | 'md' | 'lg';
  };
}

// Header-Komponente im Tabler-Stil
const Header: React.FC<HeaderProps> = ({ title, status }) => {
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

        {/* Titel und Status */}
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="d-flex align-items-center">
            <h2 className="page-title me-2">{title}</h2>
            {status && (
              <Status 
                variant={status.variant} 
                size={status.size}
                className="ms-1"
              >
                {status.content}
              </Status>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 