import React from 'react';
import { UserDropdown } from '../components-new/ui';

const UserDropdownDemoNeu: React.FC = () => {
  const user = {
    id: '1',
    name: 'Max Mustermann',
    email: 'max@beispiel.de',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Administrator',
    isOnline: true
  };

  const dropdownItems = [
    {
      id: 'profile',
      label: 'Mein Profil',
      icon: 'fas fa-user',
      onClick: () => alert('Profil öffnen!')
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: 'fas fa-cog',
      onClick: () => alert('Einstellungen öffnen!')
    },
    {
      id: 'divider1',
      divider: true
    },
    {
      id: 'logout',
      label: 'Abmelden',
      icon: 'fas fa-sign-out-alt',
      onClick: () => alert('Abmelden!')
    }
  ];

  const user2 = {
    id: '2',
    name: 'Erika Musterfrau',
    email: 'erika@beispiel.de',
    initials: 'EM',
    color: '#28a745',
    role: 'Benutzer',
    isOnline: false
  };

  const user3 = {
    id: '3',
    name: 'Admin User',
    email: 'admin@beispiel.de',
    role: 'Systemadministrator',
    isOnline: true
  };

  return (
    <div className="container-fluid">
      <h2>UserDropdown Demo</h2>
      <div className="row">
        <div className="col-md-4">
          <h4>Standard UserDropdown</h4>
          <UserDropdown
            user={user}
            items={dropdownItems}
          />
        </div>
        <div className="col-md-4">
          <h4>Mit Initialen und Farbe</h4>
          <UserDropdown
            user={user2}
            items={dropdownItems}
            variant="primary"
          />
        </div>
        <div className="col-md-4">
          <h4>Ohne Avatar</h4>
          <UserDropdown
            user={user3}
            items={dropdownItems}
            variant="secondary"
          />
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Ohne Benutzerinfo</h4>
          <UserDropdown
            user={user}
            items={dropdownItems}
            showUserInfo={false}
            variant="light"
          />
        </div>
        <div className="col-md-6">
          <h4>Mit verschiedenen Items</h4>
          <UserDropdown
            user={user}
            items={[
              {
                id: 'dashboard',
                label: 'Dashboard',
                icon: 'fas fa-tachometer-alt',
                onClick: () => alert('Dashboard!')
              },
              {
                id: 'messages',
                label: 'Nachrichten',
                icon: 'fas fa-envelope',
                onClick: () => alert('Nachrichten!')
              },
              {
                id: 'notifications',
                label: 'Benachrichtigungen',
                icon: 'fas fa-bell',
                onClick: () => alert('Benachrichtigungen!')
              },
              {
                id: 'divider1',
                divider: true
              },
              {
                id: 'help',
                label: 'Hilfe',
                icon: 'fas fa-question-circle',
                onClick: () => alert('Hilfe!')
              },
              {
                id: 'divider2',
                divider: true
              },
              {
                id: 'logout',
                label: 'Abmelden',
                icon: 'fas fa-sign-out-alt',
                onClick: () => alert('Abmelden!')
              }
            ]}
            variant="info"
          />
        </div>
      </div>
    </div>
  );
};

export default UserDropdownDemoNeu; 