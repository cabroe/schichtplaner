package models

import (
	"time"

	"gorm.io/gorm"
)

// Schicht represents a work shift in the system
type Schicht struct {
	ID          uint           `json:"id" gorm:"primarykey"`
	Name        string         `json:"name" gorm:"not null"`
	Description string         `json:"description" gorm:"type:text"`
	StartTime   time.Time      `json:"startTime" gorm:"not null"`
	EndTime     time.Time      `json:"endTime" gorm:"not null"`
	Date        time.Time      `json:"date" gorm:"not null;type:date"`
	IsActive    bool           `json:"isActive" gorm:"default:true"`
	Color       string         `json:"color" gorm:"size:7;default:#10B981"`
	MaxWorkers  int            `json:"maxWorkers" gorm:"default:1"`
	MinWorkers  int            `json:"minWorkers" gorm:"default:1"`
	CreatedAt   time.Time      `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt   time.Time      `json:"updatedAt" gorm:"autoUpdateTime"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Assignments []SchichtAssignment `json:"assignments,omitempty" gorm:"foreignKey:SchichtID"`
}

// SchichtAssignment represents the assignment of a user to a shift
type SchichtAssignment struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	SchichtID uint           `json:"schichtId" gorm:"not null"`
	UserID    uint           `json:"userId" gorm:"not null"`
	Status    string         `json:"status" gorm:"size:50;default:assigned"` // assigned, confirmed, cancelled
	CreatedAt time.Time      `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updatedAt" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Schicht *Schicht `json:"schicht,omitempty" gorm:"foreignKey:SchichtID"`
	User    *User    `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// TableName returns the table name for the Schicht model
func (Schicht) TableName() string {
	return "schichten"
}

// TableName returns the table name for the SchichtAssignment model
func (SchichtAssignment) TableName() string {
	return "schicht_assignments"
}

// Duration returns the duration of the shift
func (s *Schicht) Duration() time.Duration {
	return s.EndTime.Sub(s.StartTime)
}

// IsOverlapping checks if this shift overlaps with another shift on the same date
func (s *Schicht) IsOverlapping(other *Schicht) bool {
	if !s.Date.Equal(other.Date) {
		return false
	}
	
	return s.StartTime.Before(other.EndTime) && s.EndTime.After(other.StartTime)
}

// AssignedCount returns the number of assigned users
func (s *Schicht) AssignedCount() int {
	count := 0
	for _, assignment := range s.Assignments {
		if assignment.Status == "assigned" || assignment.Status == "confirmed" {
			count++
		}
	}
	return count
}

// IsFull returns true if the shift has reached its maximum capacity
func (s *Schicht) IsFull() bool {
	return s.AssignedCount() >= s.MaxWorkers
}

// HasMinimumStaffing returns true if the shift meets minimum staffing requirements
func (s *Schicht) HasMinimumStaffing() bool {
	return s.AssignedCount() >= s.MinWorkers
}
