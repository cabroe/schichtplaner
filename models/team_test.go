package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTeamValidation(t *testing.T) {
	// Test: Erstelle einen gültigen Team
	team := Team{
		Name:        "Entwicklungsteam",
		Description: "Team für Software-Entwicklung",
		Color:       "#3B82F6",
		IsActive:    true,
		SortOrder:   1,
	}

	// Teste, dass alle Felder korrekt gesetzt sind
	assert.Equal(t, "Entwicklungsteam", team.Name)
	assert.Equal(t, "Team für Software-Entwicklung", team.Description)
	assert.Equal(t, "#3B82F6", team.Color)
	assert.True(t, team.IsActive)
	assert.Equal(t, 1, team.SortOrder)
}

func TestTeamDefaultValues(t *testing.T) {
	// Test: GORM Default-Werte werden nur in der Datenbank gesetzt, nicht im Go-Struct
	// Hier testen wir die Zero-Values des Go-Structs
	team := Team{
		Name: "Test Team",
	}

	// Go-Struct Standardwerte (Zero-Values)
	assert.Equal(t, "", team.Color)
	assert.False(t, team.IsActive)
	assert.Equal(t, 0, team.SortOrder)
}

func TestTeamModelStructure(t *testing.T) {
	// Test: Korrekte Struktur des Models
	team := Team{
		Name:        "Test Team",
		Description: "Test Beschreibung",
		Color:       "#10B981",
		IsActive:    true,
		SortOrder:   1,
	}

	assert.Equal(t, "Test Team", team.Name)
	assert.Equal(t, "Test Beschreibung", team.Description)
	assert.Equal(t, "#10B981", team.Color)
	assert.True(t, team.IsActive)
	assert.Equal(t, 1, team.SortOrder)
}
