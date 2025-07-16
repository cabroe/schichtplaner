package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"schichtplaner/database"
	"schichtplaner/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() {
	// Erstelle eine Test-Datenbank im Speicher
	var err error
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to test database")
	}

	// Auto-Migration für Tests
	database.DB.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{})
}

func cleanupTestDB() {
	// Lösche Test-Daten
	database.DB.Exec("DELETE FROM users")
	database.DB.Exec("DELETE FROM shifts")
	database.DB.Exec("DELETE FROM schedules")
}

func TestGetUsers(t *testing.T) {
	// Setup Test-Datenbank
	setupTestDB()
	defer cleanupTestDB()

	// Setup
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/api/users", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Test
	if assert.NoError(t, GetUsers(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
	}
}

func TestCreateUser(t *testing.T) {
	// Setup Test-Datenbank
	setupTestDB()
	defer cleanupTestDB()

	// Setup
	e := echo.New()

	user := models.User{
		Username:  "testuser",
		Email:     "test@example.com",
		FirstName: "Test",
		LastName:  "User",
	}

	userJSON, _ := json.Marshal(user)
	req := httptest.NewRequest(http.MethodPost, "/api/users", bytes.NewBuffer(userJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Test
	if assert.NoError(t, CreateUser(c)) {
		assert.Equal(t, http.StatusCreated, rec.Code)
	}
}
