interface HeaderProps {
  title?: string;
  userName?: string;
  userInitials?: string;
  avatarColor?: string;
}

export function Header({ 
  title = "Meine Zeiten", 
  userName = "Carsten Bröckert", 
  userInitials = "CB",
  avatarColor = "rgb(240, 18, 190)"
}: HeaderProps) {
  return (
    <header role="navigation" className="d-none d-lg-flex d-print-none navbar navbar-expand-md navbar-light bg-dark">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbar-menu-desktop">
          <h2 className="page-title me-2 mb-0">{title}</h2>
        </div>
        <div className="flex-row ms-auto align-items-center navbar-nav">
          <div className="nav-item dropdown nav-item">
            <a
              id="user-menu-dropdown"
              aria-expanded="false"
              aria-label="Open personal menu"
              role="button"
              className="d-flex lh-1 text-reset p-0 dropdown-toggle nav-link"
              tabIndex={0}
              href="#"
            >
              <span className="avatar avatar-sm me-1">
                <span 
                  className="avatar" 
                  title={userName}
                  style={{ 
                    backgroundColor: avatarColor, 
                    color: "rgb(255, 255, 255)" 
                  }}
                >
                  {userInitials}
                </span>
              </span>
              <div className="d-none d-xl-block ps-2">
                <div>{userName}</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
