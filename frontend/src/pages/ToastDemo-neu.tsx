import React, { useState } from 'react';
import { Button, Toast } from '../components-new/ui';

const ToastDemoNeu: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="container-fluid">
      <h2>Toast Demo</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h4>Standard Toast</h4>
          <Button variant="primary" onClick={() => setShow(true)}>Toast anzeigen</Button>
          <Toast show={show} onClose={() => setShow(false)} message="Dies ist ein Toast!" />
        </div>
        
        <div className="col-md-6">
          <h4>Toast mit verschiedenen Typen</h4>
          <div className="d-flex flex-wrap gap-2">
            <Button variant="success" onClick={() => setShow(true)}>Erfolg Toast</Button>
            <Button variant="danger" onClick={() => setShow(true)}>Fehler Toast</Button>
            <Button variant="warning" onClick={() => setShow(true)}>Warnung Toast</Button>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Toast mit Titel</h4>
          <Button variant="info" onClick={() => setShow(true)}>Toast mit Titel</Button>
          <Toast 
            show={show} 
            onClose={() => setShow(false)} 
            title="Benachrichtigung"
            message="Dies ist ein Toast mit einem Titel!" 
          />
        </div>
        
        <div className="col-md-6">
          <h4>Persistenter Toast</h4>
          <Button variant="secondary" onClick={() => setShow(true)}>Persistenter Toast</Button>
          <Toast 
            show={show} 
            onClose={() => setShow(false)} 
            message="Dieser Toast schließt sich nicht automatisch!" 
            persistent={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ToastDemoNeu; 