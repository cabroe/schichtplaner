package models

import (
	"time"
)

type ShiftWeek struct {
	ID           uint       `gorm:"primarykey" json:"id"`
	StartDate    time.Time  `json:"start_date" gorm:"not null"`
	EndDate      time.Time  `json:"end_date" gorm:"not null"`
	DepartmentID uint       `json:"department_id" gorm:"not null"`
	Department   Department `json:"-"` // Ausschluss von der JSON-Serialisierung
	ShiftDays    []ShiftDay `json:"shift_days" swaggerignore:"true"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}
