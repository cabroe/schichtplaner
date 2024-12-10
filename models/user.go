package models

type User struct {
	ID           uint       `gorm:"primarykey" json:"id"`
	FirstName    string     `json:"first_name" gorm:"not null"`
	LastName     string     `json:"last_name" gorm:"not null"`
	Email        string     `json:"email" gorm:"unique;not null"`
	Password     string     `json:"password" gorm:"not null"`
	Color        string     `json:"color" gorm:"not null"`
	IsAdmin      bool       `json:"is_admin" gorm:"default:false"`
	DepartmentID uint       `json:"department_id"`
	Department   Department `json:"department" swaggerignore:"true"`
	ShiftDays    []ShiftDay `json:"shift_days" swaggerignore:"true"`
}
