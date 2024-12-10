package models

import (
	"time"
)

type ShiftDay struct {
	ID          uint      `gorm:"primarykey" json:"id"`
	Date        time.Time `json:"date" gorm:"not null"`
	ShiftWeekID uint      `json:"shift_week_id"`
	ShiftWeek   ShiftWeek `json:"shift_week" swaggerignore:"true"`
	ShiftTypeID uint      `json:"shift_type_id"`
	ShiftType   ShiftType `json:"shift_type" swaggerignore:"true"`
	UserID      uint      `json:"user_id"`
	User        User      `json:"user" swaggerignore:"true"`
}
