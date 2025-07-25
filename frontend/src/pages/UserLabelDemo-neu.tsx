import React from 'react';
import { UserLabel } from '../components-new/ui';

const UserLabelDemoNeu: React.FC = () => {
  const user1 = {
    id: '1',
    displayName: 'Max Mustermann',
    enabled: true,
    color: '#007bff'
  };

  const user2 = {
    id: '2',
    displayName: 'Erika Musterfrau',
    enabled: true,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'EM'
  };

  const user3 = {
    id: '3',
    displayName: 'Deaktivierter Benutzer',
    enabled: false,
    color: '#dc3545'
  };

  const user4 = {
    id: '4',
    displayName: 'Admin User',
    enabled: true,
    initials: 'AU',
    color: '#28a745'
  };

  return (
    <div className="container-fluid">
      <h2>UserLabel Demo</h2>
      <div className="row">
        <div className="col-md-6">
          <h4>Standard UserLabels</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <UserLabel user={user1} />
            <UserLabel user={user2} />
            <UserLabel user={user3} />
            <UserLabel user={user4} />
          </div>
        </div>
        <div className="col-md-6">
          <h4>Mit Avatar</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <UserLabel user={user1} showAvatar={true} />
            <UserLabel user={user2} showAvatar={true} />
            <UserLabel user={user3} showAvatar={true} />
            <UserLabel user={user4} showAvatar={true} />
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Verschiedene Größen</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <UserLabel user={user1} size="sm" />
            <UserLabel user={user1} size="md" />
            <UserLabel user={user1} size="lg" />
          </div>
        </div>
        <div className="col-md-6">
          <h4>Ohne Status</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <UserLabel user={user1} showStatus={false} />
            <UserLabel user={user2} showStatus={false} />
            <UserLabel user={user3} showStatus={false} />
            <UserLabel user={user4} showStatus={false} />
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Als Button</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <UserLabel 
              user={user1} 
              asButton={true} 
              onClick={() => alert('Max Mustermann geklickt!')}
            />
            <UserLabel 
              user={user2} 
              asButton={true} 
              onClick={() => alert('Erika Musterfrau geklickt!')}
            />
          </div>
        </div>
        <div className="col-md-6">
          <h4>Mit Custom Tooltip</h4>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <UserLabel 
              user={user1} 
              tooltip="Klicken Sie für Details"
            />
            <UserLabel 
              user={user2} 
              tooltip="E-Mail: erika@beispiel.de"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLabelDemoNeu; 