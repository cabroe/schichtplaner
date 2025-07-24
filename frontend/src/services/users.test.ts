import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from './users';
import { api } from './api';
import type { User, UserForm } from '../types';

// Mock der API
vi.mock('./api', () => ({
  api: {
    getUsers: vi.fn(),
    getUser: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    getActiveUsers: vi.fn(),
    getUsersByTeam: vi.fn(),
    getUsersWithoutTeam: vi.fn(),
  },
}));

// Mock-Daten
const mockUser: User = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  name: 'Test User',
  color: '#ff0000',
  role: 'employee',
  personalnummer: 'EMP001',
  account_number: 'ACC001',
  is_active: true,
  is_admin: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockUserForm: UserForm = {
  username: 'newuser',
  email: 'new@example.com',
  name: 'New User',
  color: '#00ff00',
  role: 'employee',
  personalnummer: 'EMP002',
  account_number: 'ACC002',
  password: 'password123',
};

const mockUsersResponse = {
  data: [
    mockUser,
    {
      ...mockUser,
      id: 2,
      username: 'admin',
      name: 'Admin User',
      role: 'admin',
      isAdmin: true,
    },
    {
      ...mockUser,
      id: 3,
      username: 'inactive',
      name: 'Inactive User',
      is_active: false,
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 3,
    totalPages: 1,
  },
  success: true,
};

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('ruft alle User mit Standard-Pagination ab', async () => {
      const mockApi = vi.mocked(api);
      mockApi.getUsers.mockResolvedValue(mockUsersResponse);

      const result = await userService.getUsers();

      expect(mockApi.getUsers).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockUsersResponse);
    });

    it('ruft User mit benutzerdefinierter Pagination ab', async () => {
      const mockApi = vi.mocked(api);
      mockApi.getUsers.mockResolvedValue(mockUsersResponse);

      const result = await userService.getUsers(2, 5);

      expect(mockApi.getUsers).toHaveBeenCalledWith(2, 5);
      expect(result).toEqual(mockUsersResponse);
    });

    it('behandelt API-Fehler korrekt', async () => {
      const mockApi = vi.mocked(api);
      const error = new Error('API Error');
      mockApi.getUsers.mockRejectedValue(error);

      await expect(userService.getUsers()).rejects.toThrow('API Error');
      expect(mockApi.getUsers).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getUser', () => {
    it('ruft einen einzelnen User ab', async () => {
      const mockApi = vi.mocked(api);
      mockApi.getUser.mockResolvedValue({ data: mockUser, success: true });

      const result = await userService.getUser(1);

      expect(mockApi.getUser).toHaveBeenCalledWith(1);
      expect(result).toEqual({ data: mockUser, success: true });
    });

    it('behandelt Fehler beim Abrufen eines Users', async () => {
      const mockApi = vi.mocked(api);
      const error = new Error('User not found');
      mockApi.getUser.mockRejectedValue(error);

      await expect(userService.getUser(999)).rejects.toThrow('User not found');
      expect(mockApi.getUser).toHaveBeenCalledWith(999);
    });
  });

  describe('createUser', () => {
    it('erstellt einen neuen User erfolgreich', async () => {
      const mockApi = vi.mocked(api);
      const createdUser = { ...mockUser, id: 4, username: 'newuser' };
      mockApi.createUser.mockResolvedValue({ data: createdUser, success: true });

      const result = await userService.createUser(mockUserForm);

      expect(mockApi.createUser).toHaveBeenCalledWith(mockUserForm);
      expect(result).toEqual({ data: createdUser, success: true });
    });

    it('behandelt Fehler beim Erstellen eines Users', async () => {
      const mockApi = vi.mocked(api);
      const error = new Error('Username already exists');
      mockApi.createUser.mockRejectedValue(error);

      await expect(userService.createUser(mockUserForm)).rejects.toThrow('Username already exists');
      expect(mockApi.createUser).toHaveBeenCalledWith(mockUserForm);
    });

    it('validiert User-Daten vor dem Erstellen', async () => {
      const mockApi = vi.mocked(api);
      const invalidUserData = { ...mockUserForm, email: 'invalid-email' };
      mockApi.createUser.mockRejectedValue(new Error('Invalid email'));

      await expect(userService.createUser(invalidUserData)).rejects.toThrow('Invalid email');
      expect(mockApi.createUser).toHaveBeenCalledWith(invalidUserData);
    });
  });

  describe('updateUser', () => {
    it('aktualisiert einen User erfolgreich', async () => {
      const mockApi = vi.mocked(api);
      const updatedUser = { ...mockUser, name: 'Updated User' };
      const updateData = { name: 'Updated User' };
      mockApi.updateUser.mockResolvedValue({ data: updatedUser, success: true });

      const result = await userService.updateUser(1, updateData);

      expect(mockApi.updateUser).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual({ data: updatedUser, success: true });
    });

    it('behandelt Fehler beim Aktualisieren eines Users', async () => {
      const mockApi = vi.mocked(api);
      const error = new Error('User not found');
      mockApi.updateUser.mockRejectedValue(error);

      await expect(userService.updateUser(999, { name: 'Test User' })).rejects.toThrow('User not found');
      expect(mockApi.updateUser).toHaveBeenCalledWith(999, { name: 'Test User' });
    });

    it('aktualisiert nur teilweise User-Daten', async () => {
      const mockApi = vi.mocked(api);
      const partialUpdate = { email: 'newemail@example.com' };
      mockApi.updateUser.mockResolvedValue({ data: { ...mockUser, ...partialUpdate }, success: true });

      const result = await userService.updateUser(1, partialUpdate);

      expect(mockApi.updateUser).toHaveBeenCalledWith(1, partialUpdate);
      expect((result as any).data.email).toBe('newemail@example.com');
    });
  });

  describe('deleteUser', () => {
    it('löscht einen User erfolgreich', async () => {
      const mockApi = vi.mocked(api);
      mockApi.deleteUser.mockResolvedValue({ success: true });

      const result = await userService.deleteUser(1);

      expect(mockApi.deleteUser).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it('behandelt Fehler beim Löschen eines Users', async () => {
      const mockApi = vi.mocked(api);
      const error = new Error('User not found');
      mockApi.deleteUser.mockRejectedValue(error);

      await expect(userService.deleteUser(999)).rejects.toThrow('User not found');
      expect(mockApi.deleteUser).toHaveBeenCalledWith(999);
    });
  });

  describe('searchUsers', () => {
    it('sucht User nach Namen', async () => {
      const mockApi = vi.mocked(api);
      const testResponse = {
        data: [
          { ...mockUser, name: 'Admin User', username: 'admin' },
          { ...mockUser, id: 2, name: 'Test User', username: 'testuser' },
        ],
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
        success: true,
      };
      mockApi.getUsers.mockResolvedValue(testResponse);

      const result = await userService.searchUsers('admin');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Admin User');
    });

    it('sucht User nach Personalnummer', async () => {
      const mockApi = vi.mocked(api);
      const testResponse = {
        data: [
          { ...mockUser, personalnummer: 'EMP001' },
          { ...mockUser, id: 2, personalnummer: 'EMP002' },
          { ...mockUser, id: 3, personalnummer: 'EMP003' },
        ],
        pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
        success: true,
      };
      mockApi.getUsers.mockResolvedValue(testResponse);

      const result = await userService.searchUsers('EMP001');

      expect(result.data).toHaveLength(1); // Nur 1 User mit EMP001
    });

    it('sucht User nach AccountNumber', async () => {
      const mockApi = vi.mocked(api);
      const testResponse = {
        data: [
          { ...mockUser, accountNumber: 'ACC001' },
          { ...mockUser, id: 2, accountNumber: 'ACC002' },
          { ...mockUser, id: 3, accountNumber: 'ACC003' },
        ],
        pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
        success: true,
      };
      mockApi.getUsers.mockResolvedValue(testResponse);

      const result = await userService.searchUsers('ACC001');

      expect(result.data).toHaveLength(1); // Nur 1 User mit ACC001
    });

    it('gibt leere Ergebnisse bei keiner Übereinstimmung zurück', async () => {
      const mockApi = vi.mocked(api);
      mockApi.getUsers.mockResolvedValue(mockUsersResponse);

      const result = await userService.searchUsers('nonexistent');

      expect(result.data).toHaveLength(0);
    });

    it('behandelt leere Suchanfragen', async () => {
      const mockApi = vi.mocked(api);
      const testResponse = {
        data: [
          { ...mockUser },
          { ...mockUser, id: 2 },
          { ...mockUser, id: 3 },
        ],
        pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
        success: true,
      };
      mockApi.getUsers.mockResolvedValue(testResponse);

      const result = await userService.searchUsers('');

      expect(result.data).toHaveLength(3); // Alle User zurückgeben
    });

    it('behandelt API-Fehler bei der Suche', async () => {
      const mockApi = vi.mocked(api);
      const error = new Error('Search failed');
      mockApi.getUsers.mockRejectedValue(error);

      await expect(userService.searchUsers('test')).rejects.toThrow('Search failed');
    });
  });

  describe('getActiveUsers', () => {
    it('filtert nur aktive User', async () => {
      const mockApi = vi.mocked(api);
      const testResponse = {
              data: [
        { ...mockUser, is_active: true },
        { ...mockUser, id: 2, is_active: true },
        { ...mockUser, id: 3, is_active: false },
      ],
        pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
        success: true,
      };
      mockApi.getUsers.mockResolvedValue(testResponse);

      const result = await userService.getActiveUsers();

      expect(mockApi.getUsers).toHaveBeenCalledWith(1, 10);
      expect(result.data).toHaveLength(2); // Nur 2 aktive User
      expect(result.data.every((user: User) => user.is_active)).toBe(true);
    });

    it('gibt leere Liste zurück wenn keine aktiven User', async () => {
      const mockApi = vi.mocked(api);
      const inactiveUsersResponse = {
        ...mockUsersResponse,
        data: mockUsersResponse.data.map(user => ({ ...user, is_active: false })),
      };
      mockApi.getUsers.mockResolvedValue(inactiveUsersResponse);

      const result = await userService.getActiveUsers();

      expect(result.data).toHaveLength(0);
    });

    it('behandelt API-Fehler beim Abrufen aktiver User', async () => {
      const mockApi = vi.mocked(api);
      const error = new Error('Failed to fetch users');
      mockApi.getUsers.mockRejectedValue(error);

      await expect(userService.getActiveUsers()).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('getUsersByRole', () => {
    it('filtert User nach Rolle', async () => {
      const mockApi = vi.mocked(api);
      const testResponse = {
        data: [
          { ...mockUser, role: 'admin' },
          { ...mockUser, id: 2, role: 'employee' },
          { ...mockUser, id: 3, role: 'employee' },
        ],
        pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
        success: true,
      };
      mockApi.getUsers.mockResolvedValue(testResponse);

      const result = await userService.getUsersByRole('admin');

      expect(mockApi.getUsers).toHaveBeenCalledWith(1, 10);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].role).toBe('admin');
    });

    it('filtert User nach employee Rolle', async () => {
      const mockApi = vi.mocked(api);
      const testResponse = {
        data: [
          { ...mockUser, role: 'employee' },
          { ...mockUser, id: 2, role: 'employee' },
          { ...mockUser, id: 3, role: 'admin' },
        ],
        pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
        success: true,
      };
      mockApi.getUsers.mockResolvedValue(testResponse);

      const result = await userService.getUsersByRole('employee');

      expect(result.data).toHaveLength(2); // 2 employee User
      expect(result.data.every((user: User) => user.role === 'employee')).toBe(true);
    });

    it('gibt leere Liste zurück bei unbekannter Rolle', async () => {
      const mockApi = vi.mocked(api);
      mockApi.getUsers.mockResolvedValue(mockUsersResponse);

      const result = await userService.getUsersByRole('unknown');

      expect(result.data).toHaveLength(0);
    });

    it('behandelt API-Fehler beim Filtern nach Rolle', async () => {
      const mockApi = vi.mocked(api);
      const error = new Error('Failed to fetch users');
      mockApi.getUsers.mockRejectedValue(error);

      await expect(userService.getUsersByRole('admin')).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('Edge Cases', () => {
    it('behandelt leere API-Antworten', async () => {
      const mockApi = vi.mocked(api);
      const emptyResponse = { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }, success: true };
      mockApi.getUsers.mockResolvedValue(emptyResponse);

      const result = await userService.getUsers();

      expect(result.data).toHaveLength(0);
    });

    it('behandelt API-Antworten ohne data-Property', async () => {
      const mockApi = vi.mocked(api);
      const responseWithoutData = { pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }, success: true };
      mockApi.getUsers.mockResolvedValue(responseWithoutData);

      const result = await userService.searchUsers('test');

      expect(result.data).toBeUndefined();
    });

    it('behandelt null/undefined Werte in User-Daten', async () => {
      const mockApi = vi.mocked(api);
      const usersWithNullValues = {
        ...mockUsersResponse,
        data: [
          { ...mockUser, name: null },
          { ...mockUser, id: 2, name: 'Valid User' },
        ],
      };
      mockApi.getUsers.mockResolvedValue(usersWithNullValues);

      const result = await userService.searchUsers('valid');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Valid User');
    });
  });

  describe('Service-Instanz', () => {
    it('exportiert eine Singleton-Instanz', () => {
      expect(userService).toBeDefined();
      expect(typeof userService.getUsers).toBe('function');
      expect(typeof userService.getUser).toBe('function');
      expect(typeof userService.createUser).toBe('function');
      expect(typeof userService.updateUser).toBe('function');
      expect(typeof userService.deleteUser).toBe('function');
      expect(typeof userService.searchUsers).toBe('function');
      expect(typeof userService.getActiveUsers).toBe('function');
      expect(typeof userService.getUsersByRole).toBe('function');
    });
  });
}); 