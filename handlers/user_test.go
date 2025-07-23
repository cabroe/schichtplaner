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
	"golang.org/x/crypto/bcrypt"
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

	userRequest := map[string]interface{}{
		"username":       "testuser",
		"email":          "test@example.com",
		"password":       "password123",
		"account_number": "EMP001",
		"name":           "Test User",
		"color":          "#ff0000",
		"role":           "user",
		"is_active":      true,
		"is_admin":       false,
	}

	userJSON, _ := json.Marshal(userRequest)
	req := httptest.NewRequest(http.MethodPost, "/api/users", bytes.NewBuffer(userJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Test
	if assert.NoError(t, CreateUser(c)) {
		assert.Equal(t, http.StatusCreated, rec.Code)
	}
}

func TestUpdateUser(t *testing.T) {
	// Setup Test-Datenbank
	setupTestDB()
	defer cleanupTestDB()

	// Erstelle einen Test-User
	user := models.User{
		Username:      "testuser",
		Email:         "test@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP001",
		Name:          "Test User",
		Color:         "#ff0000",
		Role:          "user",
		IsActive:      true,
		IsAdmin:       false,
	}
	database.DB.Create(&user)

	// Setup
	e := echo.New()

	updateRequest := map[string]interface{}{
		"username":       "updateduser",
		"email":          "updated@example.com",
		"account_number": "EMP002",
		"name":           "Updated User",
		"color":          "#00ff00",
		"role":           "admin",
		"is_active":      true,
		"is_admin":       true,
	}

	updateJSON, _ := json.Marshal(updateRequest)
	req := httptest.NewRequest(http.MethodPut, "/api/users/1", bytes.NewBuffer(updateJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	// Test
	if assert.NoError(t, UpdateUser(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
	}
}

func TestChangePassword(t *testing.T) {
	// Setup Test-Datenbank
	setupTestDB()
	defer cleanupTestDB()

	// Hash das Passwort korrekt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("oldpassword"), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("Fehler beim Hashen des Passworts: %v", err)
	}

	// Erstelle einen Test-User mit gehashed Passwort
	user := models.User{
		Username:      "testuser",
		Email:         "test@example.com",
		Password:      string(hashedPassword),
		AccountNumber: "EMP001",
		Name:          "Test User",
		Color:         "#ff0000",
		Role:          "user",
		IsActive:      true,
		IsAdmin:       false,
	}
	database.DB.Create(&user)

	// Setup
	e := echo.New()

	passwordRequest := map[string]interface{}{
		"old_password": "oldpassword",
		"new_password": "newpassword123",
	}

	passwordJSON, _ := json.Marshal(passwordRequest)
	req := httptest.NewRequest(http.MethodPut, "/api/users/1/password", bytes.NewBuffer(passwordJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	// Test
	if assert.NoError(t, ChangePassword(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
	}
}
