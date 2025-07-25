import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/users';
import type { User, UserForm } from '../types';
import { DataTable, Modal, Toast } from '../components';
import { useUiStore } from '../store/useUiStore';
import { Form, FormGroup, Input, Select, Checkbox, ColorDropdown } from '../components/forms';
import { useStatus } from '../contexts/StatusContext';

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification, open, close } = useUiStore();
  const { setStatus } = useStatus();
  
  // State für Benutzer-Daten
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Formular-State
  const [formData, setFormData] = useState<UserForm>({
    username: '',
    email: '',
    name: '',
    color: '#206bc4',
    role: 'user',
    personalnummer: '',
    account_number: '',
    password: '',
    is_active: true,
    is_admin: false
  });

  // Status aktualisieren, wenn sich die Anzahl der Benutzer ändert
  useEffect(() => {
    
    setStatus({
      content: `${users.length}`,
      variant: users.length > 0 ? 'success' : 'secondary',
      size: undefined
    });

    // Cleanup beim Verlassen der Komponente
    return () => {
      setStatus(null);
    };
  }, [users, setStatus]);

  // Prüfe Admin-Berechtigung
  if (currentUser?.role !== 'admin') {
    return (
      <div className="container-xl">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="text-danger">Zugriff verweigert</h3>
                <p className="text-muted">
                  Sie haben keine Berechtigung, auf die Benutzer-Verwaltung zuzugreifen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Benutzer laden (echte API)
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(1, 100); // Lade alle Benutzer
      if (response?.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error);
      addNotification({
        type: 'error',
        message: 'Fehler beim Laden der Benutzer'
      });
    } finally {
      setLoading(false);
    }
  };

  // Benutzer suchen
  const handleSearch = async () => {
    try {
      const response = await userService.searchUsers(searchQuery, 1, 100);
      if (response?.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Fehler bei der Suche:', error);
    }
  };

  // Modal öffnen für neuen Benutzer
  const handleCreateUser = () => {
    setFormData({
      username: '',
      email: '',
      name: '',
      color: '#206bc4',
      role: 'user',
      personalnummer: '',
      account_number: '',
      password: '',
      is_active: true,
      is_admin: false
    });
    setIsEditMode(false);
    open('remoteModal');
  };

  // Modal öffnen für Bearbeitung
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      name: user.name,
      color: user.color,
      role: user.role,
      personalnummer: user.personalnummer || '',
      account_number: user.account_number,
      password: '',
      is_active: user.is_active,
      is_admin: user.is_admin
    });
    setIsEditMode(true);
    open('remoteModal');
  };

  // Benutzer löschen
  const handleDeleteUser = async (user: User) => {
    if (user.id === Number(currentUser?.id)) {
      addNotification({
        type: 'error',
        message: 'Sie können sich nicht selbst löschen'
      });
      return;
    }

    if (window.confirm(`Möchten Sie den Benutzer "${user.name}" wirklich löschen?`)) {
      try {
        setLoading(true);
        await userService.deleteUser(user.id);
        setToastMessage('Benutzer erfolgreich gelöscht');
        setShowToast(true);
        loadUsers(); // Lade die Liste neu
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Fehler beim Löschen des Benutzers'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Formular speichern
  const handleSaveUser = async (data: Record<string, any>) => {
    try {
      setLoading(true);
      
      if (isEditMode && selectedUser) {
        await userService.updateUser(selectedUser.id, data as UserForm);
        setToastMessage('Benutzer erfolgreich aktualisiert');
      } else {
        await userService.createUser(data as UserForm);
        setToastMessage('Benutzer erfolgreich erstellt');
      }
      setShowToast(true);
      close();
      loadUsers(); // Lade die Liste neu
    } catch (error) {
      addNotification({
        type: 'error',
        message: isEditMode ? 'Fehler beim Aktualisieren des Benutzers' : 'Fehler beim Erstellen des Benutzers'
      });
    } finally {
      setLoading(false);
    }
  };

  // Benutzer beim Laden der Komponente laden
  useEffect(() => {
    loadUsers();
  }, []);

  // Gefilterte Benutzer anzeigen
  const displayUsers = searchQuery.trim() 
    ? users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  // Optionen für Rollen
  const roleOptions = [
    { value: 'user', label: 'Benutzer' },
    { value: 'employee', label: 'Mitarbeiter' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Administrator' }
  ];

  // Optionen für Farben
  const colorOptions = [
    { value: '#206bc4', label: 'Blau' },
    { value: '#4299e1', label: 'Hellblau' },
    { value: '#2d3748', label: 'Grau' },
    { value: '#48bb78', label: 'Grün' },
    { value: '#ed8936', label: 'Orange' },
    { value: '#e53e3e', label: 'Rot' },
    { value: '#9f7aea', label: 'Lila' },
    { value: '#f6ad55', label: 'Gelb' },
    { value: '#38b2ac', label: 'Türkis' },
    { value: '#f56565', label: 'Pink' }
  ];

  return (
    <div className="container-xl">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Benutzer-Verwaltung</h3>
              <div className="card-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={handleCreateUser}
                  disabled={loading}
                >
                  <i className="fas fa-plus me-2"></i>
                  Neuer Benutzer
                </button>
              </div>
            </div>
            <div className="card-body">
              {/* Suchleiste */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Benutzer suchen..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={handleSearch}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading-Indikator */}
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Laden...</span>
                  </div>
                </div>
              )}

              {/* Benutzer-Tabelle */}
              {!loading && (
                <DataTable responsive striped bordered>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Benutzername</th>
                      <th>E-Mail</th>
                      <th>Rolle</th>
                      <th>Status</th>
                      <th>Erstellt</th>
                      <th>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <span 
                              className="avatar avatar-sm me-2" 
                              style={{ backgroundColor: user.color }}
                            >
                              {user.name.substring(0, 2).toUpperCase()}
                            </span>
                            {user.name}
                          </div>
                        </td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge bg-${user.role === 'admin' ? 'danger' : user.role === 'manager' ? 'warning' : 'info'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${user.is_active ? 'success' : 'secondary'}`}>
                            {user.is_active ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </td>
                        <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('de-DE') : '-'}</td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditUser(user)}
                              title="Bearbeiten"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(user)}
                              disabled={user.id === Number(currentUser?.id)}
                              title="Löschen"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              )}

              {/* Leere Tabelle */}
              {!loading && displayUsers.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">Keine Benutzer gefunden</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Benutzer-Modal */}
      <Modal
        title={isEditMode ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}
        onClose={() => close()}
      >
        <Form 
          onSubmit={handleSaveUser}
          loading={loading}
          initialValues={formData}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <FormGroup 
                label="Benutzername" 
                htmlFor="username" 
                required
                helpText="Eindeutiger Benutzername für die Anmeldung"
              >
                <Input
                  type="text"
                  name="username"
                  placeholder="max.mustermann"
                  required
                  minLength={3}
                  maxLength={50}
                  title="Benutzername muss zwischen 3 und 50 Zeichen lang sein"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup 
                label="E-Mail" 
                htmlFor="email" 
                required
              >
                <Input
                  type="email"
                  name="email"
                  placeholder="max@example.com"
                  required
                  title="Bitte geben Sie eine gültige E-Mail-Adresse ein"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup 
                label="Name" 
                htmlFor="name" 
                required
                helpText="Vollständiger Name des Benutzers"
              >
                <Input
                  type="text"
                  name="name"
                  placeholder="Max Mustermann"
                  required
                  minLength={2}
                  maxLength={100}
                  title="Name muss zwischen 2 und 100 Zeichen lang sein"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup 
                label="Farbe" 
                htmlFor="color"
                helpText="Farbe für die Benutzer-Avatar-Anzeige"
              >
                <ColorDropdown
                  name="color"
                  value={formData.color}
                  onChange={(color) => setFormData(prev => ({ ...prev, color }))}
                  options={colorOptions}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup 
                label="Rolle" 
                htmlFor="role" 
                required
              >
                <Select
                  name="role"
                  options={roleOptions}
                  required
                  title="Bitte wählen Sie eine Rolle aus"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup 
                label="Personalnummer" 
                htmlFor="personalnummer"
                helpText="Optionale Personalnummer"
              >
                <Input
                  type="text"
                  name="personalnummer"
                  placeholder="12345"
                  maxLength={20}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup 
                label="Kontonummer" 
                htmlFor="account_number" 
                required
                helpText="Eindeutige Kontonummer für das System"
              >
                <Input
                  type="text"
                  name="account_number"
                  placeholder="ACC001"
                  required
                  minLength={3}
                  maxLength={20}
                  title="Kontonummer muss zwischen 3 und 20 Zeichen lang sein"
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup 
                label={isEditMode ? 'Neues Passwort' : 'Passwort'} 
                htmlFor="password" 
                required={!isEditMode}
                helpText={isEditMode ? 'Leer lassen für keine Änderung' : 'Mindestens 8 Zeichen'}
              >
                <Input
                  type="password"
                  name="password"
                  required={!isEditMode}
                  minLength={8}
                  title={isEditMode ? 'Leer lassen oder mindestens 8 Zeichen' : 'Passwort muss mindestens 8 Zeichen lang sein'}
                />
              </FormGroup>
            </div>
            <div className="col-12">
              <FormGroup>
                <Checkbox
                  name="is_active"
                  label="Benutzer ist aktiv"
                  title="Aktive Benutzer können sich anmelden"
                />
              </FormGroup>
            </div>
            <div className="col-12">
              <FormGroup>
                <Checkbox
                  name="is_admin"
                  label="Administrator-Rechte"
                  title="Administratoren haben vollen Systemzugriff"
                />
              </FormGroup>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Toast-Benachrichtigung */}
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default UserManagement; 