package database

import (
	"testing"

	"schichtplaner/models"

	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// Hilfsfunktion: Setzt die globale DB-Variable auf eine In-Memory-DB
func setupTestDB(t *testing.T) {
	var err error
	DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	// Migration durchführen
	err = DB.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{}, &models.Team{}, &models.ShiftType{}, &models.ShiftTemplate{})
	assert.NoError(t, err)
}

// Neue Tests für erweiterte Funktionalität

func TestInitDatabase(t *testing.T) {
	// Test mit In-Memory-DB
	var err error
	DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)

	// Migration sollte funktionieren
	err = DB.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{}, &models.Team{}, &models.ShiftType{}, &models.ShiftTemplate{})
	assert.NoError(t, err)

	// Prüfe, ob Tabellen existieren
	assert.True(t, DB.Migrator().HasTable(&models.User{}))
	assert.True(t, DB.Migrator().HasTable(&models.Schedule{}))
	assert.True(t, DB.Migrator().HasTable(&models.Shift{}))
	assert.True(t, DB.Migrator().HasTable(&models.ShiftTemplate{}))
}

func TestCloseDatabase(t *testing.T) {
	setupTestDB(t)

	// Datenbank sollte geöffnet sein
	assert.NotNil(t, DB)

	// Schließen sollte funktionieren
	CloseDatabase()

	// Nach dem Schließen sollte DB noch gesetzt sein, aber die Verbindung geschlossen
	assert.NotNil(t, DB)
}

func TestDatabaseErrorHandling(t *testing.T) {
	// Teste mit ungültiger DB-Verbindung
	originalDB := DB
	DB = nil

	// Diese Operationen sollten Fehler werfen
	err := ResetDatabase()
	assert.Error(t, err, "Reset sollte fehlschlagen wenn DB nil ist")

	err = SeedDatabase()
	assert.Error(t, err, "Seed sollte fehlschlagen wenn DB nil ist")

	err = ResetAndSeedDatabase()
	assert.Error(t, err, "ResetAndSeed sollte fehlschlagen wenn DB nil ist")

	// Stelle DB wieder her
	DB = originalDB
}
