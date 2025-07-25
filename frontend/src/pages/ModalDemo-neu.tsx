import React, { useState } from 'react';
import { Modal, Button } from '../components-new/ui';

const ModalDemoNeu: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="container-fluid">
      <h2>Modal Demo</h2>
      <Button color="primary" onClick={() => setOpen(true)}>Modal öffnen</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Demo Modal">
        <p>Dies ist ein Beispiel für ein Modal.</p>
        <Button color="secondary" onClick={() => setOpen(false)}>Schließen</Button>
      </Modal>
    </div>
  );
};

export default ModalDemoNeu; 