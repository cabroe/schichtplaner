import React, { useRef } from "react";
import { UserDropdown, TicktacActions, RecentActivities } from "../";
import { useUiStore } from "../../store/useUiStore";
import { routeConfig } from "../../routes/routeConfig";
import { Link, useLocation } from "react-router-dom";
import type { PageTitleEntry } from "../../routes/routeConfig";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  const togglerRef = useRef<HTMLButtonElement>(null);
  const { open, close, isOpen } = useUiStore();

  // Hilfsfunktion für Submenu-Active-State
  const isSubmenuActive = (children: Record<string, PageTitleEntry>) =>
    Object.keys(children).some((childPath) => pathname === childPath);

  // Hilfsfunktion, um den aktuellen Titel anhand des Pfads zu finden (inkl. Children)
  function findPageTitle(pathname: string, entries: Record<string, PageTitleEntry>): string {
    for (const [key, entry] of Object.entries(entries)) {
      if (key === pathname) return entry.title;
      if (entry.children) {
        const childTitle = findPageTitle(pathname, entry.children);
        if (childTitle) return childTitle;
      }
    }
    return "";
  }

  // Öffnen/Schließen des Menüs über den Toggler (global via Zustand)
  function handleTogglerClick() {
    if (isOpen("sidebar")) {
      close();
    } else {
      open("sidebar");
    }
  }

  // Schließen bei Link-Klick (z.B. Navigation)
  function handleCloseSidebarMenu() {
    close();
  }

  const currentTitle = findPageTitle(pathname, routeConfig) || "";

  return (
    <aside className="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
      <div className="container-fluid">
        {/* Toggler für mobile Ansicht */}
        <button
          className={"navbar-toggler" + (isOpen("sidebar") ? "" : " collapsed")}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-menu"
          aria-expanded={isOpen("sidebar") ? "true" : "false"}
          ref={togglerRef}
          onClick={handleTogglerClick}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Brand und Titel */}
        <div className="d-flex justify-content-start flex-fill d-lg-none">
          <h2 className="page-title d-lg-none ps-2 text-white">{currentTitle}</h2>
          <h1 className="navbar-brand d-none d-lg-inline-flex">
            <Link to="/" title="Dashboard" onClick={handleCloseSidebarMenu}>
              Schichtplaner
            </Link>
          </h1>
        </div>
        <h1 className="navbar-brand d-none d-lg-inline-flex">
          <Link to="/" title="Dashboard" className="mt-2" onClick={handleCloseSidebarMenu}>
            Schichtplaner
          </Link>
        </h1>

        {/* Mobile: Schnellzugriffe und User-Menü */}
        <div className="navbar-nav flex-row d-lg-none">
          <TicktacActions />
          <RecentActivities />
          <UserDropdown />
        </div>

        {/* Hauptmenü */}
        <div id="navbar-menu" className={"collapse navbar-collapse" + (isOpen("sidebar") ? " show" : "") }>
          <ul className="navbar-nav pt-lg-3">
            {Object.entries(routeConfig).map(([path, entry]) => {
              if (entry.children) {
                // Submenu (z.B. Demos)
                return (
                  <li className={`nav-item dropdown${isSubmenuActive(entry.children) ? " active" : ""}`} key={path}>
                    <a
                      href="#"
                      className="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                      role="button"
                      aria-expanded={isSubmenuActive(entry.children) ? "true" : "false"}
                    >
                      <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
                        <i className={entry.icon}></i>
                      </span>
                      <span className="nav-link-title">{entry.title}</span>
                    </a>
                    <div className={`dropdown-menu${isSubmenuActive(entry.children) ? " show" : ""}`}>
                      {Object.entries(entry.children).map(([childPath, child]) => (
                        <Link className={`dropdown-item${pathname === childPath ? " active" : ""}`} to={childPath} key={childPath} onClick={handleCloseSidebarMenu}>
                          <span className="me-2"><i className={child.icon}></i></span>
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              }
              // Normale Route
              return (
                <li className={`nav-item${pathname === path ? " active" : ""}`} key={path}>
                  <Link className="nav-link" to={path} onClick={handleCloseSidebarMenu}>
                    <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
                      <i className={entry.icon}></i>
                    </span>
                    <span className="nav-link-title">{entry.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 