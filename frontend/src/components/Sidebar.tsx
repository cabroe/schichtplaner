import { useLocation, Link } from 'react-router-dom';
import { sidebarMenuItems, MenuItem } from '../data/sidebarMenuItems';

export function Sidebar() {
  const location = useLocation();

  const closeMobileMenu = () => {
    // Verwende setTimeout um sicherzustellen, dass React Router Navigation zuerst passiert
    setTimeout(() => {
      const navbarCollapse = document.getElementById('navbar-menu');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        // Entferne die 'show' Klasse direkt ohne Bootstrap API
        navbarCollapse.classList.remove('show');
        // Setze aria-expanded auf false
        const toggleButton = document.querySelector('[data-bs-target="#navbar-menu"]');
        if (toggleButton) {
          toggleButton.setAttribute('aria-expanded', 'false');
        }
      }
    }, 100);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isChildActive = (item: MenuItem): boolean => {
    if (!item.children) return false;
    return item.children.some(child => location.pathname === child.path);
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.isDropdown && item.children) {
      const hasActiveChild = isChildActive(item);
      return (
        <li key={item.id} id={item.id} className={`nav-item dropdown ${hasActiveChild ? 'active' : ''}`}>
          <a className={`nav-link dropdown-toggle ${hasActiveChild ? 'active' : ''}`} role="button" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded={hasActiveChild}>
            <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
              <i className={item.icon}></i>
            </span>
            <span className="nav-link-title">{item.title}</span>
          </a>
          <div className={`dropdown-menu ${hasActiveChild ? 'show' : ''}`} data-bs-popper="none">
            <div className="dropdown-menu-columns">
              <div className="dropdown-menu-column">
                {item.children.map(child => (
                  <Link 
                    key={child.id} 
                    className={`dropdown-item ${isActive(child.path) ? 'active' : ''}`} 
                    to={child.path}
                    onClick={closeMobileMenu}
                  >
                    <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
                      <i className={child.icon}></i>
                    </span>
                    {child.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </li>
      );
    }

    return (
      <li key={item.id} id={item.id} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
        <Link className="nav-link" to={item.path} onClick={closeMobileMenu}>
          <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
            <i className={item.icon}></i>
          </span>
          <span className="nav-link-title">
            {item.title}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <aside className="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="d-flex justify-content-start flex-fill d-lg-none">
          <h2 className="page-title d-lg-none ps-2 text-white">Dashboard</h2>
          <h1 className="navbar-brand  d-none d-lg-inline-flex">
            <a href="/de/dashboard/" title="Dashboard">
              {/* <img className="navbar-brand-image" alt="Kimai 2.37.0" width="110" height="32" src="/touch-icon-192x192.png"></img> */}
              Schichtplaner
            </a>                    
          </h1>                
        </div>

        <h1 className="navbar-brand  d-none d-lg-inline-flex">
          <Link to="/" title="Dashboard" className="p-2">
            {/* <img className="navbar-brand-image" alt="Kimai 2.37.0" width="110" height="32" src="/touch-icon-192x192.png"></img> */}
            Schichtplaner
          </Link>
        </h1>

        
        <div id="navbar-menu" className="collapse navbar-collapse">
          <ul className="navbar-nav pt-lg-3">
            {sidebarMenuItems.map(renderMenuItem)}
          </ul>
        </div>
      </div>
    </aside>
  );
}