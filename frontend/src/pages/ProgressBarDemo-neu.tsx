import React, { useState } from 'react';
import { ProgressBar, Button } from '../components-new/ui';

const ProgressBarDemoNeu: React.FC = () => {
  const [progress, setProgress] = useState(40);
  return (
    <div className="container-fluid">
      <h2>ProgressBar Demo</h2>
      <ProgressBar value={progress} max={100} />
      <div className="mt-3 d-flex gap-2">
        <Button onClick={() => setProgress(p => Math.max(0, p - 10))}>-10%</Button>
        <Button onClick={() => setProgress(p => Math.min(100, p + 10))}>+10%</Button>
      </div>
    </div>
  );
};

export default ProgressBarDemoNeu; 