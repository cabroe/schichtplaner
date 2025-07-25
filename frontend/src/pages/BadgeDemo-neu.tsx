import React from 'react';
import { Badge, Card, Button } from '../components-new/ui';

const BadgeDemoNeu: React.FC = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Badge Demo - Neue Komponenten</h3>
              <div className="card-toolbar">
                <Badge variant="primary">Neue Features</Badge>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <Card title="Badge Varianten">
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Badge variant="primary">Primary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="danger">Danger</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="info">Info</Badge>
                      <Badge variant="light">Light</Badge>
                      <Badge variant="dark">Dark</Badge>
                    </div>
                    
                    <h5>Outline Varianten</h5>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Badge variant="primary" outline>Primary</Badge>
                      <Badge variant="secondary" outline>Secondary</Badge>
                      <Badge variant="success" outline>Success</Badge>
                      <Badge variant="danger" outline>Danger</Badge>
                      <Badge variant="warning" outline>Warning</Badge>
                      <Badge variant="info" outline>Info</Badge>
                      <Badge variant="light" outline>Light</Badge>
                      <Badge variant="dark" outline>Dark</Badge>
                    </div>
                  </Card>
                </div>

                <div className="col-md-6">
                  <Card title="Badge Größen">
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Badge variant="primary" size="sm">Klein</Badge>
                      <Badge variant="primary" size="md">Mittel</Badge>
                      <Badge variant="primary" size="lg">Groß</Badge>
                    </div>
                    
                    <h5>Mit Icons</h5>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Badge variant="success">
                        <i className="fas fa-check me-1"></i>Erfolgreich
                      </Badge>
                      <Badge variant="danger">
                        <i className="fas fa-exclamation-triangle me-1"></i>Warnung
                      </Badge>
                      <Badge variant="info">
                        <i className="fas fa-info-circle me-1"></i>Information
                      </Badge>
                      <Badge variant="warning">
                        <i className="fas fa-clock me-1"></i>Wartend
                      </Badge>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md-6">
                  <Card title="Badge in Buttons">
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Button variant="primary">
                        Benachrichtigungen <Badge variant="light" className="ms-2">4</Badge>
                      </Button>
                      <Button variant="secondary">
                        Nachrichten <Badge variant="danger" className="ms-2">12</Badge>
                      </Button>
                      <Button variant="success">
                        Aufgaben <Badge variant="light" className="ms-2">8</Badge>
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="col-md-6">
                  <Card title="Badge in Navigation">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                        <span>Dashboard</span>
                        <Badge variant="primary">Neu</Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                        <span>Benutzer</span>
                        <Badge variant="success">Online</Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                        <span>Einstellungen</span>
                        <Badge variant="warning">Aktualisierung</Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                        <span>Hilfe</span>
                        <Badge variant="info">3</Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <Card title="Badge mit Custom Styling">
                    <div className="d-flex flex-wrap gap-2">
                      <Badge 
                        variant="primary" 
                        className="custom-badge"
                        style={{ 
                          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          color: 'white'
                        }}
                      >
                        Gradient
                      </Badge>
                      <Badge 
                        variant="success" 
                        className="custom-badge"
                        style={{ 
                          borderRadius: '20px',
                          padding: '8px 16px'
                        }}
                      >
                        Rounded
                      </Badge>
                      <Badge 
                        variant="warning" 
                        className="custom-badge"
                        style={{ 
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                          transform: 'rotate(-2deg)'
                        }}
                      >
                        Shadow
                      </Badge>
                      <Badge 
                        variant="danger" 
                        className="custom-badge animated-badge"
                        style={{ 
                          animation: 'pulse 2s infinite'
                        }}
                      >
                        Animated
                      </Badge>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          .animated-badge {
            animation: pulse 2s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default BadgeDemoNeu; 