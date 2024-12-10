package models

type ShiftType struct {
	ID          uint       `gorm:"primarykey" json:"id"`
	Name        string     `json:"name" gorm:"not null"`
	Description string     `json:"description"`
	Duration    string     `json:"duration"`
	ShiftDays   []ShiftDay `json:"shift_days" swaggerignore:"true"`
}
