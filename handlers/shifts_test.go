package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"schichtplaner/models"

	"github.com/stretchr/testify/assert"
)

func TestCRUDShifts(t *testing.T) {
	CleanupTestData() // Clean up before test
	e := SetupTestEcho()

	// First create an employee for the shift
	employeeJSON := `{"name":"John Doe","email":"john@example.com","position":"Developer"}`
	req := httptest.NewRequest(http.MethodPost, "/employees", strings.NewReader(employeeJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	createEmployee(c)

	// Test creating a shift
	shiftJSON := `{"employee_id":1,"start_time":"2024-01-01T09:00:00Z","end_time":"2024-01-01T17:00:00Z","position":"Developer","notes":"Regular shift"}`
	req = httptest.NewRequest(http.MethodPost, "/shifts", strings.NewReader(shiftJSON))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err := createShift(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)

	var createdShift models.Shift
	json.Unmarshal(rec.Body.Bytes(), &createdShift)
	assert.Equal(t, 1, createdShift.EmployeeID)
	assert.Equal(t, "Developer", createdShift.Position)
	assert.Equal(t, "Regular shift", createdShift.Notes)
	assert.Equal(t, 1, createdShift.ID)

	// Test getting all shifts
	req = httptest.NewRequest(http.MethodGet, "/shifts", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err = getShifts(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var shifts []*models.Shift
	json.Unmarshal(rec.Body.Bytes(), &shifts)
	assert.Equal(t, 1, len(shifts))
	assert.Equal(t, 1, shifts[0].EmployeeID)

	// Test getting specific shift
	req = httptest.NewRequest(http.MethodGet, "/shifts/1", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err = getShift(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var shift models.Shift
	json.Unmarshal(rec.Body.Bytes(), &shift)
	assert.Equal(t, 1, shift.EmployeeID)
	assert.Equal(t, 1, shift.ID)

	// Test updating shift
	updateJSON := `{"position":"Senior Developer","notes":"Updated shift"}`
	req = httptest.NewRequest(http.MethodPut, "/shifts/1", strings.NewReader(updateJSON))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err = updateShift(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var updatedShift models.Shift
	json.Unmarshal(rec.Body.Bytes(), &updatedShift)
	assert.Equal(t, "Senior Developer", updatedShift.Position)
	assert.Equal(t, "Updated shift", updatedShift.Notes)
	assert.Equal(t, 1, updatedShift.EmployeeID) // Should remain unchanged

	// Test deleting shift
	req = httptest.NewRequest(http.MethodDelete, "/shifts/1", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err = deleteShift(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNoContent, rec.Code)

	// Verify shift is deleted
	req = httptest.NewRequest(http.MethodGet, "/shifts/1", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err = getShift(c)
	assert.Error(t, err)
}

func TestShiftValidation(t *testing.T) {
	e := SetupTestEcho()

	// Test creating shift with invalid time format
	shiftJSON := `{"employee_id":1,"start_time":"invalid-time","end_time":"2024-01-01T17:00:00Z","position":"Developer"}`
	req := httptest.NewRequest(http.MethodPost, "/shifts", strings.NewReader(shiftJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := createShift(c)
	assert.Error(t, err)

	// Test creating shift without required fields
	shiftJSON = `{"position":"Developer"}`
	req = httptest.NewRequest(http.MethodPost, "/shifts", strings.NewReader(shiftJSON))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err = createShift(c)
	assert.Error(t, err)
}
