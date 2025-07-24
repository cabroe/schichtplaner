package models

// Team repräsentiert ein Team im System
type Team struct {
	Base
	Name        string `gorm:"not null;unique" json:"name"`
	Description string `json:"description"`
	Color       string `gorm:"default:'#6B7280'" json:"color"` // Hex-Farbe für UI
	IsActive    bool   `gorm:"default:true" json:"is_active"`
	SortOrder   int    `gorm:"default:0" json:"sort_order"` // Sortierreihenfolge

	// Beziehungen
	Users []User `gorm:"foreignKey:TeamID" json:"users,omitempty"`
}
