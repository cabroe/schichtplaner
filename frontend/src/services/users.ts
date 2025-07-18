import { api } from './api';
import type { User, UserForm } from '../types';

class UserService {
  // Alle User abrufen (mit Pagination)
  async getUsers(page = 1, limit = 10) {
    return api.getUsers(page, limit);
  }

  // Einzelnen User abrufen
  async getUser(id: number) {
    return api.getUser(id);
  }

  // Neuen User erstellen
  async createUser(userData: UserForm) {
    return api.createUser(userData);
  }

  // User aktualisieren
  async updateUser(id: number, userData: Partial<UserForm>) {
    return api.updateUser(id, userData);
  }

  // User löschen
  async deleteUser(id: number) {
    return api.deleteUser(id);
  }

  // User nach Namen suchen
  async searchUsers(query: string, page = 1, limit = 10) {
    // Hier würde eine spezielle Such-API implementiert werden
    const response = await api.getUsers(page, limit);
    // Filtere die Ergebnisse client-seitig (temporär)
    if (response.data && query.trim()) {
      const searchQuery = query.toLowerCase();
      response.data = response.data.filter((user: User) =>
        (user.firstName?.toLowerCase() || '').includes(searchQuery) ||
        (user.lastName?.toLowerCase() || '').includes(searchQuery) ||
        (user.username?.toLowerCase() || '').includes(searchQuery)
      );
    }
    // Bei leerer Suchanfrage alle User zurückgeben
    return response;
  }

  // Aktive User abrufen
  async getActiveUsers(page = 1, limit = 10) {
    const response = await api.getUsers(page, limit);
    if (response.data) {
      response.data = response.data.filter((user: User) => user.isActive);
    }
    return response;
  }

  // User nach Rolle filtern
  async getUsersByRole(role: string, page = 1, limit = 10) {
    const response = await api.getUsers(page, limit);
    if (response.data) {
      response.data = response.data.filter((user: User) => user.role === role);
    }
    return response;
  }
}

export const userService = new UserService(); 