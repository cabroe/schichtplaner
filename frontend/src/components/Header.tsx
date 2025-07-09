import { useLocation } from "react-router-dom";
import { sidebarMenuItems } from "../data/sidebarMenuItems";

export function Header() {
  const location = useLocation();
  
  const getPageTitle = (pathname: string): string => {
    const findTitle = (items: typeof sidebarMenuItems): string => {
      for (const item of items) {
        if (item.path === pathname) {
          return item.title;
        }
        if (item.children) {
          const childTitle = findTitle(item.children);
          if (childTitle !== 'Schichtplaner') {
            return childTitle;
          }
        }
      }
      return 'Schichtplaner';
    };
    
    return findTitle(sidebarMenuItems);
  };
  
  return (
    <header className="navbar navbar-expand-md d-none d-lg-flex d-print-none">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="navbar-nav flex-row order-md-last">
        </div>

        <div className="collapse navbar-collapse" id="navbar-menu">
          <h2 className="page-title me-2">{getPageTitle(location.pathname)}</h2>
        </div>

      </div>
    </header>
  );
}
