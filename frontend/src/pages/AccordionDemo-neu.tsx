import React, { useState } from 'react';
import { Button, Badge } from '../components-new/ui';

const AccordionDemoNeu: React.FC = () => {
  const [activeItems, setActiveItems] = useState<string[]>(['item-1']);

  const toggleItem = (itemId: string) => {
    setActiveItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="container-fluid">
      <h2>Accordion Demo</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h4>Standard Accordion</h4>
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${!activeItems.includes('item-1') ? 'collapsed' : ''}`}
                  onClick={() => toggleItem('item-1')}
                >
                  Accordion Item #1
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${activeItems.includes('item-1') ? 'show' : ''}`}>
                <div className="accordion-body">
                  <strong>Dies ist der erste Accordion-Inhalt.</strong> Es wird standardmäßig angezeigt, da es mit der <code>.show</code> Klasse initialisiert wird.
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${!activeItems.includes('item-2') ? 'collapsed' : ''}`}
                  onClick={() => toggleItem('item-2')}
                >
                  Accordion Item #2
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${activeItems.includes('item-2') ? 'show' : ''}`}>
                <div className="accordion-body">
                  <strong>Dies ist der zweite Accordion-Inhalt.</strong> Es ist versteckt, bis der Accordion-Header geklickt wird.
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${!activeItems.includes('item-3') ? 'collapsed' : ''}`}
                  onClick={() => toggleItem('item-3')}
                >
                  Accordion Item #3
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${activeItems.includes('item-3') ? 'show' : ''}`}>
                <div className="accordion-body">
                  <strong>Dies ist der dritte Accordion-Inhalt.</strong> Es ist versteckt, bis der Accordion-Header geklickt wird.
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Accordion mit Badges</h4>
          <div className="accordion" id="accordionWithBadges">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${!activeItems.includes('badge-1') ? 'collapsed' : ''}`}
                  onClick={() => toggleItem('badge-1')}
                >
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span>Neue Nachrichten</span>
                    <Badge variant="danger">3</Badge>
                  </div>
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${activeItems.includes('badge-1') ? 'show' : ''}`}>
                <div className="accordion-body">
                  Sie haben 3 neue Nachrichten erhalten.
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button 
                  className={`accordion-button ${!activeItems.includes('badge-2') ? 'collapsed' : ''}`}
                  onClick={() => toggleItem('badge-2')}
                >
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span>Aufgaben</span>
                    <Badge variant="success">Erledigt</Badge>
                  </div>
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${activeItems.includes('badge-2') ? 'show' : ''}`}>
                <div className="accordion-body">
                  Alle Aufgaben sind erledigt.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <h4>Accordion Steuerung</h4>
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={() => setActiveItems(['item-1', 'item-2', 'item-3'])}>
              Alle öffnen
            </Button>
            <Button variant="secondary" onClick={() => setActiveItems([])}>
              Alle schließen
            </Button>
            <Button variant="info" onClick={() => setActiveItems(['item-1'])}>
              Nur ersten öffnen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionDemoNeu; 