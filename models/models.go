package models

import (
	"time"

	"gorm.io/gorm"
)

// User repräsentiert einen Benutzer im System
type User struct {
	gorm.Model
	Username  string  `gorm:"uniqueIndex;not null" json:"username"`
	Email     string  `gorm:"uniqueIndex;not null" json:"email"`
	FirstName string  `json:"first_name"`
	LastName  string  `json:"last_name"`
	IsActive  bool    `gorm:"default:true" json:"is_active"`
	Role      string  `gorm:"default:'user'" json:"role"`
	Shifts    []Shift `gorm:"foreignKey:UserID" json:"shifts,omitempty"`
}

// Shift repräsentiert eine einzelne Schicht
type Shift struct {
	gorm.Model
	UserID      uint      `gorm:"not null" json:"user_id"`
	User        User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	StartTime   time.Time `gorm:"not null" json:"start_time"`
	EndTime     time.Time `gorm:"not null" json:"end_time"`
	BreakTime   int       `gorm:"default:0" json:"break_time"` // in Minuten
	Description string    `json:"description"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	ScheduleID  uint      `gorm:"not null" json:"schedule_id"`
	Schedule    Schedule  `gorm:"foreignKey:ScheduleID" json:"schedule,omitempty"`
}

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
