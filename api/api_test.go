package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/danhawkins/go-vite-react-example/db"
	"github.com/danhawkins/go-vite-react-example/models"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestRegisterHandlers(t *testing.T) {
	// Setup test database
	testDB, err := db.GetTestDB()
	assert.NoError(t, err)
	
	// Set global DB for testing
	originalDB := db.DB
	db.DB = testDB
	defer func() { db.DB = originalDB }()

	// Seed test data
	message := models.Message{Content: "Test message from database"}
	err = testDB.Create(&message).Error
	assert.NoError(t, err)

	// Setup Echo instance
	e := echo.New()
	
	// Register API handlers
	RegisterHandlers(e)

	t.Run("GET /api/message returns success from database", func(t *testing.T) {
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
		assert.Equal(t, "Test message from database", response["message"])
	})

	t.Run("GET /api/messages returns all messages", func(t *testing.T) {
		// Create request
		req := httptest.NewRequest(http.MethodGet, "/api/messages", nil)
		rec := httptest.NewRecorder()

		// Perform request
		e.ServeHTTP(rec, req)

		// Assertions
		assert.Equal(t, http.StatusOK, rec.Code)
		assert.Equal(t, "application/json; charset=UTF-8", rec.Header().Get("Content-Type"))

		// Parse response body
		var response map[string]interface{}
		err := json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.NotNil(t, response["messages"])
		assert.Equal(t, float64(1), response["count"]) // JSON unmarshals numbers as float64
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

func TestMessageEndpointWithEmptyDatabase(t *testing.T) {
	// Setup test database (empty)
	testDB, err := db.GetTestDB()
	assert.NoError(t, err)
	
	// Set global DB for testing
	originalDB := db.DB
	db.DB = testDB
	defer func() { db.DB = originalDB }()

	// Setup Echo instance
	e := echo.New()
	e.GET("/api/message", getLatestMessage)

	t.Run("GET /api/message returns 404 when no messages exist", func(t *testing.T) {
		// Create request
		req := httptest.NewRequest(http.MethodGet, "/api/message", nil)
		rec := httptest.NewRecorder()

		// Perform request
		e.ServeHTTP(rec, req)

		// Should return 404 when no messages exist
		assert.Equal(t, http.StatusNotFound, rec.Code)

		// Parse response
		var response map[string]string
		err := json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "No message found", response["error"])
	})
}
