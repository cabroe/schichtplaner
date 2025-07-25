import React from 'react';
import { Divider } from '../components-new/ui';

const DividerDemoNeu: React.FC = () => {
  return (
    <div className="container-fluid">
      <h2>Divider Demo</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h4>Standard Divider</h4>
          <p>Text über dem Divider</p>
          <Divider />
          <p>Text unter dem Divider</p>
        </div>
        
        <div className="col-md-6">
          <h4>Divider mit verschiedenen Margins</h4>
          <p>Text über dem Divider</p>
          <Divider margin="sm" />
          <p>Text unter dem Divider</p>
          <Divider margin="lg" />
          <p>Weiterer Text</p>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Divider mit Farben</h4>
          <p>Text über dem Divider</p>
          <Divider color="#007bff" />
          <p>Text unter dem Divider</p>
          <Divider color="#28a745" />
          <p>Weiterer Text</p>
        </div>
        
        <div className="col-md-6">
          <h4>Divider mit verschiedenen Stärken</h4>
          <p>Text über dem Divider</p>
          <Divider thickness={1} />
          <p>Text unter dem Divider</p>
          <Divider thickness={3} />
          <p>Weiterer Text</p>
        </div>
      </div>
    </div>
  );
};

export default DividerDemoNeu; 