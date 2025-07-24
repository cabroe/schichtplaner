import { api } from './api';
import type { User, UserForm } from '../types';

class UserService {
  // Alle User abrufen (mit Pagination)
  async getUsers(page = 1, limit = 10) {
    try {
      const response = await api.getUsers(page, limit);
      return this.transformResponse(response);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error);
      throw error;
    }
  }

  // Einzelnen User abrufen
  async getUser(id: number) {
    try {
      const response = await api.getUser(id);
      return this.transformUser(response);
    } catch (error) {
      console.error('Fehler beim Laden des Benutzers:', error);
      throw error;
    }
  }

  // Neuen User erstellen
  async createUser(userData: UserForm) {
    try {
      const response = await api.createUser(userData);
      return this.transformUser(response);
    } catch (error) {
      console.error('Fehler beim Erstellen des Benutzers:', error);
      throw error;
    }
  }

  // User aktualisieren
  async updateUser(id: number, userData: Partial<UserForm>) {
    try {
      const response = await api.updateUser(id, userData);
      return this.transformUser(response);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Benutzers:', error);
      throw error;
    }
  }

  // User löschen
  async deleteUser(id: number) {
    try {
      const response = await api.deleteUser(id);
      return response;
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers:', error);
      throw error;
    }
  }

  // User nach Namen suchen (client-seitige Filterung)
  async searchUsers(query: string, page = 1, limit = 10) {
    try {
      const response = await api.getUsers(page, limit);
      const transformedResponse = this.transformResponse(response);
      
      if (transformedResponse.data && query.trim()) {
        const searchQuery = query.toLowerCase();
        transformedResponse.data = transformedResponse.data.filter((user: User) =>
          (user.name?.toLowerCase() || '').includes(searchQuery) ||
          (user.username?.toLowerCase() || '').includes(searchQuery) ||
          (user.personalnummer?.toLowerCase() || '').includes(searchQuery) ||
          (user.account_number?.toLowerCase() || '').includes(searchQuery)
        );
      }
      
      return transformedResponse;
    } catch (error) {
      console.error('Fehler bei der Benutzer-Suche:', error);
      throw error;
    }
  }

  // Aktive User abrufen (Backend-API)
  async getActiveUsers(page = 1, limit = 10) {
    try {
      const response = await api.getActiveUsers(page, limit);
      return this.transformResponse(response);
    } catch (error) {
      console.error('Fehler beim Laden der aktiven Benutzer:', error);
      throw error;
    }
  }

  // User nach Rolle filtern (client-seitig)
  async getUsersByRole(role: string, page = 1, limit = 10) {
    try {
      const response = await api.getUsers(page, limit);
      const transformedResponse = this.transformResponse(response);
      
      if (transformedResponse.data) {
        transformedResponse.data = transformedResponse.data.filter((user: User) => user.role === role);
      }
      
      return transformedResponse;
    } catch (error) {
      console.error('Fehler beim Filtern nach Rolle:', error);
      throw error;
    }
  }

  // User nach Team filtern (Backend-API)
  async getUsersByTeam(teamId: number, page = 1, limit = 10) {
    try {
      const response = await api.getUsersByTeam(teamId, page, limit);
      return this.transformResponse(response);
    } catch (error) {
      console.error('Fehler beim Laden der Team-Benutzer:', error);
      throw error;
    }
  }

  // User ohne Team (Backend-API)
  async getUsersWithoutTeam(page = 1, limit = 10) {
    try {
      const response = await api.getUsersWithoutTeam(page, limit);
      return this.transformResponse(response);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer ohne Team:', error);
      throw error;
    }
  }

  // Transformiert Backend-Response in Frontend-Format
  private transformResponse(response: any) {
    if (!response) return response;
    
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.map((user: any) => this.transformUser(user));
    }
    
    return response;
  }

  // Transformiert Backend-User in Frontend-User
  private transformUser(user: any): User {
    if (!user) return user;
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      color: user.color,
      role: user.role,
      personalnummer: user.personalnummer || '',
      account_number: user.account_number,
      is_active: user.is_active,
      is_admin: user.is_admin,
      team_id: user.team_id,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }
}

export const userService = new UserService(); 