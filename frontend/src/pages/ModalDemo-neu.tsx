import React, { useState } from 'react';
import { Button, Modal } from '../components-new/ui';

const ModalDemoNeu: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="container-fluid">
      <h2>Modal Demo</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h4>Standard Modal</h4>
          <Button variant="primary" onClick={() => setOpen(true)}>Modal öffnen</Button>
          <Modal isOpen={open} onClose={() => setOpen(false)} title="Demo Modal">
            <p>Dies ist ein Beispiel-Modal mit einigen Inhalten.</p>
            <Button variant="secondary" onClick={() => setOpen(false)}>Schließen</Button>
          </Modal>
        </div>
        
        <div className="col-md-6">
          <h4>Modal mit verschiedenen Größen</h4>
          <div className="d-flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={() => setOpen(true)}>Kleines Modal</Button>
            <Button variant="primary" onClick={() => setOpen(true)}>Mittleres Modal</Button>
            <Button variant="primary" size="lg" onClick={() => setOpen(true)}>Großes Modal</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDemoNeu; 