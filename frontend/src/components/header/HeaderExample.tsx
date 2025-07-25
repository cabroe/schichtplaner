import React, { useState } from 'react';
import Header from './Header';

/**
 * Beispiel-Komponente für die Verwendung des Headers mit Status
 */
export const HeaderExample: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<'online' | 'offline' | 'maintenance'>('online');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return {
          content: 'Online',
          variant: 'success' as const,
          size: 'sm' as const
        };
      case 'offline':
        return {
          content: 'Offline',
          variant: 'danger' as const,
          size: 'sm' as const
        };
      case 'maintenance':
        return {
          content: 'Wartung',
          variant: 'warning' as const,
          size: 'sm' as const
        };
      default:
        return undefined;
    }
  };

  return (
    <div>
      {/* Header mit Status */}
      <Header 
        title="Dashboard" 
        status={getStatusConfig(currentStatus)}
      />
      
      {/* Beispiel-Controls */}
      <div className="container-xl mt-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Header Status Beispiel</h3>
          </div>
          <div className="card-body">
            <p>Wählen Sie einen Status aus, um ihn im Header anzuzeigen:</p>
            <div className="btn-group">
              <button 
                className={`btn ${currentStatus === 'online' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setCurrentStatus('online')}
              >
                Online
              </button>
              <button 
                className={`btn ${currentStatus === 'offline' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setCurrentStatus('offline')}
              >
                Offline
              </button>
              <button 
                className={`btn ${currentStatus === 'maintenance' ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={() => setCurrentStatus('maintenance')}
              >
                Wartung
              </button>
            </div>
            
            <div className="mt-3">
              <h4>Verwendung:</h4>
              <pre className="bg-light p-3 rounded">
{`<Header 
  title="Dashboard" 
  status={{
    content: 'Online',
    variant: 'success',
    size: 'sm'
  }}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderExample; 