package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestRegisterHandlers(t *testing.T) {
	// Setup Echo instance
	e := echo.New()
	
	// Register API handlers
	RegisterHandlers(e)

	t.Run("GET /api/message returns success", func(t *testing.T) {
		// Create request
		req := httptest.NewRequest(http.MethodGet, "/api/message", nil)
		rec := httptest.NewRecorder()

		// Perform request
		e.ServeHTTP(rec, req)

		// Assertions
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, "application/json; charset=UTF-8", rec.Header().Get("Content-Type"))

		// Parse response body
		var response map[string]string
		err := json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "Hello, from the golang World!", response["message"])
	})

	t.Run("GET /api/nonexistent returns 404", func(t *testing.T) {
		// Create request for non-existent endpoint
		req := httptest.NewRequest(http.MethodGet, "/api/nonexistent", nil)
		rec := httptest.NewRecorder()

		// Perform request
		e.ServeHTTP(rec, req)

		// Should return 404
		assert.Equal(t, http.StatusNotFound, rec.Code)
	})

	t.Run("POST /api/message returns 405 Method Not Allowed", func(t *testing.T) {
		// Create POST request to GET-only endpoint
		req := httptest.NewRequest(http.MethodPost, "/api/message", nil)
		rec := httptest.NewRecorder()

		// Perform request
		e.ServeHTTP(rec, req)

		// Should return 405 Method Not Allowed
		assert.Equal(t, http.StatusMethodNotAllowed, rec.Code)
	})
}

func TestMessageEndpoint(t *testing.T) {
	// Setup Echo instance with just the message handler
	e := echo.New()
	e.GET("/api/message", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"message": "Hello, from the golang World!"})
	})

	// Test cases
	tests := []struct {
		name           string
		method         string
		expectedCode   int
		expectedBody   map[string]string
		expectError    bool
	}{
		{
			name:         "Valid GET request",
			method:       http.MethodGet,
			expectedCode: http.StatusOK,
			expectedBody: map[string]string{"message": "Hello, from the golang World!"},
			expectError:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create request
			req := httptest.NewRequest(tt.method, "/api/message", nil)
			rec := httptest.NewRecorder()

			// Perform request
			e.ServeHTTP(rec, req)

			// Check status code
			assert.Equal(t, tt.expectedCode, rec.Code)

			if !tt.expectError && tt.expectedBody != nil {
				// Parse and check response body
				var response map[string]string
				err := json.Unmarshal(rec.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Equal(t, tt.expectedBody, response)
			}
		})
	}
}
