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

func TestReportGeneration(t *testing.T) {
	CleanupTestData() // Clean up before test
	e := SetupTestEcho()

	// Create test data first
	employeeJSON := `{"name":"John Doe","email":"john@example.com","position":"Developer"}`
	req := httptest.NewRequest(http.MethodPost, "/employees", strings.NewReader(employeeJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	createEmployee(c)

	shiftJSON := `{"employee_id":1,"start_time":"2024-01-01T09:00:00Z","end_time":"2024-01-01T17:00:00Z","position":"Developer","notes":"Regular shift"}`
	req = httptest.NewRequest(http.MethodPost, "/shifts", strings.NewReader(shiftJSON))
	req.Header.Set("Content-Type", "application/json")
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)
	createShift(c)

	// Test getting all reports
	req = httptest.NewRequest(http.MethodGet, "/reports", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err := getReports(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var reports []*models.Report
	json.Unmarshal(rec.Body.Bytes(), &reports)
	assert.GreaterOrEqual(t, len(reports), 0)

	// Test getting shift reports
	req = httptest.NewRequest(http.MethodGet, "/reports/shifts", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err = getShiftReports(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response map[string]any
	json.Unmarshal(rec.Body.Bytes(), &response)
	assert.Contains(t, response, "report")
	assert.Contains(t, response, "data")

	// Test getting employee reports
	req = httptest.NewRequest(http.MethodGet, "/reports/employees", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err = getEmployeeReports(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	json.Unmarshal(rec.Body.Bytes(), &response)
	assert.Contains(t, response, "report")
	assert.Contains(t, response, "data")

	// Test CSV export for shifts
	req = httptest.NewRequest(http.MethodGet, "/reports/export?type=shifts", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err = exportReports(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Equal(t, "text/csv", rec.Header().Get("Content-Type"))
	assert.Contains(t, rec.Header().Get("Content-Disposition"), "shifts_report.csv")
	assert.Contains(t, rec.Body.String(), "ID,Employee ID,Start Time,End Time,Position,Notes")

	// Test CSV export for employees
	req = httptest.NewRequest(http.MethodGet, "/reports/export?type=employees", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err = exportReports(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Equal(t, "text/csv", rec.Header().Get("Content-Type"))
	assert.Contains(t, rec.Header().Get("Content-Disposition"), "employees_report.csv")
	assert.Contains(t, rec.Body.String(), "ID,Name,Email,Position,Created At")

	// Test invalid report type
	req = httptest.NewRequest(http.MethodGet, "/reports/export?type=invalid", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	err = exportReports(c)
	assert.Error(t, err)
}
