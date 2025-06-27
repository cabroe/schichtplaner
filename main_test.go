package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/danhawkins/go-vite-react-example/api"
	"github.com/danhawkins/go-vite-react-example/frontend"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/stretchr/testify/assert"
)

func setupTestServer() *echo.Echo {
	// Create a new echo server for testing
	e := echo.New()

	// Add middleware
	e.Use(middleware.Logger())
	e.Use(middleware.CORS())

	// Setup the frontend handlers
	frontend.RegisterHandlers(e)

	// Setup API handlers
	api.RegisterHandlers(e)

	return e
}

func TestIntegration(t *testing.T) {
	// Set environment for testing
	os.Setenv("ENV", "test")
	defer os.Unsetenv("ENV")

	// Setup test server
	e := setupTestServer()

	t.Run("API message endpoint works", func(t *testing.T) {
		// Create request
		req := httptest.NewRequest(http.MethodGet, "/api/message", nil)
		rec := httptest.NewRecorder()

		// Perform request
		e.ServeHTTP(rec, req)

		// Assertions
		assert.Equal(t, http.StatusOK, rec.Code)

		// Parse response
		var response map[string]string
		err := json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "Hello, from the golang World!", response["message"])
	})

	t.Run("CORS headers are present", func(t *testing.T) {
		// Create CORS preflight request
		req := httptest.NewRequest(http.MethodOptions, "/api/message", nil)
		req.Header.Set("Origin", "http://localhost:5173")
		req.Header.Set("Access-Control-Request-Method", "GET")
		rec := httptest.NewRecorder()

		// Perform request
		e.ServeHTTP(rec, req)

		// Check CORS headers
		assert.Contains(t, rec.Header().Get("Access-Control-Allow-Origin"), "*")
	})

	t.Run("API routes are properly prefixed", func(t *testing.T) {
		// Test that non-API routes don't interfere
		req := httptest.NewRequest(http.MethodGet, "/api/message", nil)
		rec := httptest.NewRecorder()

		e.ServeHTTP(rec, req)

		// Should get API response, not frontend
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Contains(t, rec.Header().Get("Content-Type"), "application/json")
	})
}

func TestEnvironmentHandling(t *testing.T) {
	tests := []struct {
		name        string
		envValue    string
		expectProxy bool
	}{
		{
			name:        "Development environment",
			envValue:    "dev",
			expectProxy: true,
		},
		{
			name:        "Production environment", 
			envValue:    "prod",
			expectProxy: false,
		},
		{
			name:        "Test environment",
			envValue:    "test",
			expectProxy: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Set environment
			os.Setenv("ENV", tt.envValue)
			defer os.Unsetenv("ENV")

			// Setup server (this will read the ENV variable)
			e := setupTestServer()

			// Test API still works regardless of environment
			req := httptest.NewRequest(http.MethodGet, "/api/message", nil)
			rec := httptest.NewRecorder()

			e.ServeHTTP(rec, req)

			// API should always work
			assert.Equal(t, http.StatusOK, rec.Code)
		})
	}
}
