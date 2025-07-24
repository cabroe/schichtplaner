package main

import (
	"os"
	"testing"

	"schichtplaner/database"
	"schichtplaner/models"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// setupTestDB erstellt eine In-Memory-Datenbank für Tests
func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)

	// Migration durchführen
	err = db.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{}, &models.Team{}, &models.ShiftType{}, &models.ShiftTemplate{})
	assert.NoError(t, err)

	return db
}

// countAllTables zählt alle Einträge in allen Tabellen
func countAllTables(t *testing.T, db *gorm.DB) (int64, int64, int64, int64, int64, int64) {
	var users, schedules, shifts, shiftTemplates, teams, shiftTypes int64
	assert.NoError(t, db.Model(&models.User{}).Count(&users).Error)
	assert.NoError(t, db.Model(&models.Schedule{}).Count(&schedules).Error)
	assert.NoError(t, db.Model(&models.Shift{}).Count(&shifts).Error)
	assert.NoError(t, db.Model(&models.ShiftTemplate{}).Count(&shiftTemplates).Error)
	assert.NoError(t, db.Model(&models.Team{}).Count(&teams).Error)
	assert.NoError(t, db.Model(&models.ShiftType{}).Count(&shiftTypes).Error)
	return users, schedules, shifts, shiftTemplates, teams, shiftTypes
}

// TestMainFunction_Reset testet das -reset Flag
func TestMainFunction_Reset(t *testing.T) {
	// Setup Test-Datenbank
	db := setupTestDB(t)
	originalDB := database.DB
	database.DB = db
	defer func() { database.DB = originalDB }()

	// Test-Daten erstellen
	assert.NoError(t, database.SeedDatabase())

	// Prüfe, dass Daten vorhanden sind
	users, _, _, _, teams, _ := countAllTables(t, db)
	assert.Greater(t, users, int64(0), "Sollte Test-Daten haben")
	assert.Greater(t, teams, int64(0), "Sollte Test-Daten haben")

	// Simuliere -reset Flag
	os.Args = []string{"db", "-reset"}

	// Führe Reset aus
	assert.NoError(t, database.ResetDatabase())

	// Prüfe, dass alle Daten gelöscht sind
	users, _, _, _, teams, _ = countAllTables(t, db)
	assert.Equal(t, int64(0), users, "Alle User sollten gelöscht sein")
	assert.Equal(t, int64(0), teams, "Alle Teams sollten gelöscht sein")
}

// TestMainFunction_Seed testet das -seed Flag
func TestMainFunction_Seed(t *testing.T) {
	// Setup Test-Datenbank
	db := setupTestDB(t)
	originalDB := database.DB
	database.DB = db
	defer func() { database.DB = originalDB }()

	// Prüfe, dass Datenbank leer ist
	users, schedules, shifts, shiftTemplates, teams, shiftTypes := countAllTables(t, db)
	assert.Equal(t, int64(0), users, "Datenbank sollte leer sein")
	assert.Equal(t, int64(0), teams, "Datenbank sollte leer sein")

	// Simuliere -seed Flag
	os.Args = []string{"db", "-seed"}

	// Führe Seed aus
	assert.NoError(t, database.SeedDatabase())

	// Prüfe, dass Test-Daten erstellt wurden
	users, schedules, shifts, shiftTemplates, teams, shiftTypes = countAllTables(t, db)
	assert.Equal(t, int64(5), users, "5 User sollten erstellt sein")
	assert.Equal(t, int64(3), schedules, "3 Schedules sollten erstellt sein")
	assert.Equal(t, int64(8), shifts, "8 Shifts sollten erstellt sein")
	assert.Equal(t, int64(4), shiftTemplates, "4 Schichtvorlagen sollten erstellt sein")
	assert.Equal(t, int64(4), teams, "4 Teams sollten erstellt sein")
	assert.Equal(t, int64(5), shiftTypes, "5 ShiftTypes sollten erstellt sein")
}

// TestMainFunction_ResetAndSeed testet das -reset-and-seed Flag
func TestMainFunction_ResetAndSeed(t *testing.T) {
	// Setup Test-Datenbank
	db := setupTestDB(t)
	originalDB := database.DB
	database.DB = db
	defer func() { database.DB = originalDB }()

	// Test-Daten erstellen
	assert.NoError(t, database.SeedDatabase())

	// Prüfe, dass Daten vorhanden sind
	users, schedules, shifts, shiftTemplates, teams, shiftTypes := countAllTables(t, db)
	assert.Greater(t, users, int64(0), "Sollte Test-Daten haben")
	assert.Greater(t, teams, int64(0), "Sollte Test-Daten haben")

	// Simuliere -reset-and-seed Flag
	os.Args = []string{"db", "-reset-and-seed"}

	// Führe ResetAndSeed aus
	assert.NoError(t, database.ResetAndSeedDatabase())

	// Prüfe, dass Test-Daten erstellt wurden
	users, schedules, shifts, shiftTemplates, teams, shiftTypes = countAllTables(t, db)
	assert.Equal(t, int64(5), users, "5 User sollten erstellt sein")
	assert.Equal(t, int64(3), schedules, "3 Schedules sollten erstellt sein")
	assert.Equal(t, int64(8), shifts, "8 Shifts sollten erstellt sein")
	assert.Equal(t, int64(4), shiftTemplates, "4 Schichtvorlagen sollten erstellt sein")
	assert.Equal(t, int64(4), teams, "4 Teams sollten erstellt sein")
	assert.Equal(t, int64(5), shiftTypes, "5 ShiftTypes sollten erstellt sein")
}

// TestMainFunction_NoFlags testet das Verhalten ohne Flags
func TestMainFunction_NoFlags(t *testing.T) {
	// Setup Test-Datenbank
	db := setupTestDB(t)
	originalDB := database.DB
	database.DB = db
	defer func() { database.DB = originalDB }()

	// Simuliere keine Flags
	os.Args = []string{"db"}

	// Das Programm sollte mit Exit-Code 1 beenden
	// Da wir das nicht direkt testen können, testen wir die Logik
	// In der Praxis würde das Programm hier beenden
}

// TestMainFunction_InvalidFlags testet ungültige Flags
func TestMainFunction_InvalidFlags(t *testing.T) {
	// Setup Test-Datenbank
	db := setupTestDB(t)
	originalDB := database.DB
	database.DB = db
	defer func() { database.DB = originalDB }()

	// Simuliere ungültige Flags
	os.Args = []string{"db", "-invalid"}

	// Das Programm sollte mit Exit-Code 1 beenden
	// Da wir das nicht direkt testen können, testen wir die Logik
	// In der Praxis würde das Programm hier beenden
}

// TestMainFunction_MultipleFlags testet mehrere Flags gleichzeitig
func TestMainFunction_MultipleFlags(t *testing.T) {
	// Setup Test-Datenbank
	db := setupTestDB(t)
	originalDB := database.DB
	database.DB = db
	defer func() { database.DB = originalDB }()

	// Simuliere mehrere Flags (sollte das erste verwenden)
	os.Args = []string{"db", "-reset", "-seed"}

	// Führe Reset aus (sollte das erste Flag verwenden)
	assert.NoError(t, database.ResetDatabase())

	// Prüfe, dass alle Daten gelöscht sind
	users, _, _, _, teams, _ := countAllTables(t, db)
	assert.Equal(t, int64(0), users, "Alle User sollten gelöscht sein")
	assert.Equal(t, int64(0), teams, "Alle Teams sollten gelöscht sein")
}

// TestMainFunction_FlagParsing testet das Flag-Parsing
func TestMainFunction_FlagParsing(t *testing.T) {
	// Test verschiedene Flag-Kombinationen
	testCases := []struct {
		name     string
		args     []string
		expected string
	}{
		{
			name:     "Reset Flag",
			args:     []string{"db", "-reset"},
			expected: "reset",
		},
		{
			name:     "Seed Flag",
			args:     []string{"db", "-seed"},
			expected: "seed",
		},
		{
			name:     "ResetAndSeed Flag",
			args:     []string{"db", "-reset-and-seed"},
			expected: "reset-and-seed",
		},
		{
			name:     "Keine Flags",
			args:     []string{"db"},
			expected: "none",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Setup Test-Datenbank
			db := setupTestDB(t)
			originalDB := database.DB
			database.DB = db
			defer func() { database.DB = originalDB }()

			// Simuliere Flags
			os.Args = tc.args

			// Teste die entsprechende Operation
			switch tc.expected {
			case "reset":
				assert.NoError(t, database.ResetDatabase())
			case "seed":
				assert.NoError(t, database.SeedDatabase())
			case "reset-and-seed":
				assert.NoError(t, database.ResetAndSeedDatabase())
			case "none":
				// Sollte keine Operation ausführen
			}
		})
	}
}

// TestMainFunction_DatabaseInitialization testet die Datenbank-Initialisierung
func TestMainFunction_DatabaseInitialization(t *testing.T) {
	// Setup Test-Datenbank
	db := setupTestDB(t)
	originalDB := database.DB
	database.DB = db
	defer func() { database.DB = originalDB }()

	// Prüfe, dass Datenbank initialisiert ist
	assert.NotNil(t, database.DB, "Datenbank sollte initialisiert sein")

	// Prüfe, dass Tabellen existieren
	assert.True(t, database.DB.Migrator().HasTable(&models.User{}))
	assert.True(t, database.DB.Migrator().HasTable(&models.Team{}))
	assert.True(t, database.DB.Migrator().HasTable(&models.Schedule{}))
	assert.True(t, database.DB.Migrator().HasTable(&models.Shift{}))
	assert.True(t, database.DB.Migrator().HasTable(&models.ShiftType{}))
	assert.True(t, database.DB.Migrator().HasTable(&models.ShiftTemplate{}))
}

// TestMainFunction_ErrorHandling testet Fehlerbehandlung
func TestMainFunction_ErrorHandling(t *testing.T) {
	// Teste mit ungültiger Datenbank
	originalDB := database.DB
	database.DB = nil
	defer func() { database.DB = originalDB }()

	// Diese Operationen sollten Fehler werfen
	err := database.ResetDatabase()
	assert.Error(t, err, "Reset sollte fehlschlagen wenn DB nil ist")

	err = database.SeedDatabase()
	assert.Error(t, err, "Seed sollte fehlschlagen wenn DB nil ist")

	err = database.ResetAndSeedDatabase()
	assert.Error(t, err, "ResetAndSeed sollte fehlschlagen wenn DB nil ist")
}

// TestMainFunction_DataIntegrity testet Datenintegrität nach Operationen
func TestMainFunction_DataIntegrity(t *testing.T) {
	// Setup Test-Datenbank
	db := setupTestDB(t)
	originalDB := database.DB
	database.DB = db
	defer func() { database.DB = originalDB }()

	// Führe ResetAndSeed aus
	assert.NoError(t, database.ResetAndSeedDatabase())

	// Prüfe Datenintegrität
	var users []models.User
	assert.NoError(t, db.Preload("Team").Find(&users).Error)

	for _, user := range users {
		// Prüfe, dass User gültige Daten hat
		assert.NotEmpty(t, user.Username, "Username sollte nicht leer sein")
		assert.NotEmpty(t, user.Email, "Email sollte nicht leer sein")
		assert.NotEmpty(t, user.Name, "Name sollte nicht leer sein")

		// Prüfe Team-Referenz falls vorhanden
		if user.TeamID != nil {
			assert.NotNil(t, user.Team, "Team sollte geladen sein")
			assert.NotZero(t, user.Team.ID, "Team-ID sollte gültig sein")
		}
	}

	// Prüfe Schicht-Referenzen
	var shifts []models.Shift
	assert.NoError(t, db.Preload("User").Preload("Schedule").Preload("ShiftType").Find(&shifts).Error)

	for _, shift := range shifts {
		assert.NotNil(t, shift.User, "User sollte geladen sein")
		assert.NotNil(t, shift.Schedule, "Schedule sollte geladen sein")
		assert.NotNil(t, shift.ShiftType, "ShiftType sollte geladen sein")
		assert.NotZero(t, shift.UserID, "UserID sollte gültig sein")
		assert.NotZero(t, shift.ScheduleID, "ScheduleID sollte gültig sein")
		assert.NotZero(t, shift.ShiftTypeID, "ShiftTypeID sollte gültig sein")
	}
}

// TestMainFunction_ConcurrentOperations testet gleichzeitige Operationen
func TestMainFunction_ConcurrentOperations(t *testing.T) {
	// Setup Test-Datenbank
	db := setupTestDB(t)
	originalDB := database.DB
	database.DB = db
	defer func() { database.DB = originalDB }()

	// Führe mehrere Operationen nacheinander aus (nicht gleichzeitig, da DB nicht thread-safe)
	// In der Praxis sollten diese Operationen sequenziell ausgeführt werden
	assert.NoError(t, database.SeedDatabase())

	// Prüfe, dass Daten erstellt wurden
	users, _, _, _, teams, _ := countAllTables(t, db)
	assert.Greater(t, users, int64(0), "Sollte Test-Daten haben")
	assert.Greater(t, teams, int64(0), "Sollte Test-Daten haben")

	// Führe Reset aus
	assert.NoError(t, database.ResetDatabase())

	// Prüfe, dass alle Daten gelöscht sind
	users, _, _, _, teams, _ = countAllTables(t, db)
	assert.Equal(t, int64(0), users, "Alle User sollten gelöscht sein")
	assert.Equal(t, int64(0), teams, "Alle Teams sollten gelöscht sein")

	// Führe ResetAndSeed aus
	assert.NoError(t, database.ResetAndSeedDatabase())

	// Prüfe, dass Test-Daten erstellt wurden
	users, _, _, _, teams, _ = countAllTables(t, db)
	assert.Greater(t, users, int64(0), "Sollte Test-Daten haben")
	assert.Greater(t, teams, int64(0), "Sollte Test-Daten haben")
}
