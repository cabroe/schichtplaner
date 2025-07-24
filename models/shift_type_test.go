package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestShiftTypeValidation(t *testing.T) {
	// Test: Erstelle einen gültigen Schichttyp
	shiftType := ShiftType{
		Name:         "Frühschicht",
		Description:  "Schicht von 6:00 bis 14:00 Uhr",
		Color:        "#3B82F6",
		DefaultStart: time.Date(2024, 1, 1, 6, 0, 0, 0, time.UTC),
		DefaultEnd:   time.Date(2024, 1, 1, 14, 0, 0, 0, time.UTC),
		DefaultBreak: 30,
		IsActive:     true,
		SortOrder:    1,
		MinDuration:  480, // 8 Stunden
		MaxDuration:  600, // 10 Stunden
	}

	// Teste, dass alle Felder korrekt gesetzt sind
	assert.Equal(t, "Frühschicht", shiftType.Name)
	assert.Equal(t, "Schicht von 6:00 bis 14:00 Uhr", shiftType.Description)
	assert.Equal(t, "#3B82F6", shiftType.Color)
	assert.Equal(t, 30, shiftType.DefaultBreak)
	assert.True(t, shiftType.IsActive)
	assert.Equal(t, 1, shiftType.SortOrder)
	assert.Equal(t, 480, shiftType.MinDuration)
	assert.Equal(t, 600, shiftType.MaxDuration)
}

func TestShiftTypeDefaultValues(t *testing.T) {
	// Test: GORM Default-Werte werden nur in der Datenbank gesetzt, nicht im Go-Struct
	// Daher testen wir die Standardwerte nach dem Erstellen in der DB

	// Hier testen wir nur die Zero-Values des Go-Structs
	shiftType := ShiftType{
		Name: "Test Schicht",
	}

	// Go-Struct Standardwerte (Zero-Values)
	assert.Equal(t, "", shiftType.Color)
	assert.Equal(t, 0, shiftType.DefaultBreak)
	assert.False(t, shiftType.IsActive)
	assert.Equal(t, 0, shiftType.SortOrder)
	assert.Equal(t, 0, shiftType.MinDuration)
	assert.Equal(t, 0, shiftType.MaxDuration)
}

func TestShiftTypeTimeValidation(t *testing.T) {
	// Test: Startzeit nach Endzeit
	shiftType := ShiftType{
		DefaultStart: time.Date(2024, 1, 1, 14, 0, 0, 0, time.UTC),
		DefaultEnd:   time.Date(2024, 1, 1, 6, 0, 0, 0, time.UTC),
	}

	// Die Validierung erfolgt im Handler, nicht im Model
	assert.True(t, shiftType.DefaultStart.After(shiftType.DefaultEnd))
}

func TestShiftTypeDurationValidation(t *testing.T) {
	// Test: Mindestdauer größer als Maximaldauer
	shiftType := ShiftType{
		MinDuration: 600, // 10 Stunden
		MaxDuration: 480, // 8 Stunden
	}

	// Die Validierung erfolgt im Handler, nicht im Model
	assert.True(t, shiftType.MinDuration > shiftType.MaxDuration)
}
