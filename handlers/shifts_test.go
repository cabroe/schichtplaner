package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetShifts(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/shifts", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := getShifts(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Schichtplan API")
	assert.Contains(t, rec.Body.String(), "shifts")
}

func TestCreateShift(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/shifts", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := createShift(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)
	assert.Contains(t, rec.Body.String(), "Schicht erstellt")
}

func TestGetShift(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/shifts/123", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("123")

	err := getShift(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "123")
	assert.Contains(t, rec.Body.String(), "Schicht Details")
}

func TestUpdateShift(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPut, "/shifts/456", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("456")

	err := updateShift(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "456")
	assert.Contains(t, rec.Body.String(), "aktualisiert")
}

func TestDeleteShift(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, "/shifts/789", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("789")

	err := deleteShift(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "789")
	assert.Contains(t, rec.Body.String(), "gelöscht")
}

func TestRegisterShiftRoutes(t *testing.T) {
	e := echo.New()
	api := e.Group("/api")
	
	RegisterShiftRoutes(api)
	
	// Test GET /shifts
	req := httptest.NewRequest(http.MethodGet, "/api/shifts", nil)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "Schichtplan API")
	
	// Test POST /shifts
	req = httptest.NewRequest(http.MethodPost, "/api/shifts", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	
	assert.Equal(t, http.StatusCreated, rec.Code)
	assert.Contains(t, rec.Body.String(), "erstellt")
}
