package models

type Department struct {
	ID         uint        `gorm:"primarykey" json:"id"`
	Name       string      `json:"name" gorm:"not null;default:'New Department'"`
	Users      []User      `json:"users" swaggerignore:"true"`
	ShiftWeeks []ShiftWeek `json:"shift_weeks" swaggerignore:"true"`
}
