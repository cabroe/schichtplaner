package models

import (
	"time"

	"gorm.io/gorm"
)

type ShiftDay struct {
	ID          uint      `gorm:"primarykey" json:"id"`
	Date        time.Time `json:"date" gorm:"not null;uniqueIndex:idx_shift_date_employee"`
	ShiftWeekID uint      `json:"shift_week_id" gorm:"not null"`
	ShiftWeek   ShiftWeek `json:"-"`
	ShiftTypeID uint      `json:"shift_type_id" gorm:"not null"`
	ShiftType   ShiftType `json:"shift_type" swaggerignore:"true"`
	EmployeeID  uint      `json:"employee_id" gorm:"not null;uniqueIndex:idx_shift_date_employee"`
	Employee    Employee  `json:"employee" swaggerignore:"true"`
	Notes       string    `json:"notes" gorm:"type:text"`
	Status      string    `json:"status" gorm:"type:varchar(20);default:'planned'"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CanBeModified checks if the shift day can be modified based on its parent ShiftWeek status
func (sd *ShiftDay) CanBeModified() bool {
	return sd.ShiftWeek.Status == StatusDraft
}

// IsValidForWeek checks if the shift day date falls within its ShiftWeek period
func (sd *ShiftDay) IsValidForWeek(shiftWeek *ShiftWeek) bool {
	return !sd.Date.Before(shiftWeek.StartDate) && !sd.Date.After(shiftWeek.EndDate)
}

// ValidateEmployeeDepartment checks if employee belongs to the same department as the shift week
func (sd *ShiftDay) ValidateEmployeeDepartment(employee *Employee, shiftWeek *ShiftWeek) bool {
	return employee.DepartmentID == shiftWeek.DepartmentID
}

// HasConflict checks for scheduling conflicts with existing shifts
func (sd *ShiftDay) HasConflict(db *gorm.DB) bool {
	var count int64
	db.Model(&ShiftDay{}).
		Where("employee_id = ? AND date = ? AND id != ?", sd.EmployeeID, sd.Date, sd.ID).
		Count(&count)
	return count > 0
}
