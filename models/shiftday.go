package models

import (
	"time"
)

type ShiftDay struct {
	ID          uint      `gorm:"primarykey" json:"id"`
	Date        time.Time `json:"date" gorm:"not null;uniqueIndex:idx_shift_date_employee"`
	ShiftWeekID uint      `json:"shift_week_id" gorm:"not null"`
	ShiftWeek   ShiftWeek `json:"shift_week" swaggerignore:"true"`
	ShiftTypeID uint      `json:"shift_type_id" gorm:"not null"`
	ShiftType   ShiftType `json:"shift_type" swaggerignore:"true"`
	EmployeeID  uint      `json:"employee_id" gorm:"not null;uniqueIndex:idx_shift_date_employee"`
	Employee    Employee  `json:"employee" swaggerignore:"true"`
	Notes       string    `json:"notes" gorm:"type:text"`
	Status      string    `json:"status" gorm:"type:varchar(20);default:'geplant'"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
