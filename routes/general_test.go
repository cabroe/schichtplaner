package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestRegisterGeneralRoutes(t *testing.T) {
	e := echo.New()
	api := e.Group("/api")
	RegisterGeneralRoutes(api)

	t.Run("GET /api/health sollte registriert sein", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
		rec := httptest.NewRecorder()
		e.ServeHTTP(rec, req)
		assert.NotEqual(t, http.StatusNotFound, rec.Code, "Route /api/health sollte registriert sein")
	})

	t.Run("GET /api/invalid sollte 404 zurückgeben", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/invalid", nil)
		rec := httptest.NewRecorder()
		e.ServeHTTP(rec, req)
		assert.Equal(t, http.StatusNotFound, rec.Code, "Route /api/invalid sollte 404 zurückgeben")
	})
}
