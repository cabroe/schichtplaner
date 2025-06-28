import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faClock, faCog } from '@fortawesome/free-solid-svg-icons';
import { NavigationItem, defaultNavigationItems } from '../../config/navigation';

interface SidebarProps {
  brandName?: string;
  brandHref?: string;
  navigationItems?: NavigationItem[];
}

const iconMap = {
  dashboard: faTachometerAlt,
  zeiterfassung: faClock,
  administration: faCog
};

const dropdownMenus = {
  zeiterfassung: [
    { href: "/zeiterfassung/meine-zeiten", title: "Meine Zeiten", active: true },
    { href: "/zeiterfassung/kalender", title: "Kalender", active: false },
    { href: "/zeiterfassung/export", title: "Export", active: false },
    { href: "/zeiterfassung/alle-zeiten", title: "Alle Zeiten", active: false }
  ],
  administration: [
    { href: "/administration/kunden", title: "Kunden", active: false },
    { href: "/administration/projekte", title: "Projekte", active: false },
    { href: "/administration/taetigkeiten", title: "Tätigkeiten", active: false }
  ]
};

export function Sidebar({ 
  brandName = "Kastner IT", 
  brandHref = "/dashboard",
  navigationItems = defaultNavigationItems
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (itemId: string) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  return (
    <aside id="sidebar-nav" role="navigation" className="navbar-vertical navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <h1 className="navbar-brand d-none d-lg-inline-flex">
          <a href={brandHref} title="Dashboard">
            <span>{brandName}</span>
          </a>
        </h1>
        
        <button 
          aria-controls="navbar-menu" 
          type="button" 
          aria-label="Toggle navigation" 
          className={`navbar-toggler ${isCollapsed ? 'collapsed' : ''}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="d-lg-none flex-fill">
          <h2 className="page-title text-white ps-2 mb-0">Navigation</h2>
        </div>
        
        <div className={`navbar-collapse ${isCollapsed ? 'collapse' : ''}`} id="navbar-menu">
          <ul className="pt-lg-3 flex-column navbar-nav">
            {navigationItems.map((item) => (
              <li 
                key={item.id}
                className={`nav-item ${item.isActive ? 'active' : ''} ${item.isDropdown ? 'dropdown' : ''}`}
              >
                {item.isDropdown ? (
                  <>
                    <a
                      id={item.id}
                      href="#"
                      className="nav-link dropdown-toggle"
                      role="button"
                      tabIndex={0}
                      aria-expanded={activeDropdown === item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleDropdown(item.id);
                      }}
                    >
                      <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
                        <FontAwesomeIcon icon={iconMap[item.id as keyof typeof iconMap]} />
                      </span>
                      <span className="nav-link-title">{item.title}</span>
                    </a>
                    {activeDropdown === item.id && dropdownMenus[item.id as keyof typeof dropdownMenus] && (
                      <div className="dropdown-menu show">
                        {dropdownMenus[item.id as keyof typeof dropdownMenus].map((subItem, index) => (
                          <a
                            key={index}
                            className={`dropdown-item ${subItem.active ? 'active' : ''}`}
                            href={subItem.href}
                          >
                            {subItem.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    id={item.id}
                    href={item.href}
                    className="nav-link"
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
                      <FontAwesomeIcon icon={iconMap[item.id as keyof typeof iconMap]} />
                    </span>
                    <span className="nav-link-title">{item.title}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
