import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <>
      <h1 className="navbar-brand navbar-brand-autodark">
        <Link to="/">Schichtplaner</Link>
      </h1>
      <div className="navbar-nav flex-row order-md-last">
        <div className="nav-item">
          <Link to="/" className="nav-link">
            <span className="nav-link-title">Home</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/about" className="nav-link">
            <span className="nav-link-title">About</span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navigation
