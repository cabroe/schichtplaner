package models

import (
	"time"

	"gorm.io/gorm"
)

// Team represents a team in the system
type Team struct {
	ID          uint           `json:"id" gorm:"primarykey"`
	Name        string         `json:"name" gorm:"not null"`
	Description string         `json:"description"`
	Color       string         `json:"color" gorm:"size:7;default:#10B981"` // Hex color code
	IsActive    bool           `json:"isActive" gorm:"default:true"`
	UserCount   int            `json:"userCount" gorm:"-"` // Computed field, not stored
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	TeamMembers []TeamMember `json:"teamMembers,omitempty" gorm:"foreignKey:TeamID"`
	ShiftTypes  []ShiftType  `json:"shiftTypes,omitempty" gorm:"foreignKey:TeamID"`
}

// TableName returns the table name for the Team model
func (Team) TableName() string {
	return "teams"
}
