package models

import "time"

type Department struct {
	ID          uint        `gorm:"primarykey" json:"id"`
	Name        string      `json:"name" gorm:"not null"`
	Color       string      `json:"color" gorm:"not null"`
	Description string      `json:"description"`
	Employees   []Employee  `json:"employees,omitempty"`
	ShiftWeeks  []ShiftWeek `json:"shift_weeks,omitempty"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}
