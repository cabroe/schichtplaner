package models

import (
	"time"
)

// Employee represents a worker in the system
type Employee struct {
	ID        int       `json:"id"`
	Name      string    `json:"name" validate:"required"`
	Email     string    `json:"email" validate:"required,email"`
	Position  string    `json:"position"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Shift represents a work shift
type Shift struct {
	ID         int       `json:"id"`
	EmployeeID int       `json:"employee_id" validate:"required"`
	StartTime  time.Time `json:"start_time" validate:"required"`
	EndTime    time.Time `json:"end_time" validate:"required"`
	Position   string    `json:"position"`
	Notes      string    `json:"notes"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// Report represents a generated report
type Report struct {
	ID          int       `json:"id"`
	Title       string    `json:"title" validate:"required"`
	Type        string    `json:"type" validate:"required"`
	Description string    `json:"description"`
	Data        string    `json:"data"`
	CreatedAt   time.Time `json:"created_at"`
}

// ShiftCreateRequest represents the request payload for creating a shift
type ShiftCreateRequest struct {
	EmployeeID int    `json:"employee_id" validate:"required"`
	StartTime  string `json:"start_time" validate:"required"`
	EndTime    string `json:"end_time" validate:"required"`
	Position   string `json:"position"`
	Notes      string `json:"notes"`
}

// ShiftUpdateRequest represents the request payload for updating a shift
type ShiftUpdateRequest struct {
	EmployeeID int    `json:"employee_id"`
	StartTime  string `json:"start_time"`
	EndTime    string `json:"end_time"`
	Position   string `json:"position"`
	Notes      string `json:"notes"`
}

// EmployeeCreateRequest represents the request payload for creating an employee
type EmployeeCreateRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Position string `json:"position"`
}

// EmployeeUpdateRequest represents the request payload for updating an employee
type EmployeeUpdateRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email" validate:"omitempty,email"`
	Position string `json:"position"`
}
