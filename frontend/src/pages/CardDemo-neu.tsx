import React, { useState } from 'react';
import { Card, Button, Badge, Avatar, ProgressBar } from '../components-new/ui';

const CardDemoNeu: React.FC = () => {
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});

  const handleToggle = (cardId: string, collapsed: boolean) => {
    setCollapsedCards(prev => ({ ...prev, [cardId]: collapsed }));
  };

  const cardTools = [
    {
      id: 'edit',
      icon: 'fas fa-edit',
      title: 'Bearbeiten',
      onClick: () => console.log('Bearbeiten geklickt')
    },
    {
      id: 'delete',
      icon: 'fas fa-trash',
      title: 'Löschen',
      onClick: () => console.log('Löschen geklickt'),
      className: 'text-danger'
    }
  ];

  const cardToolsWithDisabled = [
    {
      id: 'view',
      icon: 'fas fa-eye',
      title: 'Anzeigen',
      onClick: () => console.log('Anzeigen geklickt')
    },
    {
      id: 'edit',
      icon: 'fas fa-edit',
      title: 'Bearbeiten',
      onClick: () => console.log('Bearbeiten geklickt')
    },
    {
      id: 'disabled',
      icon: 'fas fa-lock',
      title: 'Nicht verfügbar',
      disabled: true
    }
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Card Demo - Neue Komponenten</h3>
              <div className="card-actions">
                <Badge variant="primary">7 Varianten</Badge>
              </div>
            </div>
            <div className="card-body">
              
              {/* Grundlegende Cards */}
              <div className="mb-5">
                <h4>Grundlegende Cards</h4>
                <p className="text-muted mb-3">
                  Verschiedene Card-Varianten mit unterschiedlichen Stilen
                </p>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Card title="Standard Card" subtitle="Mit Untertitel">
                      <p>Dies ist eine Standard-Card mit Titel und Untertitel. Der Inhalt kann beliebige React-Komponenten enthalten.</p>
                      <Button variant="primary" size="sm">Aktion</Button>
                    </Card>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <Card 
                      title="Card mit Tools" 
                      subtitle="Mit Aktions-Buttons"
                      tools={cardTools}
                    >
                      <p>Diese Card hat Tools im Header für zusätzliche Aktionen.</p>
                      <div className="d-flex gap-2">
                        <Badge variant="success">Aktiv</Badge>
                        <Badge variant="info">Neu</Badge>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <Card 
                      title="Collapsible Card" 
                      subtitle="Aufklappbar"
                      collapsible={true}
                      collapsed={collapsedCards['collapsible-1']}
                      onToggle={(collapsed) => handleToggle('collapsible-1', collapsed)}
                    >
                      <p>Diese Card kann ein- und ausgeklappt werden.</p>
                      <ul>
                        <li>Feature 1</li>
                        <li>Feature 2</li>
                        <li>Feature 3</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Card Varianten */}
              <div className="mb-5">
                <h4>Card Varianten</h4>
                <p className="text-muted mb-3">
                  Cards mit verschiedenen Farbvarianten
                </p>
                
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <Card title="Primary" variant="primary">
                      <p>Primary-variante mit blauem Rahmen.</p>
                    </Card>
                  </div>
                  
                  <div className="col-md-3 mb-3">
                    <Card title="Success" variant="success">
                      <p>Success-variante mit grünem Rahmen.</p>
                    </Card>
                  </div>
                  
                  <div className="col-md-3 mb-3">
                    <Card title="Warning" variant="warning">
                      <p>Warning-variante mit gelbem Rahmen.</p>
                    </Card>
                  </div>
                  
                  <div className="col-md-3 mb-3">
                    <Card title="Danger" variant="danger">
                      <p>Danger-variante mit rotem Rahmen.</p>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Card Größen */}
              <div className="mb-5">
                <h4>Card Größen</h4>
                <p className="text-muted mb-3">
                  Cards in verschiedenen Größen
                </p>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Card title="Kleine Card" size="sm">
                      <p>Kleine Card mit reduziertem Padding.</p>
                      <Button variant="outline-primary" size="sm">Kleine Aktion</Button>
                    </Card>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <Card title="Mittlere Card" size="md">
                      <p>Standard-große Card mit normalem Padding.</p>
                      <Button variant="primary" size="sm">Standard Aktion</Button>
                    </Card>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <Card title="Große Card" size="lg">
                      <p>Große Card mit erhöhtem Padding.</p>
                      <Button variant="outline-success" size="sm">Große Aktion</Button>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Komplexe Cards */}
              <div className="mb-5">
                <h4>Komplexe Cards</h4>
                <p className="text-muted mb-3">
                  Cards mit erweiterten Features und Inhalten
                </p>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Card 
                      title="Benutzer-Profil" 
                      subtitle="Max Mustermann"
                      tools={cardToolsWithDisabled}
                      footer={
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">Letzte Aktivität: vor 2 Stunden</small>
                          <Button variant="outline-primary" size="sm">Profil anzeigen</Button>
                        </div>
                      }
                    >
                      <div className="d-flex align-items-center mb-3">
                        <Avatar 
                          fallback="MM" 
                          size="lg" 
                          backgroundColor="#007bff"
                          className="me-3"
                        />
                        <div>
                          <h6 className="mb-1">Max Mustermann</h6>
                          <p className="text-muted mb-0">Softwareentwickler</p>
                          <Badge variant="success" size="sm">Online</Badge>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h6>Projekt-Fortschritt</h6>
                        <ProgressBar value={75} variant="primary" showLabel />
                      </div>
                      
                      <div className="d-flex gap-2">
                        <Badge variant="primary">React</Badge>
                        <Badge variant="secondary">TypeScript</Badge>
                        <Badge variant="info">Node.js</Badge>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <Card 
                      title="Projekt-Übersicht" 
                      subtitle="Schichtplaner v2.0"
                      variant="info"
                      collapsible={true}
                      collapsed={collapsedCards['project-card']}
                      onToggle={(collapsed) => handleToggle('project-card', collapsed)}
                      footer={
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Badge variant="warning">In Entwicklung</Badge>
                          </div>
                          <div className="text-muted">
                            <small>Deadline: 31.12.2024</small>
                          </div>
                        </div>
                      }
                    >
                      <div className="row text-center mb-3">
                        <div className="col-4">
                          <h4 className="text-primary">85%</h4>
                          <small className="text-muted">Fortschritt</small>
                        </div>
                        <div className="col-4">
                          <h4 className="text-success">12</h4>
                          <small className="text-muted">Aufgaben</small>
                        </div>
                        <div className="col-4">
                          <h4 className="text-warning">3</h4>
                          <small className="text-muted">Offen</small>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h6>Nächste Meilensteine</h6>
                        <ul className="list-unstyled">
                          <li className="mb-1">
                            <i className="fas fa-check text-success me-2"></i>
                            UI-Komponenten fertiggestellt
                          </li>
                          <li className="mb-1">
                            <i className="fas fa-clock text-warning me-2"></i>
                            API-Integration läuft
                          </li>
                          <li className="mb-1">
                            <i className="fas fa-circle text-muted me-2"></i>
                            Testing & Deployment
                          </li>
                        </ul>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Card Layouts */}
              <div className="mb-5">
                <h4>Card Layouts</h4>
                <p className="text-muted mb-3">
                  Verschiedene Layout-Optionen für Cards
                </p>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Card 
                      title="Ohne Border" 
                      bordered={false}
                      shadow={true}
                    >
                      <p>Card ohne Rahmen aber mit Schatten.</p>
                    </Card>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <Card 
                      title="Ohne Schatten" 
                      shadow={false}
                    >
                      <p>Card ohne Schatten-Effekt.</p>
                    </Card>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <Card 
                      title="Full Size" 
                      fullsize={true}
                      className="h-100"
                    >
                      <p>Card die die volle Höhe einnimmt.</p>
                      <div className="mt-auto">
                        <Button variant="primary" fullWidth>Aktion</Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Interaktive Beispiele */}
              <div className="mb-5">
                <h4>Interaktive Beispiele</h4>
                <p className="text-muted mb-3">
                  Praktische Beispiele für Card-Verwendung
                </p>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Card 
                      title="Dashboard Widget" 
                      subtitle="Echtzeit-Daten"
                      tools={[
                        {
                          id: 'refresh',
                          icon: 'fas fa-sync',
                          title: 'Aktualisieren',
                          onClick: () => console.log('Aktualisieren')
                        },
                        {
                          id: 'settings',
                          icon: 'fas fa-cog',
                          title: 'Einstellungen',
                          onClick: () => console.log('Einstellungen')
                        }
                      ]}
                    >
                      <div className="text-center">
                        <h2 className="text-primary mb-2">1,234</h2>
                        <p className="text-muted mb-3">Aktive Benutzer</p>
                        <div className="d-flex justify-content-center gap-2">
                          <Badge variant="success">+12%</Badge>
                          <small className="text-muted">vs. letzter Monat</small>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <Card 
                      title="Aktivitäts-Feed" 
                      subtitle="Letzte Aktivitäten"
                      collapsible={true}
                      collapsed={collapsedCards['activity-feed']}
                      onToggle={(collapsed) => handleToggle('activity-feed', collapsed)}
                    >
                      <div className="timeline">
                        <div className="timeline-item">
                          <div className="d-flex align-items-center mb-2">
                            <Avatar fallback="JD" size="sm" className="me-2" />
                            <div>
                              <strong>John Doe</strong> hat ein neues Projekt erstellt
                              <small className="text-muted d-block">vor 5 Minuten</small>
                            </div>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="d-flex align-items-center mb-2">
                            <Avatar fallback="JS" size="sm" className="me-2" />
                            <div>
                              <strong>Jane Smith</strong> hat eine Aufgabe abgeschlossen
                              <small className="text-muted d-block">vor 15 Minuten</small>
                            </div>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="d-flex align-items-center">
                            <Avatar fallback="MJ" size="sm" className="me-2" />
                            <div>
                              <strong>Mike Johnson</strong> hat einen Kommentar hinzugefügt
                              <small className="text-muted d-block">vor 1 Stunde</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Features Übersicht */}
              <div className="mt-5">
                <h5>Features der Card-Komponente:</h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Grundfunktionen:</h6>
                    <ul>
                      <li><strong>7 Varianten:</strong> Default, Primary, Secondary, Success, Danger, Warning, Info</li>
                      <li><strong>3 Größen:</strong> Klein (sm), Mittel (md), Groß (lg)</li>
                      <li><strong>Tools:</strong> Aktions-Buttons im Header</li>
                      <li><strong>Footer:</strong> Benutzerdefinierter Footer-Bereich</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Erweiterte Features:</h6>
                    <ul>
                      <li><strong>Collapsible:</strong> Aufklappbare Cards</li>
                      <li><strong>Layout-Optionen:</strong> Border, Shadow, Full Size</li>
                      <li><strong>Flexible Inhalte:</strong> Beliebige React-Komponenten</li>
                      <li><strong>Responsive:</strong> Automatische Anpassung</li>
                    </ul>
                  </div>
                </div>
                
                <h6 className="mt-3">Verwendung:</h6>
                <div className="bg-light p-3 rounded">
                  <pre className="mb-0">
{`<Card
  title="Card Titel"
  subtitle="Untertitel"
  variant="primary"
  size="md"
  tools={cardTools}
  footer={<div>Footer Inhalt</div>}
  collapsible={true}
  collapsed={isCollapsed}
  onToggle={(collapsed) => setIsCollapsed(collapsed)}
  bordered={true}
  shadow={true}
  fullsize={false}
>
  <p>Card Inhalt</p>
</Card>`}
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

export default CardDemoNeu; 