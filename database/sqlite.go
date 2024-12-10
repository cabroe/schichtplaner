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

func GetDB() *gorm.DB {
	return db
}

func SetDB(database *gorm.DB) {
	db = database
}

func SetupTestDB(t *testing.T, entities ...interface{}) *fiber.App {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to connect database: %v", err)
	}

	// Migrate schema for all provided entities
	db.AutoMigrate(entities...)

	// Set test DB
	SetDB(db)

	return fiber.New()
}

func StartDB() error {
	dbPath := os.Getenv("SQLITE_DB_PATH")
	if dbPath == "" {
		dbPath = "schichtplaner.db"
	}

	var err error
	db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return errors.New("Error opening SQLite database: " + err.Error())
	}

	return nil
}

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

func AutoMigrate() error {
	// Migration order matters due to foreign key constraints
	err := db.AutoMigrate(
		&models.Department{}, // Base table
		&models.User{},       // Depends on Department
		&models.ShiftType{},  // Independent table
		&models.ShiftWeek{},  // Depends on Department
		&models.ShiftDay{},   // Depends on ShiftWeek, ShiftType, User
	)
	if err != nil {
		return errors.New("Database migration error: " + err.Error())
	}
	return nil
}
