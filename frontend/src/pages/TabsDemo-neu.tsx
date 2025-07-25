import React, { useState } from 'react';
import { Tabs } from '../components-new/ui';

const TabsDemoNeu: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  return (
    <div className="container-fluid">
      <h2>Tabs Demo</h2>
      <Tabs
        tabs={[
          { id: 'tab1', label: 'Tab 1', content: <div>Inhalt Tab 1</div> },
          { id: 'tab2', label: 'Tab 2', content: <div>Inhalt Tab 2</div> },
          { id: 'tab3', label: 'Tab 3', content: <div>Inhalt Tab 3</div> },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default TabsDemoNeu; 