package models

import (
	"time"
)

const (
	StatusDraft     = "draft"
	StatusPublished = "published"
	StatusArchived  = "archived"
)

type ShiftWeek struct {
	ID           uint       `gorm:"primarykey" json:"id"`
	CalendarWeek int        `json:"calendar_week" gorm:"not null;index"`
	Year         int        `json:"year" gorm:"not null;index"`
	DepartmentID *uint      `json:"department_id"`
	Department   Department `json:"-"`
	ShiftDays    []ShiftDay `json:"shift_days,omitempty" swaggerignore:"true"`
	Status       string     `json:"status" gorm:"type:varchar(20);default:'draft'"`
	Notes        string     `json:"notes" gorm:"type:text"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

func (sw *ShiftWeek) IsValidStatus() bool {
	return sw.Status == StatusDraft ||
		sw.Status == StatusPublished ||
		sw.Status == StatusArchived
}
