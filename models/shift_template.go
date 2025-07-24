package models

// ShiftTemplate repräsentiert eine Schichtvorlage mit 7 Tagen
type ShiftTemplate struct {
	Base
	Name        string `gorm:"not null;unique" json:"name"`
	Description string `json:"description"`
	Color       string `gorm:"default:'#6B7280'" json:"color"` // Hex-Farbe für UI
	IsActive    bool   `gorm:"default:true" json:"is_active"`
	SortOrder   int    `gorm:"default:0" json:"sort_order"` // Sortierreihenfolge

	// 7-Tage-Woche mit Schichttypen
	MondayShiftTypeID *uint     `json:"monday_shift_type_id"`
	MondayShiftType   ShiftType `gorm:"foreignKey:MondayShiftTypeID" json:"monday_shift_type,omitempty"`

	TuesdayShiftTypeID *uint     `json:"tuesday_shift_type_id"`
	TuesdayShiftType   ShiftType `gorm:"foreignKey:TuesdayShiftTypeID" json:"tuesday_shift_type,omitempty"`

	WednesdayShiftTypeID *uint     `json:"wednesday_shift_type_id"`
	WednesdayShiftType   ShiftType `gorm:"foreignKey:WednesdayShiftTypeID" json:"wednesday_shift_type,omitempty"`

	ThursdayShiftTypeID *uint     `json:"thursday_shift_type_id"`
	ThursdayShiftType   ShiftType `gorm:"foreignKey:ThursdayShiftTypeID" json:"thursday_shift_type,omitempty"`

	FridayShiftTypeID *uint     `json:"friday_shift_type_id"`
	FridayShiftType   ShiftType `gorm:"foreignKey:FridayShiftTypeID" json:"friday_shift_type,omitempty"`

	SaturdayShiftTypeID *uint     `json:"saturday_shift_type_id"`
	SaturdayShiftType   ShiftType `gorm:"foreignKey:SaturdayShiftTypeID" json:"saturday_shift_type,omitempty"`

	SundayShiftTypeID *uint     `json:"sunday_shift_type_id"`
	SundayShiftType   ShiftType `gorm:"foreignKey:SundayShiftTypeID" json:"sunday_shift_type,omitempty"`
}
