package models

import (
	"time"

	"gorm.io/gorm"
)

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
