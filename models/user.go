package models

import (
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
