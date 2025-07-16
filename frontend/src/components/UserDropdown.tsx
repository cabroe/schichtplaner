import React from "react";
import { Link } from "react-router-dom";
import { useUiStore } from "../store/useUiStore";
import { userMenuItems } from "../routes/routeConfig";

const UserDropdown: React.FC = () => {
  const { open, close, isOpen } = useUiStore();

  function handleDropdownToggle(e: React.MouseEvent) {
    e.preventDefault();
    if (isOpen("userDropdown")) {
      close();
    } else {
      open("userDropdown");
    }
  }

  function handleDropdownClose() {
    close();
  }

  return (
    <div className="nav-item dropdown">
      <a
        href="#"
        className="nav-link d-flex lh-1 text-reset p-0"
        data-bs-toggle="dropdown"
        aria-label="Open personal menu"
        aria-expanded={isOpen("userDropdown") ? "true" : "false"}
        onClick={handleDropdownToggle}
      >
        <span className="avatar avatar-sm">
          <span className="avatar" style={{ backgroundColor: "#E91E63", color: "#fff" }} title="admin">AD</span>
        </span>
        <div className="d-none d-xl-block ps-2">
          <div>admin</div>
        </div>
      </a>
      <div className={"dropdown-menu dropdown-menu-end dropdown-menu-arrow" + (isOpen("userDropdown") ? " show" : "") }>
        {userMenuItems.map((item, idx) =>
          item.divider ? (
            <div className="dropdown-divider" key={"divider-" + idx} />
          ) : (
            <Link to={item.to!} className="dropdown-item" onClick={handleDropdownClose} key={item.title}>
              {item.title}
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default UserDropdown; 