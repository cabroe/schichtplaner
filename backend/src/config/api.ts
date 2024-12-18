const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

export const API_ROUTES = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Employees
  EMPLOYEES: `${API_BASE_URL}/employees`,
  EMPLOYEE: (id: number) => `${API_BASE_URL}/employees/${id}`,
  
  // Departments
  DEPARTMENTS: `${API_BASE_URL}/departments`,
  DEPARTMENT: (id: number) => `${API_BASE_URL}/departments/${id}`,
  
  // ShiftWeeks
  SHIFT_WEEKS: `${API_BASE_URL}/shift-weeks`,
  SHIFT_WEEK: (id: number) => `${API_BASE_URL}/shift-weeks/${id}`,
  
  // ShiftDays
  SHIFT_DAYS: `${API_BASE_URL}/shift-days`,
  SHIFT_DAY: (id: number) => `${API_BASE_URL}/shift-days/${id}`,

  // ShiftTypes
  SHIFTTYPES: `${API_BASE_URL}/shifttypes`,
  SHIFTTYPE: (id: number) => `${API_BASE_URL}/shifttypes/${id}`,
}

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
}

export default API_ROUTES
