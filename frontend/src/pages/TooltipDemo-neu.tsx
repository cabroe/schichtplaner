import React from 'react';
import { Button, Tooltip } from '../components-new/ui';

const TooltipDemoNeu: React.FC = () => {
  return (
    <div className="container-fluid">
      <h2>Tooltip Demo</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h4>Tooltips mit verschiedenen Positionen</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <Tooltip content="Oben" position="top">
              <Button variant="primary">Mit Tooltip</Button>
            </Tooltip>
            
            <Tooltip content="Unten" position="bottom">
              <Button variant="primary">Mit Tooltip</Button>
            </Tooltip>
            
            <Tooltip content="Links" position="left">
              <Button variant="primary">Mit Tooltip</Button>
            </Tooltip>
            
            <Tooltip content="Rechts" position="right">
              <Button variant="primary">Mit Tooltip</Button>
            </Tooltip>
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Tooltips mit verschiedenen Inhalten</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <Tooltip content="Einfacher Text">
              <Button variant="secondary">Einfach</Button>
            </Tooltip>
            
            <Tooltip content="Längerer Text mit mehr Informationen">
              <Button variant="secondary">Langer Text</Button>
            </Tooltip>
            
            <Tooltip content="HTML <strong>fett</strong> Text">
              <Button variant="secondary">HTML</Button>
            </Tooltip>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Tooltips mit verschiedenen Verzögerungen</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <Tooltip content="Schnell" delay={100}>
              <Button variant="success">Schnell</Button>
            </Tooltip>
            
            <Tooltip content="Standard" delay={200}>
              <Button variant="success">Standard</Button>
            </Tooltip>
            
            <Tooltip content="Langsam" delay={500}>
              <Button variant="success">Langsam</Button>
            </Tooltip>
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Deaktivierte Tooltips</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <Tooltip content="Dieser Tooltip ist deaktiviert" disabled>
              <Button variant="danger">Deaktiviert</Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TooltipDemoNeu; 