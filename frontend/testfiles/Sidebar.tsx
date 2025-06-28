// src/components/Sidebar.tsx
import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faClock,
  faCog,
  // Füge hier weitere benötigte Icons hinzu
} from '@fortawesome/free-solid-svg-icons';

// Definiere die Props, falls du welche übergeben möchtest (z.B. activeKey)
interface SidebarProps {
  // Hier könnten Props definiert werden, z.B. um den aktiven Link zu steuern
}

const Sidebar: React.FC<SidebarProps> = () => {
  // In einer echten Anwendung kämen User-Daten, Timer-Status etc. aus dem State oder Props
  const brandName = "Kastner IT";
  const dashboardPath = "/dashboard/"; // Entfernung von "/de" im Pfad

  return (
    <Navbar
      as="aside" // Rendert als <aside>-Element statt <nav>
      expand="lg" // Definiert den Breakpoint, unter dem die Navbar einklappt (lg = large)
      variant="dark" // Wendet dunkles Theme an (entspricht data-bs-theme="dark")
      className="navbar-vertical" // Wichtige Klasse von Tabler für das vertikale Layout
      id="sidebar-nav" // Eigene ID für die Sidebar
    >
      <Container fluid>
        {/* --- Brand / Logo --- */}
        {/* Wird auf großen Bildschirmen angezeigt */}
        <h1 className="navbar-brand d-none d-lg-inline-flex">
          <a href={dashboardPath} title="Dashboard">
            <span>{brandName}</span>
          </a>
        </h1>

        {/* --- Navbar Toggler --- */}
        {/* Wird auf kleinen Bildschirmen angezeigt, um das Menü zu öffnen/schließen */}
        <Navbar.Toggle aria-controls="navbar-menu" />

        {/* --- Mobile Page Title (Beispiel) --- */}
        {/* Einfacher Titel, der nur auf kleinen Screens (< lg) sichtbar ist */}
        {/* Die genaue Platzierung relativ zum Toggler kann CSS-Anpassungen erfordern */}
        <div className="d-lg-none flex-fill">
           <h2 className="page-title text-white ps-2 mb-0">Navigation</h2>
        </div>

        {/* --- Collapsible Menu Content --- */}
        <Navbar.Collapse id="navbar-menu">
          {/* Hauptnavigationsliste */}
          {/* `flex-column` ist wichtig für die vertikale Ausrichtung */}
          {/* `pt-lg-3` fügt oben Padding auf großen Screens hinzu */}
          <Nav className="pt-lg-3 flex-column" as="ul">

            {/* --- Beispiel Navigationslinks --- */}

            {/* Dashboard (Einfacher Link) */}
            <Nav.Item as="li">
              <Nav.Link href={dashboardPath}>
                <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
                  <FontAwesomeIcon icon={faTachometerAlt} />
                </span>
                <span className="nav-link-title">Dashboard</span>
              </Nav.Link>
            </Nav.Item>

            {/* Zeiterfassung (Dropdown) */}
            {/* 'active' Klasse muss hier manuell oder basierend auf Routing hinzugefügt werden */}
            <NavDropdown
              as="li" // Wichtig, damit es als Listenelement gerendert wird
              title={
                <>
                  <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
                    <FontAwesomeIcon icon={faClock} />
                  </span>
                  <span className="nav-link-title">Zeiterfassung</span>
                </>
              }
              id="nav-dropdown-times"
              className="nav-item active" // Beispiel: Manuell als aktiv markiert
            >
              {/* Dropdown-Elemente */}
              <NavDropdown.Item href="/timesheet/" active>
                 {/* Optional: Icon auch im Dropdown */}
                 {/* <FontAwesomeIcon icon={faClock} className="me-2" /> */}
                 Meine Zeiten
              </NavDropdown.Item>
              <NavDropdown.Item href="/calendar/">
                 {/* <FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> */}
                 Kalender
              </NavDropdown.Item>
              <NavDropdown.Item href="/export/">
                 {/* <FontAwesomeIcon icon={faFileExport} className="me-2" /> */}
                 Export
              </NavDropdown.Item>
              <NavDropdown.Item href="/team/timesheet/">
                 {/* <FontAwesomeIcon icon={faUserClock} className="me-2" /> */}
                 Alle Zeiten
              </NavDropdown.Item>
            </NavDropdown>

            {/* Administration (Dropdown) */}
            <NavDropdown
              as="li"
              title={
                <>
                  <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
                    <FontAwesomeIcon icon={faCog} /> {/* Beispiel Icon */}
                  </span>
                  <span className="nav-link-title">Administration</span>
                </>
              }
              id="nav-dropdown-admin"
              className="nav-item"
            >
              <NavDropdown.Item href="/admin/customer/">
                 {/* <FontAwesomeIcon icon={faUserTie} className="me-2" /> */}
                 Kunden
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/project/">
                 {/* <FontAwesomeIcon icon={faBriefcase} className="me-2" /> */}
                 Projekte
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/activity/">
                 {/* <FontAwesomeIcon icon={faTasks} className="me-2" /> */}
                 Tätigkeiten
              </NavDropdown.Item>
              {/* ... weitere Admin-Links */}
            </NavDropdown>

            {/* Füge hier weitere Nav.Item oder NavDropdown hinzu */}

          </Nav>
        </Navbar.Collapse>

        {/* Hinweis: Die komplexen Elemente wie Timer, Notifications, User Menu (besonders deren mobile Varianten)
            sind hier nicht implementiert. Sie würden separate Komponenten, State Management und
            wahrscheinlich benutzerdefiniertes Styling erfordern, um sie exakt nachzubilden. */}

      </Container>
    </Navbar>
  );
};

export default Sidebar;
