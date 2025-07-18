// Basis-API-Konfiguration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// HTTP-Client mit Interceptors und Caching
class ApiClient {
  private baseURL: string;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 Minuten

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}${params ? JSON.stringify(params) : ''}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  clearCache(): void {
    this.cache.clear();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Auth-Token hinzufügen
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Network error'
      );
    }
  }

  // GET Request
  async get<T>(endpoint: string, useCache = true): Promise<T> {
    if (useCache) {
      const cacheKey = this.getCacheKey(endpoint);
      const cached = this.cache.get(cacheKey);
      
      if (cached && this.isCacheValid(cached.timestamp)) {
        return cached.data;
      }
    }
    
    const result = await this.request<T>(endpoint, { method: 'GET' });
    
    if (useCache) {
      const cacheKey = this.getCacheKey(endpoint);
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
    }
    
    return result;
  }

  // POST Request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const result = await this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    
    // Cache invalidieren bei POST-Requests
    this.clearCache();
    
    return result;
  }

  // PUT Request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const result = await this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    
    // Cache invalidieren bei PUT-Requests
    this.clearCache();
    
    return result;
  }

  // PATCH Request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const result = await this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
    
    // Cache invalidieren bei PATCH-Requests
    this.clearCache();
    
    return result;
  }

  // DELETE Request
  async delete<T>(endpoint: string): Promise<T> {
    const result = await this.request<T>(endpoint, { method: 'DELETE' });
    
    // Cache invalidieren bei DELETE-Requests
    this.clearCache();
    
    return result;
  }

  // Paginierte GET Request
  async getPaginated(
    endpoint: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return this.get<any>(`${endpoint}?${params}`);
  }
}

// API-Client-Instanz
export const apiClient = new ApiClient(API_BASE_URL);

// Utility-Funktionen für häufige API-Operationen
export const api = {
  // Auth
  login: (credentials: { username: string; password: string }) =>
    apiClient.post<{ token: string; user: any }>('/auth/login', credentials),
  
  logout: () => apiClient.post('/auth/logout'),
  
  getCurrentUser: () => apiClient.get<any>('/auth/me'),

  // Users
  getUsers: (page?: number, limit?: number) =>
    apiClient.getPaginated('/users', page, limit),
  
  getUser: (id: number) => apiClient.get(`/users/${id}`),
  
  createUser: (userData: any) => apiClient.post('/users', userData),
  
  updateUser: (id: number, userData: any) =>
    apiClient.put(`/users/${id}`, userData),
  
  deleteUser: (id: number) => apiClient.delete(`/users/${id}`),

  // Schedules
  getSchedules: (page?: number, limit?: number) =>
    apiClient.getPaginated('/schedules', page, limit),
  
  getSchedule: (id: number) => apiClient.get(`/schedules/${id}`),
  
  createSchedule: (scheduleData: any) =>
    apiClient.post('/schedules', scheduleData),
  
  updateSchedule: (id: number, scheduleData: any) =>
    apiClient.put(`/schedules/${id}`, scheduleData),
  
  deleteSchedule: (id: number) => apiClient.delete(`/schedules/${id}`),

  // Shifts
  getShifts: (page?: number, limit?: number) =>
    apiClient.getPaginated('/shifts', page, limit),
  
  getShift: (id: number) => apiClient.get(`/shifts/${id}`),
  
  createShift: (shiftData: any) => apiClient.post('/shifts', shiftData),
  
  updateShift: (id: number, shiftData: any) =>
    apiClient.put(`/shifts/${id}`, shiftData),
  
  deleteShift: (id: number) => apiClient.delete(`/shifts/${id}`),
}; 