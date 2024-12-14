package models

import "time"

type Employee struct {
	ID           uint       `gorm:"primarykey" json:"id"`
	FirstName    string     `json:"first_name" gorm:"not null"`
	LastName     string     `json:"last_name" gorm:"not null"`
	Email        string     `json:"email" gorm:"unique;not null"`
	Password     string     `json:"password" gorm:"not null"`
	Color        string     `json:"color" gorm:"not null"`
	IsAdmin      bool       `json:"is_admin" gorm:"default:false"`
	DepartmentID uint       `json:"department_id" gorm:"not null"`
	Department   Department `json:"-"`
	ShiftDays    []ShiftDay `json:"shift_days" swaggerignore:"true"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}
