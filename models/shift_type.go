package models

import (
	"time"

	"gorm.io/gorm"
)

// ShiftType repräsentiert einen Schichttyp (z.B. Frühschicht, Spätschicht, Nachtschicht)
type ShiftType struct {
	gorm.Model
	Name         string    `gorm:"not null;unique" json:"name"`
	Description  string    `json:"description"`
	Color        string    `gorm:"default:'#3B82F6'" json:"color"`  // Hex-Farbe für UI
	DefaultStart time.Time `json:"default_start"`                   // Standard-Startzeit
	DefaultEnd   time.Time `json:"default_end"`                     // Standard-Endzeit
	DefaultBreak int       `gorm:"default:30" json:"default_break"` // Standard-Pausenzeit in Minuten
	IsActive     bool      `gorm:"default:true" json:"is_active"`
	SortOrder    int       `gorm:"default:0" json:"sort_order"`   // Sortierreihenfolge
	MinDuration  int       `gorm:"default:0" json:"min_duration"` // Mindestdauer in Minuten
	MaxDuration  int       `gorm:"default:0" json:"max_duration"` // Maximaldauer in Minuten
}
