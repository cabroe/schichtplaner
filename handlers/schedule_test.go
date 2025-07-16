package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"schichtplaner/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetSchedules(t *testing.T) {
	// Setup Test-Datenbank
	setupTestDB()
	defer cleanupTestDB()

	// Setup
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/api/schedules", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Test
	if assert.NoError(t, GetSchedules(c)) {
		assert.Equal(t, http.StatusOK, rec.Code)
	}
}

func TestCreateSchedule(t *testing.T) {
	// Setup Test-Datenbank
	setupTestDB()
	defer cleanupTestDB()

	// Setup
	e := echo.New()

	schedule := models.Schedule{
		Name:        "Test Schedule",
		Description: "Test Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().AddDate(0, 1, 0),
		IsActive:    true,
	}

	scheduleJSON, _ := json.Marshal(schedule)
	req := httptest.NewRequest(http.MethodPost, "/api/schedules", bytes.NewBuffer(scheduleJSON))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Test
	if assert.NoError(t, CreateSchedule(c)) {
		assert.Equal(t, http.StatusCreated, rec.Code)
	}
}
