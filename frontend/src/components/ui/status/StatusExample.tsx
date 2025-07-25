import React from 'react';
import { Status, StatusList } from '../index';

/**
 * Beispiel-Komponente für die Verwendung der Status-Komponenten
 */
export const StatusExample: React.FC = () => {
  const statusItems = [
    { content: '1', variant: 'teal' as const },
    { content: '2', variant: 'success' as const },
    { content: '3', variant: 'warning' as const },
    { content: '4', variant: 'danger' as const },
    { content: '5', variant: 'info' as const }
  ];

  return (
    <div className="container-xl">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Status-Komponenten Beispiel</h3>
            </div>
            <div className="card-body">
              <h4>Einzelne Status-Elemente:</h4>
              <div className="mb-4">
                <Status variant="teal" className="me-2">Teal</Status>
                <Status variant="success" className="me-2">Success</Status>
                <Status variant="warning" className="me-2">Warning</Status>
                <Status variant="danger" className="me-2">Danger</Status>
                <Status variant="info" className="me-2">Info</Status>
                <Status variant="primary" className="me-2">Primary</Status>
                <Status variant="secondary" className="me-2">Secondary</Status>
              </div>

              <h4>Status-Liste (btn-list):</h4>
              <div className="mb-4">
                <StatusList items={statusItems} />
              </div>

              <h4>Verschiedene Größen:</h4>
              <div className="mb-4">
                <Status variant="teal" size="sm" className="me-2">Klein</Status>
                <Status variant="teal" size="md" className="me-2">Mittel</Status>
                <Status variant="teal" size="lg" className="me-2">Groß</Status>
              </div>

              <h4>Mit Zahlen:</h4>
              <div className="mb-4">
                <StatusList 
                  items={[
                    { content: '1', variant: 'teal' },
                    { content: '2', variant: 'success' },
                    { content: '3', variant: 'warning' },
                    { content: '4', variant: 'danger' },
                    { content: '5', variant: 'info' }
                  ]} 
                />
              </div>

              <h4>Mit Text:</h4>
              <div className="mb-4">
                <StatusList 
                  items={[
                    { content: 'Aktiv', variant: 'teal' },
                    { content: 'Erfolgreich', variant: 'success' },
                    { content: 'Warnung', variant: 'warning' },
                    { content: 'Fehler', variant: 'danger' },
                    { content: 'Info', variant: 'info' }
                  ]} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusExample; 