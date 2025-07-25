import React from 'react';
import { Dropdown, Button } from '../components-new/ui';

const DropdownDemoNeu: React.FC = () => {
  const dropdownItems = [
    {
      id: 'action1',
      label: 'Aktion 1',
      onClick: () => alert('Aktion 1')
    },
    {
      id: 'action2',
      label: 'Aktion 2',
      onClick: () => alert('Aktion 2')
    },
    {
      id: 'disabled',
      label: 'Deaktiviert',
      disabled: true
    }
  ];

  return (
    <div className="d-flex gap-3">
      <Dropdown 
        trigger="Aktionen"
        items={dropdownItems}
      />
      
      <Dropdown 
        trigger={<Button variant="primary">Button Dropdown</Button>}
        items={dropdownItems}
        variant="primary"
      />
      
      <Dropdown 
        trigger="Dropdown mit Icons"
        items={[
          {
            id: 'edit',
            label: 'Bearbeiten',
            icon: 'fas fa-edit',
            onClick: () => alert('Bearbeiten')
          },
          {
            id: 'delete',
            label: 'Löschen',
            icon: 'fas fa-trash',
            onClick: () => alert('Löschen')
          },
          {
            id: 'divider',
            label: '',
            divider: true
          },
          {
            id: 'export',
            label: 'Exportieren',
            icon: 'fas fa-download',
            onClick: () => alert('Exportieren')
          }
        ]}
        variant="secondary"
      />
    </div>
  );
};

export default DropdownDemoNeu; 