package database

import (
	"testing"

	"schichtplaner/models"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Hilfsfunktion: Setzt die globale DB-Variable auf eine In-Memory-DB
func setupTestDB(t *testing.T) {
	var err error
	DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	// Migration durchführen
	err = DB.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{})
	assert.NoError(t, err)
}

func countAll(t *testing.T) (int64, int64, int64) {
	var users, schedules, shifts int64
	assert.NoError(t, DB.Model(&models.User{}).Count(&users).Error)
	assert.NoError(t, DB.Model(&models.Schedule{}).Count(&schedules).Error)
	assert.NoError(t, DB.Model(&models.Shift{}).Count(&shifts).Error)
	return users, schedules, shifts
}

func TestSeedDatabase(t *testing.T) {
	setupTestDB(t)

	err := SeedDatabase()
	assert.NoError(t, err)

	users, schedules, shifts := countAll(t)
	assert.Equal(t, int64(5), users, "Es sollten 5 User angelegt werden")
	assert.Equal(t, int64(3), schedules, "Es sollten 3 Schedules angelegt werden")
	assert.Equal(t, int64(6), shifts, "Es sollten 6 Shifts angelegt werden")

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

	users, schedules, shifts := countAll(t)
	assert.Equal(t, int64(0), users, "Alle User sollten gelöscht sein")
	assert.Equal(t, int64(0), schedules, "Alle Schedules sollten gelöscht sein")
	assert.Equal(t, int64(0), shifts, "Alle Shifts sollten gelöscht sein")
}

func TestResetAndSeedDatabase(t *testing.T) {
	setupTestDB(t)
	// Erst seed, dann reset+seed
	assert.NoError(t, SeedDatabase())
	assert.NoError(t, ResetAndSeedDatabase())

	users, schedules, shifts := countAll(t)
	assert.Equal(t, int64(5), users)
	assert.Equal(t, int64(3), schedules)
	assert.Equal(t, int64(6), shifts)
}

func TestSeedDatabase_EmptyTables(t *testing.T) {
	setupTestDB(t)
	// Seed sollte auch funktionieren, wenn Tabellen leer sind
	assert.NoError(t, SeedDatabase())
	// Nochmal seeden sollte wegen Unique-Constraints fehlschlagen
	err := SeedDatabase()
	assert.Error(t, err, "Doppeltes Seeden sollte einen Fehler werfen")
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
		Username:  "neuer.user",
		Email:     "neu@schichtplaner.de",
		FirstName: "Neu",
		LastName:  "User",
		IsActive:  true,
		Role:      "user",
	}
	assert.NoError(t, DB.Create(&user).Error)
	assert.Equal(t, uint(1), user.ID, "Nach Reset sollte die User-ID wieder bei 1 starten")
}
