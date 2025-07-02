package models

import (
	"time"

	"gorm.io/gorm"
)

// Shift repräsentiert eine einzelne Schicht im System
type Shift struct {
	ID          uint           `json:"id" gorm:"primarykey"`
	TeamID      uint           `json:"teamId" gorm:"not null;index"`
	ShiftTypeID uint           `json:"shiftTypeId" gorm:"not null;index"`
	UserID      uint           `json:"userId" gorm:"not null;index"` // Wer arbeitet die Schicht
	StartTime   time.Time      `json:"startTime" gorm:"not null"`
	EndTime     time.Time      `json:"endTime" gorm:"not null"`
	Notes       string         `json:"notes,omitempty"`
	IsActive    bool           `json:"isActive" gorm:"default:true"`
	CreatedAt   time.Time      `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt   time.Time      `json:"updatedAt" gorm:"autoUpdateTime"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Beziehungen
	Team      *Team      `json:"team,omitempty" gorm:"foreignKey:TeamID"`
	ShiftType *ShiftType `json:"shiftType,omitempty" gorm:"foreignKey:ShiftTypeID"`
	User      *User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// TableName gibt den Tabellennamen für das Shift-Modell zurück
func (Shift) TableName() string {
	return "shifts"
}
