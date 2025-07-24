package models

import (
	"gorm.io/gorm"
)

// User repräsentiert einen Benutzer im System
type User struct {
	gorm.Model
	Username      string  `gorm:"uniqueIndex;not null" json:"username"`
	Email         string  `gorm:"uniqueIndex;not null" json:"email"`
	Password      string  `gorm:"not null" json:"-"` // "-" versteckt das Passwort in JSON-Responses
	AccountNumber string  `gorm:"uniqueIndex" json:"account_number"`
	Name          string  `json:"name"`
	Color         string  `json:"color"`
	Role          string  `gorm:"default:'user'" json:"role"`
	IsActive      bool    `gorm:"default:true" json:"is_active"`
	IsAdmin       bool    `gorm:"default:false" json:"is_admin"`
	TeamID        *uint   `json:"team_id"` // Optional, da nicht alle User einem Team angehören müssen
	Team          Team    `gorm:"foreignKey:TeamID" json:"team,omitempty"`
	Shifts        []Shift `gorm:"foreignKey:UserID" json:"shifts,omitempty"`
}
