package models

import (
	"time"
)

type ShiftWeek struct {
	ID           uint       `gorm:"primarykey" json:"id"`
	StartDate    time.Time  `json:"start_date" gorm:"not null;index"`
	EndDate      time.Time  `json:"end_date" gorm:"not null;index"`
	DepartmentID uint       `json:"department_id" gorm:"not null;index"`
	Department   Department `json:"-"`
	ShiftDays    []ShiftDay `json:"shift_days,omitempty" swaggerignore:"true"`
	Status       string     `json:"status" gorm:"type:varchar(20);default:'geplant'"`
	Notes        string     `json:"notes" gorm:"type:text"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}
