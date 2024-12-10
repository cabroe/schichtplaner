package models

type User struct {
	ID           uint       `gorm:"primarykey" json:"id"`
	Name         string     `json:"name" gorm:"not null;default:'Unknown'"`
	Email        string     `json:"email" gorm:"unique;not null;default:''"`
	DepartmentID uint       `json:"department_id"`
	Department   Department `json:"department"`
	ShiftDays    []ShiftDay `json:"shift_days"`
}
