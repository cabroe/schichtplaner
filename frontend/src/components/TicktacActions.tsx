import React from "react";
import { useUiStore } from "../store/useUiStore";

const TicktacActions: React.FC = () => {
  const { close, isOpen } = useUiStore();

  function handleTicktacStart() {
    // Hier ggf. Start-Logik einfügen
    close();
  }
  function handleTicktacStop() {
    // Hier ggf. Stop-Logik einfügen
    close();
  }

  return (
    <div className="nav-item d-flex me-1 ticktac">
      <div className="btn-list">
        {/* Stoppen (ausgeblendet, nur als Beispiel) */}
        <div className="ticktac-menu" style={{ display: isOpen("ticktacMenu") ? "block" : "none" }}>
          <a title="Zeiterfassung stoppen" className="btn btn-dark btn-icon px-sm-2" onClick={handleTicktacStop}>
            <i className="fas fa-stop-circle text-danger me-1"></i>
            <span className="d-none d-sm-block">0:00</span>
          </a>
        </div>
        {/* Starten */}
        <div className="ticktac-menu-empty" style={{ display: isOpen("ticktacMenu") ? "none" : "block" }}>
          <a title="Zeiterfassung starten" className="btn btn-dark btn-icon px-sm-2" onClick={handleTicktacStart}>
            <i className="fas fa-play text-success me-1"></i>
            <span className="d-none d-sm-block">0:00</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TicktacActions; 