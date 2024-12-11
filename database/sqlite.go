package database

import (
	"errors"
	"os"
	"testing"

	"github.com/glebarez/sqlite"
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/models"
	"gorm.io/gorm"
)

// Globale Datenbankinstanz
var db *gorm.DB

// GetDB gibt die aktuelle Datenbankinstanz zurück
func GetDB() *gorm.DB {
	return db
}

// SetDB setzt eine neue Datenbankinstanz
// Wird hauptsächlich für Tests verwendet
func SetDB(database *gorm.DB) {
	db = database
}

// ValidateConnection prüft die Datenbankverbindung
// Gibt einen Fehler zurück, wenn die Verbindung nicht möglich ist
func ValidateConnection() error {
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
}

// SetupTestDB erstellt eine physische Testdatenbank
// Wird für Integrationstests verwendet
func SetupTestDB(t *testing.T, entities ...interface{}) *fiber.App {
	// Testdatenbank-Pfad aus Umgebungsvariablen oder Standard
	testDbPath := os.Getenv("SQLITE_TEST_DB_PATH")
	if testDbPath == "" {
		testDbPath = "schichtplaner_test.db"
	}

	// Neue Datenbankverbindung öffnen
	db, err := gorm.Open(sqlite.Open(testDbPath), &gorm.Config{})
	if err != nil {
		t.Fatalf("Fehler beim Verbinden zur Testdatenbank: %v", err)
	}

	// Automatische Migration der Entitäten
	db.AutoMigrate(entities...)
	SetDB(db)

	return fiber.New()
}

// StartDB initialisiert die Hauptdatenbankverbindung
func StartDB() error {
	// Datenbank-Pfad aus Umgebungsvariablen oder Standard
	dbPath := os.Getenv("SQLITE_DB_PATH")
	if dbPath == "" {
		dbPath = "schichtplaner.db"
	}

	// Neue Datenbankverbindung öffnen
	var err error
	db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return errors.New("Fehler beim Öffnen der SQLite Datenbank: " + err.Error())
	}

	return nil
}

// CloseDB schließt die aktuelle Datenbankverbindung sicher
func CloseDB() {
	if db != nil {
		sqlDB, err := db.DB()
		if err != nil {
			panic(err)
		}
		err = sqlDB.Close()
		if err != nil {
			panic(err)
		}
	}
}

// AutoMigrate führt die Datenbankmigrationen für alle Modelle durch
func AutoMigrate() error {
	err := db.AutoMigrate(
		&models.Department{},
		&models.User{},
		&models.ShiftType{},
		&models.ShiftWeek{},
		&models.ShiftDay{},
	)
	if err != nil {
		return errors.New("Datenbank Migrationsfehler: " + err.Error())
	}
	return nil
}
