import React from 'react';
import { Timeline } from '../components-new/ui';

const timelineItems = [
  { 
    id: '1', 
    title: 'Projektstart', 
    description: 'Das Projekt wurde erfolgreich gestartet', 
    date: '2024-01-01',
    status: 'completed' as const
  },
  { 
    id: '2', 
    title: 'Meilenstein 1', 
    description: 'Erster wichtiger Meilenstein erreicht', 
    date: '2024-02-15',
    status: 'completed' as const
  },
  { 
    id: '3', 
    title: 'Entwicklung läuft', 
    description: 'Aktive Entwicklungsphase', 
    date: '2024-03-01',
    status: 'active' as const
  },
  { 
    id: '4', 
    title: 'Testing', 
    description: 'Umfassende Tests werden durchgeführt', 
    date: '2024-03-15',
    status: 'pending' as const
  },
  { 
    id: '5', 
    title: 'Projektabschluss', 
    description: 'Projekt wird erfolgreich abgeschlossen', 
    date: '2024-03-30',
    status: 'pending' as const
  },
];

const TimelineDemoNeu: React.FC = () => (
  <div className="container-fluid">
    <h2>Timeline Demo</h2>
    <div className="row">
      <div className="col-md-6">
        <h4>Standard Timeline</h4>
        <Timeline items={timelineItems} />
      </div>
      <div className="col-md-6">
        <h4>Timeline ohne Connectors</h4>
        <Timeline items={timelineItems} showConnectors={false} />
      </div>
    </div>
    <div className="row mt-4">
      <div className="col-md-6">
        <h4>Timeline mit Custom Icons</h4>
        <Timeline 
          items={[
            { 
              id: '1', 
              title: 'Benutzer registriert', 
              description: 'Neuer Benutzer hat sich angemeldet', 
              date: '2024-01-01',
              icon: 'user',
              color: '#28a745'
            },
            { 
              id: '2', 
              title: 'E-Mail bestätigt', 
              description: 'E-Mail-Adresse wurde bestätigt', 
              date: '2024-01-02',
              icon: 'envelope',
              color: '#007bff'
            },
            { 
              id: '3', 
              title: 'Profil vervollständigt', 
              description: 'Benutzerprofil wurde vollständig ausgefüllt', 
              date: '2024-01-03',
              icon: 'check-circle',
              color: '#ffc107'
            }
          ]} 
        />
      </div>
      <div className="col-md-6">
        <h4>Timeline mit verschiedenen Status</h4>
        <Timeline 
          items={[
            { 
              id: '1', 
              title: 'Aufgabe erstellt', 
              description: 'Neue Aufgabe wurde erstellt', 
              status: 'completed' as const
            },
            { 
              id: '2', 
              title: 'In Bearbeitung', 
              description: 'Aufgabe wird bearbeitet', 
              status: 'active' as const
            },
            { 
              id: '3', 
              title: 'Fehler aufgetreten', 
              description: 'Ein Fehler ist aufgetreten', 
              status: 'error' as const
            },
            { 
              id: '4', 
              title: 'Wartend', 
              description: 'Aufgabe wartet auf Freigabe', 
              status: 'pending' as const
            }
          ]} 
        />
      </div>
    </div>
  </div>
);

export default TimelineDemoNeu; 