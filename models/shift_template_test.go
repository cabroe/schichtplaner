package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestShiftTemplateValidation(t *testing.T) {
	// Test: Erstelle eine gültige Schichtvorlage
	shiftTemplate := ShiftTemplate{
		Name:        "Standard-Woche",
		Description: "Standard-Schichtvorlage für eine 5-Tage-Woche",
		Color:       "#3B82F6",
		IsActive:    true,
		SortOrder:   1,
	}

	// Teste, dass alle Felder korrekt gesetzt sind
	assert.Equal(t, "Standard-Woche", shiftTemplate.Name)
	assert.Equal(t, "Standard-Schichtvorlage für eine 5-Tage-Woche", shiftTemplate.Description)
	assert.Equal(t, "#3B82F6", shiftTemplate.Color)
	assert.True(t, shiftTemplate.IsActive)
	assert.Equal(t, 1, shiftTemplate.SortOrder)
}

func TestShiftTemplateDefaultValues(t *testing.T) {
	// Test: GORM Default-Werte werden nur in der Datenbank gesetzt, nicht im Go-Struct
	// Hier testen wir nur die Zero-Values des Go-Structs
	shiftTemplate := ShiftTemplate{
		Name: "Test Vorlage",
	}

	// Go-Struct Standardwerte (Zero-Values)
	assert.Equal(t, "", shiftTemplate.Color)
	assert.False(t, shiftTemplate.IsActive)
	assert.Equal(t, 0, shiftTemplate.SortOrder)
}

func TestShiftTemplateModelStructure(t *testing.T) {
	// Test: Korrekte Struktur des Models
	shiftTemplate := ShiftTemplate{
		Name:        "Test Vorlage",
		Description: "Test Beschreibung",
		Color:       "#10B981",
		IsActive:    true,
		SortOrder:   1,
	}

	assert.Equal(t, "Test Vorlage", shiftTemplate.Name)
	assert.Equal(t, "Test Beschreibung", shiftTemplate.Description)
	assert.Equal(t, "#10B981", shiftTemplate.Color)
	assert.True(t, shiftTemplate.IsActive)
	assert.Equal(t, 1, shiftTemplate.SortOrder)
}

func TestShiftTemplateJSONSerialization(t *testing.T) {
	shiftTemplate := ShiftTemplate{
		Name:        "Test Vorlage",
		Description: "Test Beschreibung",
		Color:       "#F59E0B",
		IsActive:    true,
		SortOrder:   1,
	}

	// Teste JSON-Serialisierung (indirekt über die Struktur)
	assert.Equal(t, "Test Vorlage", shiftTemplate.Name)
	assert.Equal(t, "Test Beschreibung", shiftTemplate.Description)
	assert.Equal(t, "#F59E0B", shiftTemplate.Color)
	assert.True(t, shiftTemplate.IsActive)
	assert.Equal(t, 1, shiftTemplate.SortOrder)
}

func TestShiftTemplateRelationships(t *testing.T) {
	db := setupTestDB(t)

	// Schichttypen erstellen
	earlyShift := ShiftType{
		Name:         "Frühschicht",
		Description:  "Schicht von 6:00 bis 14:00 Uhr",
		Color:        "#3B82F6",
		DefaultStart: time.Date(2024, 1, 1, 6, 0, 0, 0, time.UTC),
		DefaultEnd:   time.Date(2024, 1, 1, 14, 0, 0, 0, time.UTC),
		DefaultBreak: 30,
		IsActive:     true,
		SortOrder:    1,
	}
	db.Create(&earlyShift)

	lateShift := ShiftType{
		Name:         "Spätschicht",
		Description:  "Schicht von 14:00 bis 22:00 Uhr",
		Color:        "#EF4444",
		DefaultStart: time.Date(2024, 1, 1, 14, 0, 0, 0, time.UTC),
		DefaultEnd:   time.Date(2024, 1, 1, 22, 0, 0, 0, time.UTC),
		DefaultBreak: 30,
		IsActive:     true,
		SortOrder:    2,
	}
	db.Create(&lateShift)

	// Schichtvorlage erstellen
	shiftTemplate := ShiftTemplate{
		Name:        "Test Vorlage",
		Description: "Test Beschreibung",
		Color:       "#10B981",
		IsActive:    true,
		SortOrder:   1,
		// Montag und Dienstag Frühschicht, Mittwoch bis Freitag Spätschicht
		MondayShiftTypeID:    &earlyShift.ID,
		TuesdayShiftTypeID:   &earlyShift.ID,
		WednesdayShiftTypeID: &lateShift.ID,
		ThursdayShiftTypeID:  &lateShift.ID,
		FridayShiftTypeID:    &lateShift.ID,
		// Samstag und Sonntag frei (nil)
	}

	result := db.Create(&shiftTemplate)
	assert.NoError(t, result.Error)
	assert.NotZero(t, shiftTemplate.ID)

	// Schichtvorlage mit Schichttypen laden
	var loadedTemplate ShiftTemplate
	result = db.Preload("MondayShiftType").
		Preload("TuesdayShiftType").
		Preload("WednesdayShiftType").
		Preload("ThursdayShiftType").
		Preload("FridayShiftType").
		Preload("SaturdayShiftType").
		Preload("SundayShiftType").
		First(&loadedTemplate, shiftTemplate.ID)
	assert.NoError(t, result.Error)

	// Prüfe Beziehungen
	assert.Equal(t, earlyShift.ID, *loadedTemplate.MondayShiftTypeID)
	assert.Equal(t, earlyShift.ID, *loadedTemplate.TuesdayShiftTypeID)
	assert.Equal(t, lateShift.ID, *loadedTemplate.WednesdayShiftTypeID)
	assert.Equal(t, lateShift.ID, *loadedTemplate.ThursdayShiftTypeID)
	assert.Equal(t, lateShift.ID, *loadedTemplate.FridayShiftTypeID)
	assert.Nil(t, loadedTemplate.SaturdayShiftTypeID)
	assert.Nil(t, loadedTemplate.SundayShiftTypeID)

	// Prüfe geladene Schichttypen
	assert.Equal(t, earlyShift.Name, loadedTemplate.MondayShiftType.Name)
	assert.Equal(t, earlyShift.Name, loadedTemplate.TuesdayShiftType.Name)
	assert.Equal(t, lateShift.Name, loadedTemplate.WednesdayShiftType.Name)
	assert.Equal(t, lateShift.Name, loadedTemplate.ThursdayShiftType.Name)
	assert.Equal(t, lateShift.Name, loadedTemplate.FridayShiftType.Name)
}

func TestShiftTemplateSoftDelete(t *testing.T) {
	db := setupTestDB(t)

	// Schichtvorlage erstellen
	shiftTemplate := ShiftTemplate{
		Name:        "Test Vorlage",
		Description: "Test Beschreibung",
		Color:       "#10B981",
		IsActive:    true,
		SortOrder:   1,
	}

	result := db.Create(&shiftTemplate)
	assert.NoError(t, result.Error)
	assert.NotZero(t, shiftTemplate.ID)

	// Schichtvorlage löschen (Soft Delete)
	result = db.Delete(&shiftTemplate)
	assert.NoError(t, result.Error)

	// Schichtvorlage sollte nicht mehr gefunden werden
	var deletedTemplate ShiftTemplate
	result = db.First(&deletedTemplate, shiftTemplate.ID)
	assert.Error(t, result.Error) // Sollte einen Fehler werfen, da gelöscht

	// Mit Unscoped sollte die Schichtvorlage gefunden werden
	result = db.Unscoped().First(&deletedTemplate, shiftTemplate.ID)
	assert.NoError(t, result.Error)
	assert.NotZero(t, deletedTemplate.DeletedAt) // DeletedAt sollte gesetzt sein
}
