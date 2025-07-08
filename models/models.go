package models

import (
	"time"
)

// Employee repräsentiert einen Mitarbeiter im System
type Employee struct {
	ID        int       `json:"id"`
	Name      string    `json:"name" validate:"required"`
	Email     string    `json:"email" validate:"required,email"`
	Position  string    `json:"position"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Shift repräsentiert eine Arbeitsschicht
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

// Report repräsentiert einen generierten Bericht
type Report struct {
	ID          int       `json:"id"`
	Title       string    `json:"title" validate:"required"`
	Type        string    `json:"type" validate:"required"`
	Description string    `json:"description"`
	Data        string    `json:"data"`
	CreatedAt   time.Time `json:"created_at"`
}

// ShiftCreateRequest repräsentiert die Request-Payload für das Erstellen einer Schicht
type ShiftCreateRequest struct {
	EmployeeID int    `json:"employee_id" validate:"required"`
	StartTime  string `json:"start_time" validate:"required"`
	EndTime    string `json:"end_time" validate:"required"`
	Position   string `json:"position"`
	Notes      string `json:"notes"`
}

// ShiftUpdateRequest repräsentiert die Request-Payload für das Aktualisieren einer Schicht
type ShiftUpdateRequest struct {
	EmployeeID int    `json:"employee_id"`
	StartTime  string `json:"start_time"`
	EndTime    string `json:"end_time"`
	Position   string `json:"position"`
	Notes      string `json:"notes"`
}

// EmployeeCreateRequest repräsentiert die Request-Payload für das Erstellen eines Mitarbeiters
type EmployeeCreateRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Position string `json:"position"`
}

// EmployeeUpdateRequest repräsentiert die Request-Payload für das Aktualisieren eines Mitarbeiters
type EmployeeUpdateRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email" validate:"omitempty,email"`
	Position string `json:"position"`
}

// PaginationRequest repräsentiert Parameter für paginierte Anfragen
type PaginationRequest struct {
	Limit  int `json:"limit" validate:"min=1,max=100"`
	Offset int `json:"offset" validate:"min=0"`
}

// PaginatedResponse repräsentiert eine paginierte Antwort
type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Total      int         `json:"total"`
	Limit      int         `json:"limit"`
	Offset     int         `json:"offset"`
	HasMore    bool        `json:"has_more"`
	TotalPages int         `json:"total_pages"`
}
