import React, { useState } from 'react';
import { Button, Badge, Card, LoadingSpinner } from '../components-new/ui';

const ButtonDemoNeu: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleClick = (buttonId: string) => {
    console.log(`Button ${buttonId} wurde geklickt`);
  };

  const handleLoadingClick = (buttonId: string) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
    
    // Simuliere asynchrone Operation
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Button Demo - Neue Komponenten</h3>
              <div className="card-actions">
                <Badge variant="primary">22 Varianten</Badge>
              </div>
            </div>
            <div className="card-body">
              
              {/* Grundlegende Varianten */}
              <div className="mb-5">
                <h4>Grundlegende Varianten</h4>
                <p className="text-muted mb-3">
                  Verschiedene Button-Varianten mit unterschiedlichen Farben
                </p>
                
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Button variant="primary" onClick={() => handleClick('primary')}>
                    Primary
                  </Button>
                  <Button variant="secondary" onClick={() => handleClick('secondary')}>
                    Secondary
                  </Button>
                  <Button variant="success" onClick={() => handleClick('success')}>
                    Success
                  </Button>
                  <Button variant="danger" onClick={() => handleClick('danger')}>
                    Danger
                  </Button>
                  <Button variant="warning" onClick={() => handleClick('warning')}>
                    Warning
                  </Button>
                  <Button variant="info" onClick={() => handleClick('info')}>
                    Info
                  </Button>
                  <Button variant="light" onClick={() => handleClick('light')}>
                    Light
                  </Button>
                  <Button variant="dark" onClick={() => handleClick('dark')}>
                    Dark
                  </Button>
                </div>
              </div>

              {/* Outline Varianten */}
              <div className="mb-5">
                <h4>Outline Varianten</h4>
                <p className="text-muted mb-3">
                  Buttons mit Outline-Style für subtilere Darstellung
                </p>
                
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Button variant="outline-primary" onClick={() => handleClick('outline-primary')}>
                    Outline Primary
                  </Button>
                  <Button variant="outline-secondary" onClick={() => handleClick('outline-secondary')}>
                    Outline Secondary
                  </Button>
                  <Button variant="outline-success" onClick={() => handleClick('outline-success')}>
                    Outline Success
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleClick('outline-danger')}>
                    Outline Danger
                  </Button>
                  <Button variant="outline-warning" onClick={() => handleClick('outline-warning')}>
                    Outline Warning
                  </Button>
                  <Button variant="outline-info" onClick={() => handleClick('outline-info')}>
                    Outline Info
                  </Button>
                  <Button variant="outline-light" onClick={() => handleClick('outline-light')}>
                    Outline Light
                  </Button>
                  <Button variant="outline-dark" onClick={() => handleClick('outline-dark')}>
                    Outline Dark
                  </Button>
                </div>
              </div>

              {/* Verschiedene Größen */}
              <div className="mb-5">
                <h4>Verschiedene Größen</h4>
                <p className="text-muted mb-3">
                  Buttons in verschiedenen Größen
                </p>
                
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  <Button variant="primary" size="sm" onClick={() => handleClick('small')}>
                    Klein (sm)
                  </Button>
                  <Button variant="primary" size="md" onClick={() => handleClick('medium')}>
                    Mittel (md)
                  </Button>
                  <Button variant="primary" size="lg" onClick={() => handleClick('large')}>
                    Groß (lg)
                  </Button>
                </div>
              </div>

              {/* Icons und Loading States */}
              <div className="mb-5">
                <h4>Icons und Loading States</h4>
                <p className="text-muted mb-3">
                  Buttons mit Icons und Loading-Zuständen
                </p>
                
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Button 
                    variant="primary" 
                    icon={<i className="fas fa-save" />}
                    onClick={() => handleClick('save')}
                  >
                    Speichern
                  </Button>
                  
                  <Button 
                    variant="success" 
                    icon={<i className="fas fa-download" />}
                    iconPosition="right"
                    onClick={() => handleClick('download')}
                  >
                    Herunterladen
                  </Button>
                  
                  <Button 
                    variant="warning" 
                    icon={<i className="fas fa-edit" />}
                    onClick={() => handleClick('edit')}
                  >
                    Bearbeiten
                  </Button>
                  
                  <Button 
                    variant="danger" 
                    icon={<i className="fas fa-trash" />}
                    onClick={() => handleClick('delete')}
                  >
                    Löschen
                  </Button>
                  
                  <Button 
                    variant="info" 
                    loading={loadingStates['loading-1']}
                    onClick={() => handleLoadingClick('loading-1')}
                  >
                    {loadingStates['loading-1'] ? 'Lädt...' : 'Asynchron laden'}
                  </Button>
                  
                  <Button 
                    variant="outline-primary" 
                    loading={loadingStates['loading-2']}
                    disabled={loadingStates['loading-2']}
                    onClick={() => handleLoadingClick('loading-2')}
                  >
                    {loadingStates['loading-2'] ? 'Verarbeitung...' : 'Verarbeiten'}
                  </Button>
                </div>
              </div>

              {/* Disabled States */}
              <div className="mb-5">
                <h4>Deaktivierte Buttons</h4>
                <p className="text-muted mb-3">
                  Buttons in deaktiviertem Zustand
                </p>
                
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Button variant="primary" disabled onClick={() => handleClick('disabled-primary')}>
                    Deaktiviert Primary
                  </Button>
                  <Button variant="outline-primary" disabled onClick={() => handleClick('disabled-outline')}>
                    Deaktiviert Outline
                  </Button>
                  <Button variant="success" disabled icon={<i className="fas fa-check" />}>
                    Deaktiviert mit Icon
                  </Button>
                </div>
              </div>

              {/* Full Width Buttons */}
              <div className="mb-5">
                <h4>Full Width Buttons</h4>
                <p className="text-muted mb-3">
                  Buttons, die die volle Breite einnehmen
                </p>
                
                <div className="row">
                  <div className="col-md-6">
                    <Button 
                      variant="primary" 
                      fullWidth 
                      onClick={() => handleClick('full-width-primary')}
                    >
                      Full Width Primary
                    </Button>
                  </div>
                  <div className="col-md-6">
                    <Button 
                      variant="outline-secondary" 
                      fullWidth 
                      onClick={() => handleClick('full-width-outline')}
                    >
                      Full Width Outline
                    </Button>
                  </div>
                </div>
              </div>

              {/* Button Groups */}
              <div className="mb-5">
                <h4>Button Groups</h4>
                <p className="text-muted mb-3">
                  Gruppierte Buttons für verwandte Aktionen
                </p>
                
                <div className="d-flex flex-wrap gap-3 mb-3">
                  <div className="btn-group" role="group">
                    <Button variant="outline-primary" size="sm" onClick={() => handleClick('group-left')}>
                      <i className="fas fa-chevron-left" />
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={() => handleClick('group-center')}>
                      Aktuelle Seite
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={() => handleClick('group-right')}>
                      <i className="fas fa-chevron-right" />
                    </Button>
                  </div>
                  
                  <div className="btn-group" role="group">
                    <Button variant="outline-success" size="sm" onClick={() => handleClick('view')}>
                      <i className="fas fa-eye" />
                    </Button>
                    <Button variant="outline-warning" size="sm" onClick={() => handleClick('edit')}>
                      <i className="fas fa-edit" />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleClick('delete')}>
                      <i className="fas fa-trash" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Interaktive Beispiele */}
              <div className="mb-5">
                <h4>Interaktive Beispiele</h4>
                <p className="text-muted mb-3">
                  Praktische Beispiele für Button-Verwendung
                </p>
                
                <div className="row">
                  <div className="col-md-6">
                    <Card title="Formular-Aktionen" className="mb-3">
                      <div className="d-flex gap-2">
                        <Button variant="primary" onClick={() => handleClick('submit')}>
                          <i className="fas fa-save me-1" />
                          Speichern
                        </Button>
                        <Button variant="outline-secondary" onClick={() => handleClick('cancel')}>
                          Abbrechen
                        </Button>
                        <Button variant="outline-danger" onClick={() => handleClick('reset')}>
                          <i className="fas fa-undo me-1" />
                          Zurücksetzen
                        </Button>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="col-md-6">
                    <Card title="Datei-Aktionen" className="mb-3">
                      <div className="d-flex gap-2">
                        <Button variant="success" size="sm" onClick={() => handleClick('upload')}>
                          <i className="fas fa-upload me-1" />
                          Hochladen
                        </Button>
                        <Button variant="info" size="sm" onClick={() => handleClick('preview')}>
                          <i className="fas fa-eye me-1" />
                          Vorschau
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => handleClick('share')}>
                          <i className="fas fa-share me-1" />
                          Teilen
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Features Übersicht */}
              <div className="mt-5">
                <h5>Features der Button-Komponente:</h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Grundfunktionen:</h6>
                    <ul>
                      <li><strong>16 Varianten:</strong> Primary, Secondary, Success, Danger, Warning, Info, Light, Dark + Outline-Varianten</li>
                      <li><strong>3 Größen:</strong> Klein (sm), Mittel (md), Groß (lg)</li>
                      <li><strong>Icons:</strong> Links, rechts oder ohne Icon</li>
                      <li><strong>Loading States:</strong> Integrierte Lade-Zustände</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Erweiterte Features:</h6>
                    <ul>
                      <li><strong>Disabled States:</strong> Deaktivierte Buttons</li>
                      <li><strong>Full Width:</strong> Volle Breite Option</li>
                      <li><strong>Event Handling:</strong> Click-Handler mit Event-Parameter</li>
                      <li><strong>Accessibility:</strong> ARIA-Support und Keyboard-Navigation</li>
                    </ul>
                  </div>
                </div>
                
                <h6 className="mt-3">Verwendung:</h6>
                <div className="bg-light p-3 rounded">
                  <pre className="mb-0">
{`<Button
  variant="primary"
  size="md"
  loading={isLoading}
  icon={<i className="fas fa-save" />}
  onClick={(event) => {
    console.log('Button clicked', event);
  }}
>
  Speichern
</Button>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemoNeu; 