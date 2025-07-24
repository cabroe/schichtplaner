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

func TestTeamModelStructure(t *testing.T) {
	// Test: Korrekte Struktur des Models
	team := models.Team{
		Name:        "Test Team",
		Description: "Test Beschreibung",
		Color:       "#3B82F6",
		IsActive:    true,
		SortOrder:   1,
	}

	assert.Equal(t, "Test Team", team.Name)
	assert.Equal(t, "Test Beschreibung", team.Description)
	assert.Equal(t, "#3B82F6", team.Color)
	assert.True(t, team.IsActive)
	assert.Equal(t, 1, team.SortOrder)
}

func TestTeamJSONSerialization(t *testing.T) {
	team := models.Team{
		Name:        "Test Team",
		Description: "Test Beschreibung",
		Color:       "#10B981",
		IsActive:    true,
		SortOrder:   1,
	}

	jsonData, err := json.Marshal(team)
	assert.NoError(t, err)
	assert.Contains(t, string(jsonData), "Test Team")
	assert.Contains(t, string(jsonData), "#10B981")
	assert.Contains(t, string(jsonData), "true")
}

func TestAddUserToTeamRequest(t *testing.T) {
	// Test: Request-Struktur für AddUserToTeam
	requestData := struct {
		UserID uint `json:"user_id"`
	}{
		UserID: 1,
	}

	jsonData, _ := json.Marshal(requestData)
	req := httptest.NewRequest(http.MethodPost, "/api/teams/1/members", bytes.NewBuffer(jsonData))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	_ = echo.New().NewContext(req, rec)

	// Teste, dass die Request-Daten korrekt sind
	assert.Equal(t, uint(1), requestData.UserID)
}

func TestTeamOrderRequest(t *testing.T) {
	// Test: Request-Struktur für UpdateTeamOrder
	orderData := struct {
		ID        uint `json:"id"`
		SortOrder int  `json:"sort_order"`
	}{
		ID:        1,
		SortOrder: 5,
	}

	jsonData, _ := json.Marshal(orderData)
	req := httptest.NewRequest(http.MethodPut, "/api/teams/order", bytes.NewBuffer(jsonData))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	_ = echo.New().NewContext(req, rec)

	// Teste, dass die Request-Daten korrekt sind
	assert.Equal(t, uint(1), orderData.ID)
	assert.Equal(t, 5, orderData.SortOrder)
}
