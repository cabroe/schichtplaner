package models

import "time"

type ShiftType struct {
	ID          uint       `gorm:"primarykey" json:"id"`
	Name        string     `json:"name" gorm:"not null;unique"`
	Description string     `json:"description" gorm:"not null"`
	Duration    string     `json:"duration" gorm:"not null"`
	Color       string     `json:"color" gorm:"not null"`
	IsActive    bool       `json:"is_active" gorm:"default:true"`
	ShiftDays   []ShiftDay `json:"shift_days,omitempty" swaggerignore:"true"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
