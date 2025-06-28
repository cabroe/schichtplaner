import { NavigationItem, defaultNavigationItems } from '../../config/navigation';

interface SidebarProps {
  brandName?: string;
  brandHref?: string;
  navigationItems?: NavigationItem[];
}

export function Sidebar({ 
  brandName = "Kastner IT", 
  brandHref = "/dashboard/",
  navigationItems = defaultNavigationItems
}: SidebarProps) {
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
          className="navbar-toggler collapsed"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="d-lg-none flex-fill">
          <h2 className="page-title text-white ps-2 mb-0">Navigation</h2>
        </div>
        
        <div className="navbar-collapse collapse" id="navbar-menu">
          <ul className="pt-lg-3 flex-column navbar-nav">
            {navigationItems.map((item) => (
              <li 
                key={item.id}
                className={`nav-item ${item.isActive ? 'active' : ''} ${item.isDropdown ? 'nav-item dropdown' : ''}`}
              >
                <a
                  id={item.id}
                  href={item.href}
                  className={`nav-link ${item.isDropdown ? 'dropdown-toggle' : ''}`}
                  role={item.isDropdown ? "button" : undefined}
                  tabIndex={item.isDropdown ? 0 : undefined}
                  aria-expanded={item.isDropdown ? item.ariaExpanded : undefined}
                >
                  <span className="nav-link-icon d-md-none d-lg-inline-block text-center">
                    {item.icon}
                  </span>
                  <span className="nav-link-title">{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
