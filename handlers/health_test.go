package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetHealth(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := getHealth(c)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "ok")
	assert.Contains(t, rec.Body.String(), "schichtplaner")
}

func TestRegisterHealthRoutes(t *testing.T) {
	e := echo.New()
	api := e.Group("/api")

	RegisterHealthRoutes(api)

	// Test health endpoint
	req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Body.String(), "ok")
	assert.Contains(t, rec.Body.String(), "schichtplaner")
}
