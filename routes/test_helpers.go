package routes

import (
	"testing"

	"schichtplaner/database"
	"schichtplaner/models"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// setupTestDB initialisiert eine In-Memory-Datenbank für Tests
func setupTestDB(t *testing.T) {
	var err error
	// Verwende In-Memory SQLite für Tests
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)

	// Migration durchführen
	err = database.DB.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{})
	assert.NoError(t, err)
}

// cleanupTestDB bereinigt die Test-Datenbank
func cleanupTestDB() {
	if database.DB != nil {
		sqlDB, err := database.DB.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
}
