import React, { useState } from 'react';
import { Tabs } from '../components-new/ui';

const TabsDemoNeu: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = [
    { id: 'tab1', label: 'Tab 1', content: <div>Inhalt von Tab 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Inhalt von Tab 2</div> },
    { id: 'tab3', label: 'Tab 3', content: <div>Inhalt von Tab 3</div> },
  ];

  return (
    <div className="container-fluid">
      <h2>Tabs Demo</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h4>Standard Tabs</h4>
          <Tabs
            tabs={tabs}
            defaultActiveTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        
        <div className="col-md-6">
          <h4>Tabs mit Icons</h4>
          <Tabs
            tabs={[
              { id: 'home', label: 'Home', content: <div>Home Inhalt</div>, icon: 'home' },
              { id: 'settings', label: 'Einstellungen', content: <div>Einstellungen Inhalt</div>, icon: 'settings' },
              { id: 'user', label: 'Benutzer', content: <div>Benutzer Inhalt</div>, icon: 'user' },
            ]}
            defaultActiveTab="home"
          />
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Pill Tabs</h4>
          <Tabs
            tabs={tabs}
            variant="pills"
            defaultActiveTab="tab1"
          />
        </div>
        
        <div className="col-md-6">
          <h4>Underline Tabs</h4>
          <Tabs
            tabs={tabs}
            variant="underline"
            defaultActiveTab="tab1"
          />
        </div>
      </div>
    </div>
  );
};

export default TabsDemoNeu; 