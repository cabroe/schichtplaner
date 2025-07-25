import React from 'react';
import { Label } from '../components-new/ui';

const LabelDemoNeu: React.FC = () => {
  return (
    <div className="container-fluid">
      <h2>Label Demo</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h4>Standard Labels</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Label>Standard Label</Label>
            <Label variant="success">Erfolgreich</Label>
            <Label variant="danger">Fehler</Label>
            <Label variant="warning">Warnung</Label>
            <Label variant="info">Info</Label>
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Labels mit verschiedenen Größen</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Label size="sm">Klein</Label>
            <Label size="md">Mittel</Label>
            <Label size="lg">Groß</Label>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Labels mit Varianten</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Label variant="primary">Primär</Label>
            <Label variant="secondary">Sekundär</Label>
            <Label variant="success">Erfolgreich</Label>
            <Label variant="danger">Gefährlich</Label>
            <Label variant="warning">Warnung</Label>
            <Label variant="info">Info</Label>
            <Label variant="light">Hell</Label>
            <Label variant="dark">Dunkel</Label>
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Labels mit Pill-Format</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Label pill>Pill Label</Label>
            <Label variant="success" pill>Erfolgreich</Label>
            <Label variant="danger" pill>Fehler</Label>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Labels mit Dots</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Label dot>Mit Dot</Label>
            <Label variant="success" dot>Online</Label>
            <Label variant="danger" dot>Offline</Label>
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Klickbare Labels</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Label asButton onClick={() => alert('Label geklickt!')}>Klickbar</Label>
            <Label variant="success" asButton onClick={() => alert('Erfolgreich geklickt!')}>Erfolgreich</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelDemoNeu; 