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

var db *gorm.DB

// GetDB gibt die Datenbankinstanz zurück
func GetDB() *gorm.DB {
	return db
}

// SetDB setzt die Datenbankinstanz
func SetDB(database *gorm.DB) {
	db = database
}

// ValidateConnection prüft die Datenbankverbindung
func ValidateConnection() error {
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
}

// SetupTestDB erstellt eine physische Testdatenbank
func SetupTestDB(t *testing.T, entities ...interface{}) *fiber.App {
	testDbPath := os.Getenv("SQLITE_TEST_DB_PATH")
	if testDbPath == "" {
		testDbPath = "schichtplaner_test.db"
	}

	db, err := gorm.Open(sqlite.Open(testDbPath), &gorm.Config{})
	if err != nil {
		t.Fatalf("Fehler beim Verbinden zur Testdatenbank: %v", err)
	}

	db.AutoMigrate(entities...)
	SetDB(db)

	return fiber.New()
}

// StartDB initialisiert die Datenbankverbindung
func StartDB() error {
	dbPath := os.Getenv("SQLITE_DB_PATH")
	if dbPath == "" {
		dbPath = "schichtplaner.db"
	}

	var err error
	db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return errors.New("Fehler beim Öffnen der SQLite Datenbank: " + err.Error())
	}

	return nil
}

// CloseDB schließt die Datenbankverbindung
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

// AutoMigrate führt die Datenbankmigrationen durch
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
