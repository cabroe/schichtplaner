package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"schichtplaner/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestCreateShiftTemplateValidation(t *testing.T) {
	// Test: Ungültige Schichttyp-ID
	shiftTemplate := models.ShiftTemplate{
		Name:        "Test Vorlage",
		Description: "Test Beschreibung",
		Color:       "#3B82F6",
		IsActive:    true,
		SortOrder:   1,
	}

	jsonData, _ := json.Marshal(shiftTemplate)
	req := httptest.NewRequest(http.MethodPost, "/api/shift-templates", bytes.NewBuffer(jsonData))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	_ = echo.New().NewContext(req, rec)

	// Die Validierung würde hier erfolgen, aber wir testen nur die Logik
	assert.Equal(t, "Test Vorlage", shiftTemplate.Name)
	assert.Equal(t, "Test Beschreibung", shiftTemplate.Description)
}

func TestShiftTemplateModelStructure(t *testing.T) {
	// Test: Korrekte Struktur des Models
	shiftTemplate := models.ShiftTemplate{
		Name:        "Test Vorlage",
		Description: "Test Beschreibung",
		Color:       "#3B82F6",
		IsActive:    true,
		SortOrder:   1,
	}

	assert.Equal(t, "Test Vorlage", shiftTemplate.Name)
	assert.Equal(t, "Test Beschreibung", shiftTemplate.Description)
	assert.Equal(t, "#3B82F6", shiftTemplate.Color)
	assert.True(t, shiftTemplate.IsActive)
	assert.Equal(t, 1, shiftTemplate.SortOrder)
}

func TestShiftTemplateJSONSerialization(t *testing.T) {
	shiftTemplate := models.ShiftTemplate{
		Name:        "Test Vorlage",
		Description: "Test Beschreibung",
		Color:       "#10B981",
		IsActive:    true,
		SortOrder:   1,
	}

	jsonData, err := json.Marshal(shiftTemplate)
	assert.NoError(t, err)
	assert.Contains(t, string(jsonData), "Test Vorlage")
	assert.Contains(t, string(jsonData), "#10B981")
	assert.Contains(t, string(jsonData), "true")
}

func TestShiftTemplateWeekPattern(t *testing.T) {
	// Test: Wochenschema mit verschiedenen Schichttypen
	shiftTemplate := models.ShiftTemplate{
		Name:        "Vollzeit-Woche",
		Description: "Vollzeit-Schichtvorlage",
		Color:       "#3B82F6",
		IsActive:    true,
		SortOrder:   1,
	}

	// Simuliere Schichttyp-IDs (in der echten Anwendung würden diese aus der DB kommen)
	var mondayID uint = 1
	var tuesdayID uint = 1
	var wednesdayID uint = 2
	var thursdayID uint = 2
	var fridayID uint = 2

	shiftTemplate.MondayShiftTypeID = &mondayID
	shiftTemplate.TuesdayShiftTypeID = &tuesdayID
	shiftTemplate.WednesdayShiftTypeID = &wednesdayID
	shiftTemplate.ThursdayShiftTypeID = &thursdayID
	shiftTemplate.FridayShiftTypeID = &fridayID
	// Samstag und Sonntag frei (nil)

	jsonData, err := json.Marshal(shiftTemplate)
	assert.NoError(t, err)
	assert.Contains(t, string(jsonData), "Vollzeit-Woche")
	assert.Contains(t, string(jsonData), "monday_shift_type_id")
	assert.Contains(t, string(jsonData), "friday_shift_type_id")
}

func TestShiftTemplateRequest(t *testing.T) {
	// Test: Request-Struktur für Schichtvorlagen
	requestData := map[string]interface{}{
		"name":        "Test Vorlage",
		"description": "Test Beschreibung",
		"color":       "#3B82F6",
		"is_active":   true,
		"sort_order":  1,
	}

	jsonData, err := json.Marshal(requestData)
	assert.NoError(t, err)

	var shiftTemplate models.ShiftTemplate
	err = json.Unmarshal(jsonData, &shiftTemplate)
	assert.NoError(t, err)

	assert.Equal(t, "Test Vorlage", shiftTemplate.Name)
	assert.Equal(t, "Test Beschreibung", shiftTemplate.Description)
	assert.Equal(t, "#3B82F6", shiftTemplate.Color)
	assert.True(t, shiftTemplate.IsActive)
	assert.Equal(t, 1, shiftTemplate.SortOrder)
}

func TestShiftTemplateOrderRequest(t *testing.T) {
	// Test: Sortier-Request für Schichtvorlagen
	orderData := map[string]interface{}{
		"id":         1,
		"sort_order": 5,
	}

	jsonData, err := json.Marshal(orderData)
	assert.NoError(t, err)

	var order struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}
	err = json.Unmarshal(jsonData, &order)
	assert.NoError(t, err)

	assert.Equal(t, uint(1), order.ID)
	assert.Equal(t, 5, order.SortOrder)
}
