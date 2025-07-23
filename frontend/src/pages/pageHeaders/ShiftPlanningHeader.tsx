import React from 'react';

const ShiftPlanningHeader: React.FC = () => {
  return (
    <div className="page-header d-print-none">
      <div className="container-xl">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">
              Schichtplanung
            </h2>
            <div className="text-muted mt-1">
              Planen Sie Schichten für Ihre Mitarbeiter
            </div>
          </div>
          <div className="col-auto ms-auto d-print-none">
            <div className="btn-list">
              <button className="btn btn-primary">
                <i className="fas fa-save me-1"></i>
                Plan speichern
              </button>
              <button className="btn btn-outline-secondary">
                <i className="fas fa-download me-1"></i>
                Exportieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftPlanningHeader; 