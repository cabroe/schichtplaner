import React from 'react';

const FormDemoHeader: React.FC = () => {
  return (
    <div className="page-header d-print-none">
      <div className="container-xl">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">
              Form Demo
            </h2>
            <div className="text-muted mt-1">
              Demonstration aller verfügbaren Form-Komponenten
            </div>
          </div>
          <div className="col-auto ms-auto d-print-none">
            <div className="btn-list">
              <span className="d-none d-sm-inline">
                <a href="#" className="btn btn-white">
                  <i className="fas fa-download me-2"></i>
                  Dokumentation
                </a>
              </span>
              <a href="#" className="btn btn-primary d-none d-sm-inline-block">
                <i className="fas fa-plus me-2"></i>
                Neues Formular
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDemoHeader; 