import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/users';
import type { User, UserForm, UserRole } from '../types';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useUiStore } from '../store/useUiStore';

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification, open, close } = useUiStore();
  
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
  const handleSaveUser = async () => {
    try {
      setLoading(true);
      
      if (isEditMode && selectedUser) {
        await userService.updateUser(selectedUser.id, formData);
        setToastMessage('Benutzer erfolgreich aktualisiert');
      } else {
        await userService.createUser(formData);
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

  // Formular-Input-Handler
  const handleInputChange = (field: keyof UserForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Benutzername *</label>
            <input
              type="text"
              className="form-control"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">E-Mail *</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Farbe</label>
            <input
              type="color"
              className="form-control form-control-color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Rolle *</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
              required
            >
              <option value="user">Benutzer</option>
              <option value="employee">Mitarbeiter</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Personalnummer</label>
            <input
              type="text"
              className="form-control"
              value={formData.personalnummer}
              onChange={(e) => handleInputChange('personalnummer', e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Kontonummer *</label>
            <input
              type="text"
              className="form-control"
              value={formData.account_number}
              onChange={(e) => handleInputChange('account_number', e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              {isEditMode ? 'Neues Passwort (leer lassen für keine Änderung)' : 'Passwort *'}
            </label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required={!isEditMode}
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="is_active">
                Benutzer ist aktiv
              </label>
            </div>
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="is_admin"
                checked={formData.is_admin}
                onChange={(e) => handleInputChange('is_admin', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="is_admin">
                Administrator-Rechte
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => close()}
          >
            Abbrechen
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveUser}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Speichern...
              </>
            ) : (
              'Speichern'
            )}
          </button>
        </div>
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