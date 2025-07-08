package models

import (
	"fmt"
	"sync"
	"time"
)

// In-memory Storage für Entwicklungszwecke
// In der Produktion würde dies durch eine Datenbank ersetzt werden

var (
	employees = make(map[int]*Employee)
	shifts    = make(map[int]*Shift)
	reports   = make(map[int]*Report)
	
	employeeIDCounter = 1
	shiftIDCounter    = 1
	reportIDCounter   = 1
	
	mu sync.RWMutex
)

// ResetStores löscht alle In-Memory-Daten (für Tests)
func ResetStores() {
	mu.Lock()
	defer mu.Unlock()
	
	employees = make(map[int]*Employee)
	shifts = make(map[int]*Shift)
	reports = make(map[int]*Report)
	
	employeeIDCounter = 1
	shiftIDCounter = 1
	reportIDCounter = 1
}

// Employee-Operationen
func GetAllEmployees() []*Employee {
	mu.RLock()
	defer mu.RUnlock()
	
	result := make([]*Employee, 0, len(employees))
	for _, employee := range employees {
		result = append(result, employee)
	}
	return result
}

func GetEmployeeByID(id int) (*Employee, error) {
	mu.RLock()
	defer mu.RUnlock()
	
	employee, exists := employees[id]
	if !exists {
		return nil, fmt.Errorf("employee with ID %d not found", id)
	}
	return employee, nil
}

func CreateEmployee(req *EmployeeCreateRequest) *Employee {
	mu.Lock()
	defer mu.Unlock()
	
	employee := &Employee{
		ID:        employeeIDCounter,
		Name:      req.Name,
		Email:     req.Email,
		Position:  req.Position,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	
	employees[employeeIDCounter] = employee
	employeeIDCounter++
	
	return employee
}

func UpdateEmployee(id int, req *EmployeeUpdateRequest) (*Employee, error) {
	mu.Lock()
	defer mu.Unlock()
	
	employee, exists := employees[id]
	if !exists {
		return nil, fmt.Errorf("employee with ID %d not found", id)
	}
	
	if req.Name != "" {
		employee.Name = req.Name
	}
	if req.Email != "" {
		employee.Email = req.Email
	}
	if req.Position != "" {
		employee.Position = req.Position
	}
	employee.UpdatedAt = time.Now()
	
	return employee, nil
}

func DeleteEmployee(id int) error {
	mu.Lock()
	defer mu.Unlock()
	
	_, exists := employees[id]
	if !exists {
		return fmt.Errorf("employee with ID %d not found", id)
	}
	
	delete(employees, id)
	return nil
}

// Shift-Operationen
func GetAllShifts() []*Shift {
	mu.RLock()
	defer mu.RUnlock()
	
	result := make([]*Shift, 0, len(shifts))
	for _, shift := range shifts {
		result = append(result, shift)
	}
	return result
}

func GetShiftByID(id int) (*Shift, error) {
	mu.RLock()
	defer mu.RUnlock()
	
	shift, exists := shifts[id]
	if !exists {
		return nil, fmt.Errorf("shift with ID %d not found", id)
	}
	return shift, nil
}

func CreateShift(req *ShiftCreateRequest) (*Shift, error) {
	mu.Lock()
	defer mu.Unlock()
	
	// Zeit-Strings parsen
	startTime, err := time.Parse(time.RFC3339, req.StartTime)
	if err != nil {
		return nil, fmt.Errorf("invalid start_time format: %v", err)
	}
	
	endTime, err := time.Parse(time.RFC3339, req.EndTime)
	if err != nil {
		return nil, fmt.Errorf("invalid end_time format: %v", err)
	}
	
	shift := &Shift{
		ID:         shiftIDCounter,
		EmployeeID: req.EmployeeID,
		StartTime:  startTime,
		EndTime:    endTime,
		Position:   req.Position,
		Notes:      req.Notes,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}
	
	shifts[shiftIDCounter] = shift
	shiftIDCounter++
	
	return shift, nil
}

func UpdateShift(id int, req *ShiftUpdateRequest) (*Shift, error) {
	mu.Lock()
	defer mu.Unlock()
	
	shift, exists := shifts[id]
	if !exists {
		return nil, fmt.Errorf("shift with ID %d not found", id)
	}
	
	if req.EmployeeID != 0 {
		shift.EmployeeID = req.EmployeeID
	}
	if req.StartTime != "" {
		startTime, err := time.Parse(time.RFC3339, req.StartTime)
		if err != nil {
			return nil, fmt.Errorf("invalid start_time format: %v", err)
		}
		shift.StartTime = startTime
	}
	if req.EndTime != "" {
		endTime, err := time.Parse(time.RFC3339, req.EndTime)
		if err != nil {
			return nil, fmt.Errorf("invalid end_time format: %v", err)
		}
		shift.EndTime = endTime
	}
	if req.Position != "" {
		shift.Position = req.Position
	}
	if req.Notes != "" {
		shift.Notes = req.Notes
	}
	shift.UpdatedAt = time.Now()
	
	return shift, nil
}

func DeleteShift(id int) error {
	mu.Lock()
	defer mu.Unlock()
	
	_, exists := shifts[id]
	if !exists {
		return fmt.Errorf("shift with ID %d not found", id)
	}
	
	delete(shifts, id)
	return nil
}

// Report-Operationen
func GetAllReports() []*Report {
	mu.RLock()
	defer mu.RUnlock()
	
	result := make([]*Report, 0, len(reports))
	for _, report := range reports {
		result = append(result, report)
	}
	return result
}

func CreateReport(title, reportType, description, data string) *Report {
	mu.Lock()
	defer mu.Unlock()
	
	report := &Report{
		ID:          reportIDCounter,
		Title:       title,
		Type:        reportType,
		Description: description,
		Data:        data,
		CreatedAt:   time.Now(),
	}
	
	reports[reportIDCounter] = report
	reportIDCounter++
	
	return report
}
