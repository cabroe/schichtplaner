import React, { useState } from 'react';
import { Accordion } from '../components-new/ui';
import { Card, Button, Badge } from '../components-new/ui';

const AccordionDemoNeu: React.FC = () => {
  const [activeItems, setActiveItems] = useState<string[]>(['item-1']);

  const handleItemToggle = (itemId: string, isOpen: boolean) => {
    console.log(`Accordion Item ${itemId} wurde ${isOpen ? 'geöffnet' : 'geschlossen'}`);
  };

  const accordionItems = [
    {
      id: 'item-1',
      title: 'Grundlegende Informationen',
      content: (
        <div>
          <p>Dies ist ein Beispiel für den Inhalt eines Accordion-Elements. Hier können beliebige React-Komponenten und HTML-Elemente verwendet werden.</p>
          <div className="d-flex gap-2 mt-3">
            <Badge variant="primary">Info</Badge>
            <Badge variant="success">Neu</Badge>
            <Badge variant="warning">Wichtig</Badge>
          </div>
        </div>
      ),
      icon: 'info',
      defaultOpen: true
    },
    {
      id: 'item-2',
      title: 'Erweiterte Einstellungen',
      content: (
        <div>
          <h6>Konfigurationsoptionen</h6>
          <ul>
            <li>Responsive Design</li>
            <li>Keyboard Navigation</li>
            <li>Accessibility Support</li>
            <li>Custom Styling</li>
          </ul>
          <div className="mt-3">
            <Button variant="outline-primary" size="sm">
              <i className="fas fa-cog me-1"></i>
              Einstellungen öffnen
            </Button>
          </div>
        </div>
      ),
      icon: 'settings'
    },
    {
      id: 'item-3',
      title: 'Statistiken und Daten',
      content: (
        <div>
          <div className="row">
            <div className="col-md-4">
              <div className="text-center p-3 border rounded">
                <h4 className="text-primary">1,234</h4>
                <small className="text-muted">Besucher heute</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-3 border rounded">
                <h4 className="text-success">567</h4>
                <small className="text-muted">Neue Benutzer</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-3 border rounded">
                <h4 className="text-warning">89%</h4>
                <small className="text-muted">Zufriedenheit</small>
              </div>
            </div>
          </div>
        </div>
      ),
      icon: 'chart'
    },
    {
      id: 'item-4',
      title: 'Deaktiviertes Element',
      content: <p>Dieser Inhalt ist nicht verfügbar.</p>,
      icon: 'lock',
      disabled: true
    }
  ];

  const multipleAccordionItems = [
    {
      id: 'multi-1',
      title: 'Erstes Element',
      content: <p>Inhalt des ersten Elements.</p>,
      icon: 'star'
    },
    {
      id: 'multi-2',
      title: 'Zweites Element',
      content: <p>Inhalt des zweiten Elements.</p>,
      icon: 'heart'
    },
    {
      id: 'multi-3',
      title: 'Drittes Element',
      content: <p>Inhalt des dritten Elements.</p>,
      icon: 'bookmark'
    }
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Accordion Demo - Neue Komponenten</h3>
              <div className="card-actions">
                <Badge variant="primary">
                  {activeItems.length} Elemente geöffnet
                </Badge>
              </div>
            </div>
            <div className="card-body">
              
              {/* Standard Accordion */}
              <div className="mb-5">
                <h4>Standard Accordion</h4>
                <p className="text-muted mb-3">
                  Einfaches Accordion mit einem geöffneten Element
                </p>
                
                <Accordion
                  items={accordionItems}
                  variant="default"
                  size="md"
                  onItemToggle={handleItemToggle}
                />
              </div>

              {/* Bordered Accordion */}
              <div className="mb-5">
                <h4>Bordered Accordion</h4>
                <p className="text-muted mb-3">
                  Accordion mit Rahmen und Hervorhebung des aktiven Elements
                </p>
                
                <Accordion
                  items={accordionItems}
                  variant="bordered"
                  size="md"
                  onItemToggle={handleItemToggle}
                />
              </div>

              {/* Flush Accordion */}
              <div className="mb-5">
                <h4>Flush Accordion</h4>
                <p className="text-muted mb-3">
                  Accordion ohne Rahmen und Abstände
                </p>
                
                <Accordion
                  items={accordionItems}
                  variant="flush"
                  size="md"
                  onItemToggle={handleItemToggle}
                />
              </div>

              {/* Multiple Selection Accordion */}
              <div className="mb-5">
                <h4>Multiple Selection</h4>
                <p className="text-muted mb-3">
                  Mehrere Elemente können gleichzeitig geöffnet werden
                </p>
                
                <Accordion
                  items={multipleAccordionItems}
                  variant="default"
                  size="md"
                  allowMultiple={true}
                  onItemToggle={handleItemToggle}
                />
              </div>

              {/* Verschiedene Größen */}
              <div className="mb-5">
                <h4>Verschiedene Größen</h4>
                <p className="text-muted mb-3">
                  Accordion in verschiedenen Größen
                </p>
                
                <div className="row">
                  <div className="col-md-4">
                    <h6>Klein (sm)</h6>
                    <Accordion
                      items={accordionItems.slice(0, 2)}
                      variant="default"
                      size="sm"
                    />
                  </div>
                  <div className="col-md-4">
                    <h6>Mittel (md)</h6>
                    <Accordion
                      items={accordionItems.slice(0, 2)}
                      variant="default"
                      size="md"
                    />
                  </div>
                  <div className="col-md-4">
                    <h6>Groß (lg)</h6>
                    <Accordion
                      items={accordionItems.slice(0, 2)}
                      variant="default"
                      size="lg"
                    />
                  </div>
                </div>
              </div>

              {/* Features Übersicht */}
              <div className="mt-5">
                <h5>Features der Accordion-Komponente:</h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Grundfunktionen:</h6>
                    <ul>
                      <li><strong>Verschiedene Varianten:</strong> Default, Bordered, Flush</li>
                      <li><strong>Größen:</strong> Klein (sm), Mittel (md), Groß (lg)</li>
                      <li><strong>Icons:</strong> Unterstützung für Tabler Icons</li>
                      <li><strong>Deaktivierte Elemente:</strong> Nicht klickbare Items</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Erweiterte Features:</h6>
                    <ul>
                      <li><strong>Multiple Selection:</strong> Mehrere Elemente gleichzeitig öffnen</li>
                      <li><strong>Event Handling:</strong> Callbacks für Öffnen/Schließen</li>
                      <li><strong>Default Open:</strong> Standardmäßig geöffnete Elemente</li>
                      <li><strong>Accessibility:</strong> Keyboard-Navigation und ARIA-Support</li>
                    </ul>
                  </div>
                </div>
                
                <h6 className="mt-3">Verwendung:</h6>
                <div className="bg-light p-3 rounded">
                  <pre className="mb-0">
{`<Accordion
  items={accordionItems}
  variant="default"
  size="md"
  allowMultiple={false}
  onItemToggle={(itemId, isOpen) => {
    console.log(\`Item \${itemId} is \${isOpen ? 'open' : 'closed'}\`);
  }}
/>`}
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

export default AccordionDemoNeu; 