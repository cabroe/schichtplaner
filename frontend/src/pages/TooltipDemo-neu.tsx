import React from 'react';
import { Tooltip, Button } from '../components-new/ui';

const TooltipDemoNeu: React.FC = () => (
  <div className="container-fluid">
    <h2>Tooltip Demo</h2>
    <Tooltip content="Tooltip-Text">
      <Button color="primary">Mit Tooltip</Button>
    </Tooltip>
    <Tooltip content="Oben" placement="top">
      <span className="ms-3">Oben</span>
    </Tooltip>
    <Tooltip content="Unten" placement="bottom">
      <span className="ms-3">Unten</span>
    </Tooltip>
  </div>
);

export default TooltipDemoNeu; 