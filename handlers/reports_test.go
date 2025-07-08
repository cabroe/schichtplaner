package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetReports(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/reports", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := getReports(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Berichte API")
	assert.Contains(t, rec.Body.String(), "reports")
}

func TestGetShiftReports(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/reports/shifts", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := getShiftReports(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "shifts")
	assert.Contains(t, rec.Body.String(), "Schichtplan-Berichte")
}

func TestGetEmployeeReports(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/reports/employees", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := getEmployeeReports(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "employees")
	assert.Contains(t, rec.Body.String(), "Mitarbeiter-Berichte")
}

func TestExportReports(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/reports/export", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := exportReports(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "exportiert")
	assert.Contains(t, rec.Body.String(), "csv")
}

func TestRegisterReportRoutes(t *testing.T) {
	e := echo.New()
	api := e.Group("/api")
	
	RegisterReportRoutes(api)
	
	// Test GET /reports
	req := httptest.NewRequest(http.MethodGet, "/api/reports", nil)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Berichte API")
	
	// Test GET /reports/shifts
	req = httptest.NewRequest(http.MethodGet, "/api/reports/shifts", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Schichtplan-Berichte")
	
	// Test GET /reports/employees
	req = httptest.NewRequest(http.MethodGet, "/api/reports/employees", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Mitarbeiter-Berichte")
	
	// Test GET /reports/export
	req = httptest.NewRequest(http.MethodGet, "/api/reports/export", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "exportiert")
}
