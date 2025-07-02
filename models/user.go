package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user in the system
type User struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	Username  string         `json:"username" gorm:"uniqueIndex;not null"`
	Name      string         `json:"name" gorm:"not null"`
	Email     string         `json:"email" gorm:"uniqueIndex;not null"`
	Color     string         `json:"color" gorm:"size:7;default:#3B82F6"` // Hex color code
	Role      string         `json:"role" gorm:"size:50;default:Mitarbeiter"`
	IsActive  bool           `json:"isActive" gorm:"default:true"`
	IsAdmin   bool           `json:"isAdmin" gorm:"default:false"`
	LastLogin *time.Time     `json:"lastLogin,omitempty"`
	TeamCount int            `json:"teamCount" gorm:"-"` // Computed field, not stored
	CreatedAt time.Time      `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updatedAt" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	TeamMembers []TeamMember `json:"teamMembers,omitempty" gorm:"foreignKey:UserID"`
}

// TableName returns the table name for the User model
func (User) TableName() string {
	return "users"
}
