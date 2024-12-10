package models

type Department struct {
	ID         uint        `gorm:"primarykey" json:"id"`
	Name       string      `json:"name" gorm:"not null;default:'New Department'"`
	Color      string      `json:"color" gorm:"not null"`
	Users      []User      `json:"users" swaggerignore:"true"`
	ShiftWeeks []ShiftWeek `json:"shift_weeks" swaggerignore:"true"`
}
