import React from 'react';
import { Button, Badge } from '../components-new/ui';

const ButtonDemoNeu: React.FC = () => {
  return (
    <div className="container-fluid">
      <h2>Button Demo</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h4>Button Varianten</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="info">Info</Button>
            <Button variant="light">Light</Button>
            <Button variant="dark">Dark</Button>
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Outline Buttons</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="outline-primary">Primary</Button>
            <Button variant="outline-secondary">Secondary</Button>
            <Button variant="outline-success">Success</Button>
            <Button variant="outline-danger">Danger</Button>
            <Button variant="outline-warning">Warning</Button>
            <Button variant="outline-info">Info</Button>
            <Button variant="outline-light">Light</Button>
            <Button variant="outline-dark">Dark</Button>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Button Größen</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="primary" size="sm">Klein</Button>
            <Button variant="primary" size="md">Mittel</Button>
            <Button variant="primary" size="lg">Groß</Button>
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Buttons mit Icons</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="primary" icon={<i className="fas fa-save"></i>}>Speichern</Button>
            <Button variant="success" icon={<i className="fas fa-check"></i>} iconPosition="right">Bestätigen</Button>
            <Button variant="danger" icon={<i className="fas fa-trash"></i>}>Löschen</Button>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Loading Buttons</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="primary" loading>Lädt...</Button>
            <Button variant="success" loading>Speichern...</Button>
            <Button variant="danger" loading>Löschen...</Button>
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Disabled Buttons</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="primary" disabled>Deaktiviert</Button>
            <Button variant="success" disabled>Deaktiviert</Button>
            <Button variant="danger" disabled>Deaktiviert</Button>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Full Width Buttons</h4>
          <div className="d-flex flex-column gap-2 mb-3">
            <Button variant="primary" fullWidth>Vollbreite Button</Button>
            <Button variant="secondary" fullWidth>Vollbreite Button</Button>
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Buttons mit Badges</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button variant="primary">
              Benachrichtigungen
              <Badge variant="light" className="ms-2">3</Badge>
            </Button>
            <Button variant="success">
              Aufgaben
              <Badge variant="light" className="ms-2">5</Badge>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemoNeu; 