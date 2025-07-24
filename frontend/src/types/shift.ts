// Typen für die Schichtplanung

export type ShiftType = 'F' | 'S' | 'N' | 'U' | 'K' | 'FR' | 'FT' | 'WE' | null;

export interface Employee {
  id: string;
  name: string;
  username: string;
  email: string;
  color: string;
  role: string;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  description: string;
  weekPattern: ShiftType[];
  color: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  date: Date;
  shiftType: ShiftType;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface WeekGroup {
  week: number;
  days: Date[];
}

export interface ShiftPlanningState {
  shifts: Record<string, ShiftType>;
  copiedShift: ShiftType;
  selectedCell: {
    employee: Employee;
    day: Date;
    shiftType: ShiftType;
  } | null;
  showTemplateModal: boolean;
  contextMenu: {
    x: number;
    y: number;
    isOpen: boolean;
    employee?: Employee;
    day?: Date;
    shiftType?: ShiftType;
  };
  activeSubmenu: string | null;
}

export interface ShiftPlanningProps {
  weeksToShow?: number;
  employees: Employee[];
  onShiftChange?: (employeeId: string, date: Date, shiftType: ShiftType) => void;
  onWeekDelete?: (weekStart: Date) => void;
  readOnly?: boolean;
} 