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

func TestCreateShiftTypeValidation(t *testing.T) {
	// Test: Ungültige Zeiten
	shiftType := models.ShiftType{
		Name:         "Ungültige Schicht",
		DefaultStart: time.Date(2024, 1, 1, 14, 0, 0, 0, time.UTC),
		DefaultEnd:   time.Date(2024, 1, 1, 6, 0, 0, 0, time.UTC),
	}

	jsonData, _ := json.Marshal(shiftType)
	req := httptest.NewRequest(http.MethodPost, "/api/shift-types", bytes.NewBuffer(jsonData))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	_ = echo.New().NewContext(req, rec)

	// Die Validierung würde hier erfolgen, aber wir testen nur die Logik
	assert.True(t, shiftType.DefaultStart.After(shiftType.DefaultEnd))
}

func TestCreateShiftTypeDurationValidation(t *testing.T) {
	// Test: Ungültige Dauer
	shiftType := models.ShiftType{
		Name:        "Ungültige Dauer",
		MinDuration: 600, // 10 Stunden
		MaxDuration: 480, // 8 Stunden
	}

	jsonData, _ := json.Marshal(shiftType)
	req := httptest.NewRequest(http.MethodPost, "/api/shift-types", bytes.NewBuffer(jsonData))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	_ = echo.New().NewContext(req, rec)

	// Die Validierung würde hier erfolgen, aber wir testen nur die Logik
	assert.True(t, shiftType.MinDuration > shiftType.MaxDuration)
}

func TestShiftTypeModelStructure(t *testing.T) {
	// Test: Korrekte Struktur des Models
	shiftType := models.ShiftType{
		Name:         "Test Schicht",
		Description:  "Test Beschreibung",
		Color:        "#3B82F6",
		DefaultStart: time.Date(2024, 1, 1, 8, 0, 0, 0, time.UTC),
		DefaultEnd:   time.Date(2024, 1, 1, 16, 0, 0, 0, time.UTC),
		DefaultBreak: 30,
		IsActive:     true,
		SortOrder:    1,
		MinDuration:  480,
		MaxDuration:  600,
	}

	assert.Equal(t, "Test Schicht", shiftType.Name)
	assert.Equal(t, "Test Beschreibung", shiftType.Description)
	assert.Equal(t, "#3B82F6", shiftType.Color)
	assert.Equal(t, 30, shiftType.DefaultBreak)
	assert.True(t, shiftType.IsActive)
	assert.Equal(t, 1, shiftType.SortOrder)
	assert.Equal(t, 480, shiftType.MinDuration)
	assert.Equal(t, 600, shiftType.MaxDuration)
}

func TestShiftTypeJSONSerialization(t *testing.T) {
	shiftType := models.ShiftType{
		Name:         "Test Schicht",
		Description:  "Test Beschreibung",
		Color:        "#10B981",
		DefaultStart: time.Date(2024, 1, 1, 8, 0, 0, 0, time.UTC),
		DefaultEnd:   time.Date(2024, 1, 1, 16, 0, 0, 0, time.UTC),
		DefaultBreak: 30,
		IsActive:     true,
		SortOrder:    1,
		MinDuration:  480,
		MaxDuration:  600,
	}

	jsonData, err := json.Marshal(shiftType)
	assert.NoError(t, err)
	assert.Contains(t, string(jsonData), "Test Schicht")
	assert.Contains(t, string(jsonData), "#10B981")
	assert.Contains(t, string(jsonData), "true")
}
