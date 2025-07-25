import React from 'react';
import { Icon } from '../components-new/ui';

const IconDemoNeu: React.FC = () => {
  return (
    <div className="container-fluid">
      <h2>Icon Demo</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h4>Standard Icons</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <Icon name="user" />
            <Icon name="settings" />
            <Icon name="check" color="green" />
            <Icon name="times" color="red" />
            <Icon name="star" color="gold" size="lg" />
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Icons mit verschiedenen Größen</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <Icon name="home" size="xs" />
            <Icon name="home" size="sm" />
            <Icon name="home" size="md" />
            <Icon name="home" size="lg" />
            <Icon name="home" size="xl" />
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Icons mit Animationen</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <Icon name="sync" spin />
            <Icon name="spinner" spin />
            <Icon name="check" color="green" />
          </div>
        </div>
        
        <div className="col-md-6">
          <h4>Klickbare Icons</h4>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <Icon name="edit" onClick={() => alert('Bearbeiten geklickt!')} />
            <Icon name="delete" color="red" onClick={() => alert('Löschen geklickt!')} />
            <Icon name="download" onClick={() => alert('Download geklickt!')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconDemoNeu; 