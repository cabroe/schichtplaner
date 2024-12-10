package models

import (
	"time"
)

type ShiftDay struct {
	ID          uint      `gorm:"primarykey" json:"id"`
	Date        time.Time `json:"date" gorm:"not null;uniqueIndex:idx_shift_date"`
	ShiftWeekID uint      `json:"shift_week_id" gorm:"not null"`
	ShiftWeek   ShiftWeek `json:"shift_week" swaggerignore:"true"`
	ShiftTypeID uint      `json:"shift_type_id" gorm:"not null"`
	ShiftType   ShiftType `json:"shift_type" swaggerignore:"true"`
	UserID      uint      `json:"user_id" gorm:"not null"`
	User        User      `json:"user" swaggerignore:"true"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
