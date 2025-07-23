// Grundlegende Types für das Schichtplaner-System

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  color: string;
  role: UserRole;
  personalnummer: string;
  accountNumber: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'manager' | 'employee' | 'user';

export const UserRoles = {
  ADMIN: 'admin' as const,
  MANAGER: 'manager' as const,
  EMPLOYEE: 'employee' as const,
  USER: 'user' as const
} as const;

export interface Schedule {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  shifts: Shift[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shift {
  id: number;
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  employee: User;
  schedule: Schedule;
  status: ShiftStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ShiftStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export const ShiftStatuses = {
  SCHEDULED: 'scheduled' as const,
  IN_PROGRESS: 'in_progress' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const
} as const;

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  badge?: {
    text: string;
    variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  };
  children?: NavigationItem[];
  permission?: UserRole[];
  external?: boolean;
  disabled?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
}

export interface UserForm {
  username: string;
  email: string;
  name: string;
  color: string;
  role: UserRole;
  personalnummer: string;
  accountNumber: string;
  password?: string;
  isActive?: boolean;
  isAdmin?: boolean;
}

export interface ScheduleForm {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

export interface ShiftForm {
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  employeeId: number;
  scheduleId: number;
}

// UI Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
} 