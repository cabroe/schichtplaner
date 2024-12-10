package models

import "time"

type ShiftType struct {
	ID          uint       `gorm:"primarykey" json:"id"`
	Name        string     `json:"name" gorm:"not null"`
	Description string     `json:"description"`
	Duration    string     `json:"duration"`
	Color       string     `json:"color" gorm:"not null"`
	ShiftDays   []ShiftDay `json:"shift_days" swaggerignore:"true"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
