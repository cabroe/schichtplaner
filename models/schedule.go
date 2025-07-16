package models

import (
	"time"

	"gorm.io/gorm"
)

// Schedule repräsentiert einen Schichtplan
type Schedule struct {
	gorm.Model
	Name        string    `gorm:"not null" json:"name"`
	Description string    `json:"description"`
	StartDate   time.Time `gorm:"not null" json:"start_date"`
	EndDate     time.Time `gorm:"not null" json:"end_date"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	Shifts      []Shift   `gorm:"foreignKey:ScheduleID" json:"shifts,omitempty"`
}
