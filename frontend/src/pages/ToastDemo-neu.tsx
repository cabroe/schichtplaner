import React from 'react';
import { Toast, Button } from '../components-new/ui';

const ToastDemoNeu: React.FC = () => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="container-fluid">
      <h2>Toast Demo</h2>
      <Button onClick={() => setShow(true)}>Toast anzeigen</Button>
      <Toast open={show} onClose={() => setShow(false)} message="Dies ist ein Toast!" />
    </div>
  );
};

export default ToastDemoNeu; 