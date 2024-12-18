package models

import (
	"time"

	"gorm.io/gorm"
)

type ShiftDay struct {
	ID          uint      `gorm:"primarykey" json:"id"`
	Date        time.Time `json:"date" gorm:"not null;uniqueIndex:idx_shift_date_employee"`
	ShiftWeekID *uint     `json:"shift_week_id"` // Pointer für NULL-Werte
	ShiftWeek   ShiftWeek `json:"-"`
	ShiftTypeID uint      `json:"shift_type_id" gorm:"not null"`
	ShiftType   ShiftType `json:"shift_type" swaggerignore:"true"`
	EmployeeID  *uint     `json:"employee_id" gorm:"uniqueIndex:idx_shift_date_employee"` // Pointer für NULL-Werte
	Employee    Employee  `json:"employee" swaggerignore:"true"`
	Notes       string    `json:"notes" gorm:"type:text"`
	Status      string    `json:"status" gorm:"type:varchar(20);default:'planned'"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CanBeModified prüft, ob der Schichttag basierend auf dem Status der übergeordneten ShiftWeek geändert werden kann
func (sd *ShiftDay) CanBeModified() bool {
	if sd.ShiftWeek.Status == "" {
		return true
	}
	return sd.ShiftWeek.Status == StatusDraft
}

// IsValidForWeek prüft, ob das Datum des Schichttags innerhalb der ShiftWeek liegt
func (sd *ShiftDay) IsValidForWeek(shiftWeek *ShiftWeek) bool {
	if shiftWeek == nil {
		return false
	}
	return !sd.Date.Before(shiftWeek.StartDate) && !sd.Date.After(shiftWeek.EndDate)
}

// ValidateEmployeeDepartment prüft, ob der Mitarbeiter zur selben Abteilung wie die Schichtwoche gehört
func (sd *ShiftDay) ValidateEmployeeDepartment(employee *Employee, shiftWeek *ShiftWeek) bool {
	if employee == nil || employee.DepartmentID == nil || shiftWeek == nil || shiftWeek.DepartmentID == nil {
		return false
	}
	return *employee.DepartmentID == *shiftWeek.DepartmentID
}

// HasConflict prüft auf Terminüberschneidungen mit bestehenden Schichten
func (sd *ShiftDay) HasConflict(db *gorm.DB) bool {
	if sd.EmployeeID == nil {
		return false
	}
	var count int64
	db.Model(&ShiftDay{}).
		Where("employee_id = ? AND date = ? AND id != ?", sd.EmployeeID, sd.Date, sd.ID).
		Count(&count)
	return count > 0
}
