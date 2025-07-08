package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetEmployees(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/employees", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := getEmployees(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Mitarbeiter API")
	assert.Contains(t, rec.Body.String(), "employees")
}

func TestCreateEmployee(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/employees", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := createEmployee(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)
	assert.Contains(t, rec.Body.String(), "Mitarbeiter erstellt")
}

func TestGetEmployee(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/employees/123", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("123")

	err := getEmployee(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "123")
	assert.Contains(t, rec.Body.String(), "Mitarbeiter Details")
}

func TestUpdateEmployee(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPut, "/employees/456", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("456")

	err := updateEmployee(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "456")
	assert.Contains(t, rec.Body.String(), "aktualisiert")
}

func TestDeleteEmployee(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, "/employees/789", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("789")

	err := deleteEmployee(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "789")
	assert.Contains(t, rec.Body.String(), "gelöscht")
}

func TestRegisterEmployeeRoutes(t *testing.T) {
	e := echo.New()
	api := e.Group("/api")
	
	RegisterEmployeeRoutes(api)
	
	// Test GET /employees
	req := httptest.NewRequest(http.MethodGet, "/api/employees", nil)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Mitarbeiter API")
	
	// Test POST /employees
	req = httptest.NewRequest(http.MethodPost, "/api/employees", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	
	assert.Equal(t, http.StatusCreated, rec.Code)
	assert.Contains(t, rec.Body.String(), "erstellt")
}
