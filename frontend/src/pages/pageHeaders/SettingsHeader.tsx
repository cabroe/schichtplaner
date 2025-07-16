import { useUiStore } from "../../store/useUiStore";
import { Link } from "react-router-dom";

const SettingsHeader = () => {
  const { open, close, isOpen } = useUiStore();
  function handleDropdownToggle(e: React.MouseEvent) {
    e.preventDefault();
    if (isOpen("settingsDropdown")) {
      close();
    } else {
      open("settingsDropdown");
    }
  }
  return (
    <>
      <div className="col">
        <div className="text-body-secondary mt-1">
          <div className="page-pretitle">Benutzerprofil</div>
        </div>
        <h2 className="page-title">Einstellungen</h2>
      </div>
      <div className="col-auto ms-auto d-print-none">
        <div className="page-actions">
          {/* Desktop: Einstellungs-Button */}
          <div className="pa-desktop d-none d-sm-inline-flex btn-list">
            <Link className="btn btn-primary action-settings" to="/einstellungen" onClick={close}>
              <i className="fas fa-cog me-1"></i>
              Einstellungen
            </Link>
          </div>
          {/* Mobile: Dropdown-Menü */}
          <div className="pa-mobile d-inline-flex d-sm-none btn-list">
            <div className="dropdown">
              <a
                href="#"
                className={"link-secondary btn-dark btn btn-icon" + (isOpen("settingsDropdown") ? " show" : "")}
                data-bs-toggle="dropdown"
                aria-label="Actions"
                aria-expanded={isOpen("settingsDropdown") ? "true" : "false"}
                onClick={handleDropdownToggle}
              >
                <i className="fas fa-ellipsis-h"></i>
              </a>
              <div className={"dropdown-menu dropdown-menu-end" + (isOpen("settingsDropdown") ? " show" : "") }>
                <Link className="dropdown-item" to="/einstellungen" onClick={close}>Einstellungen</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsHeader; 