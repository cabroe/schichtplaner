package models

import (
	"time"
)

type ShiftWeek struct {
	ID           uint       `gorm:"primarykey" json:"id"`
	StartDate    time.Time  `json:"start_date" gorm:"not null"`
	EndDate      time.Time  `json:"end_date" gorm:"not null"`
	DepartmentID uint       `json:"department_id"`
	Department   Department `json:"department" swaggerignore:"true"`
	ShiftDays    []ShiftDay `json:"shift_days" swaggerignore:"true"`
}
