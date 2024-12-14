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

func GetDB() *gorm.DB {
	return db
}

func SetDB(database *gorm.DB) {
	db = database
}

func ValidateConnection() error {
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
}

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

	sqlDB, err := db.DB()
	if err != nil {
		return err
	}

	// Performance-Optimierungen
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	return nil
}

func CloseDB() {
	if db != nil {
		sqlDB, err := db.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
}

func AutoMigrate() error {
	err := db.AutoMigrate(
		&models.Department{},
		&models.Employee{},
		&models.ShiftType{},
		&models.ShiftWeek{},
		&models.ShiftDay{},
	)
	if err != nil {
		return errors.New("Datenbank Migrationsfehler: " + err.Error())
	}
	return nil
}

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

func CleanTestDB() error {
	if db != nil {
		err := db.Migrator().DropTable(
			&models.ShiftDay{},
			&models.ShiftWeek{},
			&models.ShiftType{},
			&models.Employee{},
			&models.Department{},
		)
		if err != nil {
			return err
		}
	}
	return nil
}
