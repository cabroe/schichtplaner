interface HeaderProps {
  pageTitle?: string;
}

export function Header({ pageTitle }: HeaderProps) {
  return (
    <header className="navbar navbar-expand-md d-none d-lg-flex d-print-none">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="navbar-nav flex-row order-md-last">
        </div>

        <div className="collapse navbar-collapse" id="navbar-menu">
          <h2 className="page-title me-2">{pageTitle}</h2>
        </div>

      </div>
    </header>
  );
}
