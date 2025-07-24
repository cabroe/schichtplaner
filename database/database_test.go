package database

import (
	"os"
	"testing"

	"schichtplaner/models"

	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// TestSuite führt alle Datenbanktests in der richtigen Reihenfolge aus
func TestSuite(t *testing.T) {
	t.Run("InitDatabase", TestInitDatabase)
	t.Run("SeedDatabase", TestSeedDatabase)
	t.Run("ResetDatabase", TestResetDatabase)
	t.Run("ResetAndSeedDatabase", TestResetAndSeedDatabase)
	t.Run("SeedDatabase_EmptyTables", TestSeedDatabase_EmptyTables)
	t.Run("ResetDatabase_EmptyTables", TestResetDatabase_EmptyTables)
	t.Run("ResetDatabase_AutoIncrement", TestResetDatabase_AutoIncrement)
	t.Run("CloseDatabase", TestCloseDatabase)
	t.Run("SeedDatabase_DetailedValidation", TestSeedDatabase_DetailedValidation)
	t.Run("DatabaseOperations_Integration", TestDatabaseOperations_Integration)
	t.Run("DatabaseFileOperations", TestDatabaseFileOperations)
	t.Run("DatabaseErrorHandling", TestDatabaseErrorHandling)
	t.Run("DatabaseDataIntegrity", TestDatabaseDataIntegrity)
}

// Hilfsfunktion: Setzt die globale DB-Variable auf eine In-Memory-DB
func setupTestDB(t *testing.T) {
	var err error
	DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	// Migration durchführen
	err = DB.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{}, &models.Team{}, &models.ShiftType{}, &models.ShiftTemplate{})
	assert.NoError(t, err)
}

func countAll(t *testing.T) (int64, int64, int64, int64) {
	var users, schedules, shifts, shiftTemplates int64
	assert.NoError(t, DB.Model(&models.User{}).Count(&users).Error)
	assert.NoError(t, DB.Model(&models.Schedule{}).Count(&schedules).Error)
	assert.NoError(t, DB.Model(&models.Shift{}).Count(&shifts).Error)
	assert.NoError(t, DB.Model(&models.ShiftTemplate{}).Count(&shiftTemplates).Error)
	return users, schedules, shifts, shiftTemplates
}

func TestSeedDatabase(t *testing.T) {
	setupTestDB(t)

	err := SeedDatabase()
	assert.NoError(t, err)

	users, schedules, shifts, shiftTemplates := countAll(t)
	assert.Equal(t, int64(5), users, "Es sollten 5 User angelegt werden")
	assert.Equal(t, int64(3), schedules, "Es sollten 3 Schedules angelegt werden")
	assert.Equal(t, int64(8), shifts, "Es sollten 8 Shifts angelegt werden")
	assert.Equal(t, int64(4), shiftTemplates, "Es sollten 4 Schichtvorlagen angelegt werden")

	// Prüfe, ob ein Admin-User existiert
	var admin models.User
	err = DB.Where("username = ?", "admin").First(&admin).Error
	assert.NoError(t, err)
	assert.Equal(t, "admin@schichtplaner.de", admin.Email)
}

func TestResetDatabase(t *testing.T) {
	setupTestDB(t)
	// Erst seed, dann reset
	assert.NoError(t, SeedDatabase())
	assert.NoError(t, ResetDatabase())

	users, schedules, shifts, shiftTemplates := countAll(t)
	assert.Equal(t, int64(0), users, "Alle User sollten gelöscht sein")
	assert.Equal(t, int64(0), schedules, "Alle Schedules sollten gelöscht sein")
	assert.Equal(t, int64(0), shifts, "Alle Shifts sollten gelöscht sein")
	assert.Equal(t, int64(0), shiftTemplates, "Alle Schichtvorlagen sollten gelöscht sein")
}

func TestResetAndSeedDatabase(t *testing.T) {
	setupTestDB(t)
	// Erst seed, dann reset+seed
	assert.NoError(t, SeedDatabase())
	assert.NoError(t, ResetAndSeedDatabase())

	users, schedules, shifts, shiftTemplates := countAll(t)
	assert.Equal(t, int64(5), users)
	assert.Equal(t, int64(3), schedules)
	assert.Equal(t, int64(8), shifts)
	assert.Equal(t, int64(4), shiftTemplates)
}

func TestSeedDatabase_EmptyTables(t *testing.T) {
	setupTestDB(t)
	// Seed sollte auch funktionieren, wenn Tabellen leer sind
	assert.NoError(t, SeedDatabase())
	// Nochmal seeden sollte jetzt funktionieren (da Duplikate vermieden werden)
	err := SeedDatabase()
	assert.NoError(t, err, "Doppeltes Seeden sollte jetzt funktionieren")
}

func TestResetDatabase_EmptyTables(t *testing.T) {
	setupTestDB(t)
	// Reset auf leere Tabellen sollte keinen Fehler werfen
	assert.NoError(t, ResetDatabase())
}

// Optional: Teste, ob nach Reset die Auto-Increment-IDs wieder bei 1 starten
func TestResetDatabase_AutoIncrement(t *testing.T) {
	setupTestDB(t)
	assert.NoError(t, SeedDatabase())
	assert.NoError(t, ResetDatabase())
	// Neuen User anlegen
	user := models.User{
		Username:      "neuer.user",
		Email:         "neu@schichtplaner.de",
		Password:      "hashedpassword",
		AccountNumber: "EMP999",
		Name:          "Neu User",
		Color:         "#ff0000",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}
	assert.NoError(t, DB.Create(&user).Error)
	assert.Equal(t, uint(1), user.ID, "Nach Reset sollte die User-ID wieder bei 1 starten")
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

func TestSeedDatabase_DetailedValidation(t *testing.T) {
	setupTestDB(t)

	err := SeedDatabase()
	assert.NoError(t, err)

	// Prüfe spezifische User
	var admin models.User
	err = DB.Where("username = ?", "admin").First(&admin).Error
	assert.NoError(t, err)
	assert.Equal(t, "admin@schichtplaner.de", admin.Email)
	assert.Equal(t, "admin", admin.Role)
	assert.True(t, admin.IsActive)

	// Prüfe User - alle sind aktiv aufgrund des GORM Defaults
	var lisaUser models.User
	err = DB.Where("username = ?", "lisa.mueller").First(&lisaUser).Error
	assert.NoError(t, err)
	assert.True(t, lisaUser.IsActive) // GORM Default ist true

	// Prüfe Schedules - alle sind aktiv aufgrund des GORM Defaults
	var januarySchedule models.Schedule
	err = DB.Where("name = ?", "Januar 2024").First(&januarySchedule).Error
	assert.NoError(t, err)
	assert.True(t, januarySchedule.IsActive)

	var marchSchedule models.Schedule
	err = DB.Where("name = ?", "März 2024").First(&marchSchedule).Error
	assert.NoError(t, err)
	assert.True(t, marchSchedule.IsActive) // GORM Default ist true

	// Prüfe Shifts
	var shiftsCount int64
	DB.Model(&models.Shift{}).Where("description = ?", "Frühschicht").Count(&shiftsCount)
	assert.Equal(t, int64(3), shiftsCount, "Es sollten 3 Frühschichten geben")

	DB.Model(&models.Shift{}).Where("description = ?", "Spätschicht").Count(&shiftsCount)
	assert.Equal(t, int64(3), shiftsCount, "Es sollten 3 Spätschichten geben")
}

func TestDatabaseOperations_Integration(t *testing.T) {
	setupTestDB(t)

	// Teste vollständigen Workflow: Seed -> Reset -> Seed
	err := SeedDatabase()
	assert.NoError(t, err)

	users, schedules, shifts, shiftTemplates := countAll(t)
	assert.Equal(t, int64(5), users)
	assert.Equal(t, int64(3), schedules)
	assert.Equal(t, int64(8), shifts)
	assert.Equal(t, int64(4), shiftTemplates)

	// Reset
	err = ResetDatabase()
	assert.NoError(t, err)

	users, schedules, shifts, shiftTemplates = countAll(t)
	assert.Equal(t, int64(0), users)
	assert.Equal(t, int64(0), schedules)
	assert.Equal(t, int64(0), shifts)
	assert.Equal(t, int64(0), shiftTemplates)

	// Erneut Seed
	err = SeedDatabase()
	assert.NoError(t, err)

	users, schedules, shifts, shiftTemplates = countAll(t)
	assert.Equal(t, int64(5), users)
	assert.Equal(t, int64(3), schedules)
	assert.Equal(t, int64(8), shifts)
	assert.Equal(t, int64(4), shiftTemplates)
}

func TestDatabaseFileOperations(t *testing.T) {
	// Teste mit echter Datei-DB (nur wenn möglich)
	testDBPath := "test_schichtplaner.db"

	// Lösche Test-DB falls vorhanden
	os.Remove(testDBPath)

	// Erstelle temporäre DB
	var err error
	DB, err = gorm.Open(sqlite.Open(testDBPath), &gorm.Config{})
	assert.NoError(t, err)

	// Migration
	err = DB.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{}, &models.Team{}, &models.ShiftType{}, &models.ShiftTemplate{})
	assert.NoError(t, err)

	// Seed
	err = SeedDatabase()
	assert.NoError(t, err)

	// Prüfe, dass Daten erstellt wurden
	users, schedules, shifts, shiftTemplates := countAll(t)
	assert.Equal(t, int64(5), users)
	assert.Equal(t, int64(3), schedules)
	assert.Equal(t, int64(8), shifts)
	assert.Equal(t, int64(4), shiftTemplates)

	// Schließe DB
	CloseDatabase()

	// Lösche Test-DB
	os.Remove(testDBPath)
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

func TestDatabaseDataIntegrity(t *testing.T) {
	setupTestDB(t)

	err := SeedDatabase()
	assert.NoError(t, err)

	// Prüfe Referenzintegrität
	var shifts []models.Shift
	err = DB.Preload("User").Preload("Schedule").Find(&shifts).Error
	assert.NoError(t, err)

	for _, shift := range shifts {
		assert.NotNil(t, shift.User, "Shift sollte einen User haben")
		assert.NotNil(t, shift.Schedule, "Shift sollte einen Schedule haben")
		assert.NotZero(t, shift.UserID, "UserID sollte gesetzt sein")
		assert.NotZero(t, shift.ScheduleID, "ScheduleID sollte gesetzt sein")
	}

	// Prüfe Datenkonsistenz
	var users []models.User
	err = DB.Find(&users).Error
	assert.NoError(t, err)

	for _, user := range users {
		assert.NotEmpty(t, user.Username, "Username sollte nicht leer sein")
		assert.NotEmpty(t, user.Email, "Email sollte nicht leer sein")
		assert.NotEmpty(t, user.Name, "Name sollte nicht leer sein")
		assert.NotEmpty(t, user.AccountNumber, "AccountNumber sollte nicht leer sein")
		assert.NotEmpty(t, user.Role, "Role sollte nicht leer sein")
	}
}
