package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"schichtplaner/database"
	"schichtplaner/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetShifts(t *testing.T) {
	// Setup Test-Datenbank
	setupTestDB()
	defer cleanupTestDB()

	// Setup
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/api/shifts", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Test
	if assert.NoError(t, GetShifts(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
	}
}

func TestCreateShift(t *testing.T) {
	// Setup Test-Datenbank
	setupTestDB()
	defer cleanupTestDB()

	// Erstelle einen Test-User
	user := models.User{
		Username:  "testuser",
		Email:     "test@example.com",
		FirstName: "Test",
		LastName:  "User",
	}
	database.DB.Create(&user)

	// Erstelle einen Test-Schedule
	schedule := models.Schedule{
		Name:      "Test Schedule",
		StartDate: time.Now(),
		EndDate:   time.Now().AddDate(0, 1, 0),
	}
	database.DB.Create(&schedule)

	// Setup
	e := echo.New()

	shift := models.Shift{
		UserID:      user.ID,
		ScheduleID:  schedule.ID,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
		Description: "Test Shift",
	}

	shiftJSON, _ := json.Marshal(shift)
	req := httptest.NewRequest(http.MethodPost, "/api/shifts", bytes.NewBuffer(shiftJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Test
	if assert.NoError(t, CreateShift(c)) {
		assert.Equal(t, http.StatusCreated, rec.Code)
	}
}
