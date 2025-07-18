import { api } from './api';
import type { User, LoginForm } from '../types';

class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'currentUser';

  // Token-Management
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // User-Management
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  removeCurrentUser(): void {
    localStorage.removeItem(this.userKey);
  }

  // Auth-Status
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // API-Operationen
  async login(credentials: LoginForm): Promise<{ token: string; user: User }> {
    const response = await api.login(credentials);
    
    this.setToken(response.token);
    this.setCurrentUser(response.user);
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await api.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.removeToken();
      this.removeCurrentUser();
    }
  }

  async refreshUser(): Promise<User> {
    const user = await api.getCurrentUser();
    this.setCurrentUser(user);
    return user;
  }

  // Permission-Checking
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return roles.includes(user?.role || '');
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isManager(): boolean {
    return this.hasRole('manager') || this.isAdmin();
  }
}

export const authService = new AuthService(); 