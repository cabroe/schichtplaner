import React from 'react';
import { LoadingSpinner } from '../components-new/ui';

const LoadingSpinnerDemoNeu: React.FC = () => {
  return (
    <div className="container-fluid">
      <h2>LoadingSpinner Demo</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h4>Standard Spinner</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <LoadingSpinner />
            <LoadingSpinner variant="secondary" />
            <LoadingSpinner variant="success" />
            <LoadingSpinner variant="danger" />
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Spinner mit verschiedenen Größen</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Spinner mit Text</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <LoadingSpinner text="Lädt..." />
            <LoadingSpinner variant="success" text="Speichern..." />
            <LoadingSpinner variant="danger" text="Fehler beim Laden" />
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Fullscreen Spinner</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <LoadingSpinner fullScreen text="Lade Anwendung..." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinnerDemoNeu; 