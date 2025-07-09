import React, { useState } from 'react';
import RemoteFormModal from '../components/RemoteFormModal';

const ModalTestPage: React.FC = () => {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [largeModalOpen, setLargeModalOpen] = useState(false);

  // Beispiel-Daten für Mitarbeiter
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    startDate: ''
  });

  // Beispiel-Daten für Schicht
  const [shiftData, setShiftData] = useState({
    employee: '',
    date: '',
    startTime: '',
    endTime: '',
    break: ''
  });

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mitarbeiter gespeichert:', employeeData);
    setEmployeeModalOpen(false);
    // Hier würde normalerweise die API aufgerufen
  };

  const handleShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Schicht gespeichert:', shiftData);
    setShiftModalOpen(false);
    // Hier würde normalerweise die API aufgerufen
  };

  const handleDelete = () => {
    console.log('Element gelöscht');
    setConfirmModalOpen(false);
    // Hier würde normalerweise die Löschung durchgeführt
  };

  // Basic Modal Footer
  const basicModalFooter = (
    <>
      <button 
        type="button" 
        className="btn btn-secondary" 
        onClick={() => setBasicModalOpen(false)}
      >
        Schließen
      </button>
    </>
  );

  // Employee Modal Footer
  const employeeModalFooter = (
    <>
      <button 
        type="button" 
        className="btn btn-secondary" 
        onClick={() => setEmployeeModalOpen(false)}
      >
        Abbrechen
      </button>
      <button 
        type="submit" 
        className="btn btn-primary"
        form="employee-form"
      >
        Mitarbeiter speichern
      </button>
    </>
  );

  // Shift Modal Footer
  const shiftModalFooter = (
    <>
      <button 
        type="button" 
        className="btn btn-secondary" 
        onClick={() => setShiftModalOpen(false)}
      >
        Abbrechen
      </button>
      <button 
        type="submit" 
        className="btn btn-success"
        form="shift-form"
      >
        Schicht erstellen
      </button>
    </>
  );

  // Confirm Modal Footer
  const confirmModalFooter = (
    <>
      <button 
        type="button" 
        className="btn btn-secondary" 
        onClick={() => setConfirmModalOpen(false)}
      >
        Abbrechen
      </button>
      <button 
        type="button" 
        className="btn btn-danger"
        onClick={handleDelete}
      >
        Löschen
      </button>
    </>
  );

  // Large Modal Footer
  const largeModalFooter = (
    <>
      <button 
        type="button" 
        className="btn btn-secondary" 
        onClick={() => setLargeModalOpen(false)}
      >
        Schließen
      </button>
      <button 
        type="button" 
        className="btn btn-primary"
        onClick={() => setLargeModalOpen(false)}
      >
        Verstanden
      </button>
    </>
  );

  return (
    <div className="row row-deck row-cards">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Modal Test-Seite</h3>
            {/* <p className="text-muted">
              Verschiedene Anwendungsfälle für die RemoteFormModal-Komponente
            </p> */}
          </div>
          <div className="card-body">
            <div className="row g-3">
              
              {/* Basic Modal */}
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <h4>Einfaches Modal</h4>
                    <p className="text-muted">Grundlegendes Modal ohne Formular</p>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setBasicModalOpen(true)}
                    >
                      Einfaches Modal öffnen
                    </button>
                  </div>
                </div>
              </div>

              {/* Employee Modal */}
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <h4>Mitarbeiter-Modal</h4>
                    <p className="text-muted">Formular für Mitarbeiterverwaltung</p>
                    <button 
                      className="btn btn-success" 
                      onClick={() => setEmployeeModalOpen(true)}
                    >
                      Mitarbeiter hinzufügen
                    </button>
                  </div>
                </div>
              </div>

              {/* Shift Modal */}
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <h4>Schicht-Modal</h4>
                    <p className="text-muted">Formular für Schichtplanung</p>
                    <button 
                      className="btn btn-info" 
                      onClick={() => setShiftModalOpen(true)}
                    >
                      Schicht erstellen
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Modal */}
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <h4>Bestätigungs-Modal</h4>
                    <p className="text-muted">Modal für Bestätigungen</p>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => setConfirmModalOpen(true)}
                    >
                      Element löschen
                    </button>
                  </div>
                </div>
              </div>

              {/* Large Modal */}
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <h4>Großes Modal</h4>
                    <p className="text-muted">Modal mit viel Inhalt</p>
                    <button 
                      className="btn btn-warning" 
                      onClick={() => setLargeModalOpen(true)}
                    >
                      Großes Modal öffnen
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Basic Modal */}
      <RemoteFormModal
        title="Einfaches Modal"
        isOpen={basicModalOpen}
        onClose={() => setBasicModalOpen(false)}
        footer={basicModalFooter}
        size="lg"
      >
        <div className="alert alert-info">
          <h4>Willkommen!</h4>
          <p>Dies ist ein einfaches Modal ohne Formular. Es dient nur zur Anzeige von Informationen.</p>
        </div>
      </RemoteFormModal>

      {/* Employee Modal */}
      <RemoteFormModal
        title="Mitarbeiter hinzufügen"
        isOpen={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        footer={employeeModalFooter}
        size="lg"
      >
        <form id="employee-form" onSubmit={handleEmployeeSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={employeeData.name}
                  onChange={(e) => setEmployeeData({...employeeData, name: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">E-Mail *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={employeeData.email}
                  onChange={(e) => setEmployeeData({...employeeData, email: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Telefon</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  value={employeeData.phone}
                  onChange={(e) => setEmployeeData({...employeeData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Position</label>
                <select 
                  className="form-select" 
                  value={employeeData.position}
                  onChange={(e) => setEmployeeData({...employeeData, position: e.target.value})}
                >
                  <option value="">Position auswählen</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Mitarbeiter</option>
                  <option value="intern">Praktikant</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Startdatum</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={employeeData.startDate}
                  onChange={(e) => setEmployeeData({...employeeData, startDate: e.target.value})}
                />
              </div>
            </div>
          </div>
        </form>
      </RemoteFormModal>

      {/* Shift Modal */}
      <RemoteFormModal
        title="Neue Schicht erstellen"
        isOpen={shiftModalOpen}
        onClose={() => setShiftModalOpen(false)}
        footer={shiftModalFooter}
        size="lg"
      >
        <form id="shift-form" onSubmit={handleShiftSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Mitarbeiter *</label>
                <select 
                  className="form-select" 
                  value={shiftData.employee}
                  onChange={(e) => setShiftData({...shiftData, employee: e.target.value})}
                  required
                >
                  <option value="">Mitarbeiter auswählen</option>
                  <option value="john">John Doe</option>
                  <option value="jane">Jane Smith</option>
                  <option value="bob">Bob Johnson</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Datum *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={shiftData.date}
                  onChange={(e) => setShiftData({...shiftData, date: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Startzeit *</label>
                <input 
                  type="time" 
                  className="form-control" 
                  value={shiftData.startTime}
                  onChange={(e) => setShiftData({...shiftData, startTime: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Endzeit *</label>
                <input 
                  type="time" 
                  className="form-control" 
                  value={shiftData.endTime}
                  onChange={(e) => setShiftData({...shiftData, endTime: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Pause (Minuten)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={shiftData.break}
                  onChange={(e) => setShiftData({...shiftData, break: e.target.value})}
                  min="0"
                  max="120"
                />
              </div>
            </div>
          </div>
        </form>
      </RemoteFormModal>

      {/* Confirm Modal */}
      <RemoteFormModal
        title="Bestätigung erforderlich"
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        footer={confirmModalFooter}
        size="sm"
      >
        <div className="alert alert-warning">
          <h4>Achtung!</h4>
          <p>Sind Sie sicher, dass Sie dieses Element löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        </div>
      </RemoteFormModal>

      {/* Large Modal */}
      <RemoteFormModal
        title="Detaillierte Informationen"
        isOpen={largeModalOpen}
        onClose={() => setLargeModalOpen(false)}
        footer={largeModalFooter}
        size="xl"
      >
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info">
              <h4>Schichtplaner - Systemübersicht</h4>
              <p>Hier finden Sie detaillierte Informationen über das Schichtplanungs-System.</p>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Backend-Features</h3>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li>✓ Go 1.24.4 - Moderne, performante Sprache</li>
                  <li>✓ Echo v4 - Leichtgewichtiges Web Framework</li>
                  <li>✓ Validator - Request-Validierung</li>
                  <li>✓ In-Memory Storage - Schnelle Datenhaltung</li>
                  <li>✓ Environment-Config - Sichere Konfiguration</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Frontend-Features</h3>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li>✓ React 18 - Moderne UI-Bibliothek</li>
                  <li>✓ TypeScript - Type-Safe Development</li>
                  <li>✓ Vite - Schneller Build-Prozess</li>
                  <li>✓ Tabler UI - Responsive Design</li>
                  <li>✓ Hot Reload - Echtzeit-Entwicklung</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mt-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Hauptfunktionen</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Funktion</th>
                        <th>Beschreibung</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Mitarbeiterverwaltung</td>
                        <td>CRUD-Operationen für Mitarbeiter mit Validierung</td>
                        <td><span className="badge bg-success">Aktiv</span></td>
                      </tr>
                      <tr>
                        <td>Schichtplanung</td>
                        <td>Vollständige Schichtverwaltung mit Zeiterfassung</td>
                        <td><span className="badge bg-success">Aktiv</span></td>
                      </tr>
                      <tr>
                        <td>Berichtswesen</td>
                        <td>Automatische Report-Generierung und CSV-Export</td>
                        <td><span className="badge bg-warning">In Entwicklung</span></td>
                      </tr>
                      <tr>
                        <td>REST API</td>
                        <td>Vollständige RESTful API mit Echo Framework</td>
                        <td><span className="badge bg-success">Aktiv</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RemoteFormModal>
    </div>
  );
};

export default ModalTestPage;