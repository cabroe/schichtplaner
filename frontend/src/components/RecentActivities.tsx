import React from "react";
import { useUiStore } from "../store/useUiStore";

const RecentActivities: React.FC = () => {
  const { open, close, isOpen } = useUiStore();

  function handleRecentActivitiesToggle() {
    if (isOpen("recentActivitiesMenu")) {
      close();
    } else {
      open("recentActivitiesMenu");
    }
  }

  return (
    <div className="nav-item d-flex me-1 recent-activities">
      <a
        className="btn btn-icon px-0"
        title="Letzte Tätigkeit neu starten"
        onClick={handleRecentActivitiesToggle}
        aria-expanded={isOpen("recentActivitiesMenu") ? "true" : "false"}
      >
        <i className="fas fa-repeat"></i>
      </a>
      {/* Beispiel: Menüanzeige */}
      {/* {isOpen("recentActivitiesMenu") && (
        <div className="dropdown-menu show">
          <span className="dropdown-item" onClick={handleRecentActivityClick}>Letzte Tätigkeit 1</span>
          <span className="dropdown-item" onClick={handleRecentActivityClick}>Letzte Tätigkeit 2</span>
        </div>
      )} */}
    </div>
  );
};

export default RecentActivities; 