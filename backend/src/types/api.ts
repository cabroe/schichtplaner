export interface Department {
  id: number
  name: string
  color: string
  description: string
  employees?: Employee[]
  shiftWeeks?: ShiftWeek[]
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
}

export interface ShiftType {
  id: number
  name: string
  description: string
  color: string
  created_at: string
  updated_at: string
}
