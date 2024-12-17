export interface Department {
    id: number
    name: string
    color: string
    employees?: Employee[]
    shiftWeeks?: ShiftWeek[]
    createdAt: string
    updatedAt: string
  }
  
  export interface Employee {
    id: number
    first_name: string
    last_name: string
    email: string
    password: string
    color: string
    is_admin: boolean
    department_id: number
    shift_days?: ShiftDay[]
    createdAt: string
    updatedAt: string
  }
  
  export const ShiftWeekStatus = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
  } as const
  
  export type ShiftWeekStatusType = typeof ShiftWeekStatus[keyof typeof ShiftWeekStatus]
  
  export interface ShiftWeek {
    id: number
    start_date: string
    end_date: string
    department_id: number
    department?: Department
    shift_days?: ShiftDay[]
    status: ShiftWeekStatusType
    notes: string
    createdAt: string
    updatedAt: string
  }
  
  export interface ShiftDay {
    id: number
    date: string
    shift_week_id: number
    shift_type_id: number
    shift_type?: ShiftType
    employee_id: number
    employee?: Employee
    notes: string
    status: string
    createdAt: string
    updatedAt: string
  }
  
  export interface ShiftType {
    id: number
    name: string
    start_time: string
    end_time: string
    color: string
  }
  