package models

import (
	"time"

	"gorm.io/gorm"
)

// ShiftType represents a type of shift in the system
type ShiftType struct {
	ID          uint           `json:"id" gorm:"primarykey"`
	Name        string         `json:"name" gorm:"not null"`
	Description string         `json:"description"`
	Color       string         `json:"color" gorm:"size:7;default:#F59E0B"` // Hex color code
	IsActive    bool           `json:"isActive" gorm:"default:true"`
	Duration    int            `json:"duration,omitempty" gorm:"default:480"` // Standard-Dauer in Minuten (8 Stunden)
	BreakTime   int            `json:"breakTime,omitempty" gorm:"default:30"` // Standard-Pausenzeit in Minuten
	TeamID      *uint          `json:"teamId,omitempty" gorm:"index"`         // Optional: Team-Zuordnung
	CreatedBy   *uint          `json:"createdBy,omitempty" gorm:"index"`      // User who created this shift type
	CreatedAt   time.Time      `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt   time.Time      `json:"updatedAt" gorm:"autoUpdateTime"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Team          *Team `json:"team,omitempty" gorm:"foreignKey:TeamID"`
	CreatedByUser *User `json:"createdByUser,omitempty" gorm:"foreignKey:CreatedBy"`
}

// TableName returns the table name for the ShiftType model
func (ShiftType) TableName() string {
	return "shift_types"
}
