package database

import (
	"errors"
	"os"
	"testing"
	"time"

	"github.com/glebarez/sqlite"
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/models"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

// GetDB gibt die aktuelle Datenbankinstanz zurück
func GetDB() *gorm.DB {
	return db
}

// SetDB setzt eine neue Datenbankinstanz
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

// StartDB initialisiert die Hauptdatenbankverbindung
func StartDB() error {
	dbPath := os.Getenv("SQLITE_DB_PATH")
	if dbPath == "" {
		dbPath = "schichtplaner.db"
	}

	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		NowFunc: func() time.Time {
			return time.Now().Local()
		},
	}

	var err error
	db, err = gorm.Open(sqlite.Open(dbPath), config)
	if err != nil {
		return errors.New("Fehler beim Öffnen der SQLite Datenbank: " + err.Error())
	}

	// Performance-Optimierungen
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	return nil
}

// CloseDB schließt die aktuelle Datenbankverbindung sicher
func CloseDB() {
	if db != nil {
		sqlDB, err := db.DB()
		if err == nil {
			sqlDB.Close()
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

// SetupTestDB erstellt eine Testdatenbank für Integrationstests
func SetupTestDB(t *testing.T, entities ...interface{}) *fiber.App {
	testDbPath := os.Getenv("SQLITE_TEST_DB_PATH")
	if testDbPath == "" {
		testDbPath = "schichtplaner_test.db"
	}

	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
		NowFunc: func() time.Time {
			return time.Now().Local()
		},
	}

	testDB, err := gorm.Open(sqlite.Open(testDbPath), config)
	if err != nil {
		t.Fatalf("Fehler beim Verbinden zur Testdatenbank: %v", err)
	}

	testDB.AutoMigrate(entities...)
	SetDB(testDB)

	return fiber.New()
}
