package db

import (
	"log"
	"os"
	"path/filepath"

	"github.com/danhawkins/go-vite-react-example/models"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDatabase initializes the SQLite database connection
func InitDatabase() error {
	// Create data directory if it doesn't exist
	dataDir := "data"
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return err
	}

	// Database file path
	dbPath := filepath.Join(dataDir, "schichtplaner.db")
	
	// Configure GORM logger
	gormLogger := logger.Default
	if os.Getenv("ENV") == "test" {
		gormLogger = logger.Default.LogMode(logger.Silent)
	}

	// Open database connection
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		return err
	}

	// Auto-migrate database schema
	if err := AutoMigrate(); err != nil {
		return err
	}

	// Seed initial data if database is empty
	if err := SeedData(); err != nil {
		return err
	}

	log.Printf("Database initialized successfully: %s", dbPath)
	return nil
}

// AutoMigrate runs database migrations
func AutoMigrate() error {
	return DB.AutoMigrate(
		&models.Message{},
	)
}

// SeedData inserts initial data into the database
func SeedData() error {
	// Check if any messages exist
	var count int64
	DB.Model(&models.Message{}).Count(&count)
	
	if count == 0 {
		// Insert default message
		message := models.Message{
			Content: "Hello, from the golang World!",
		}
		if err := DB.Create(&message).Error; err != nil {
			return err
		}
		log.Println("Seeded initial message data")
	}
	
	return nil
}

// CloseDatabase closes the database connection
func CloseDatabase() error {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			return err
		}
		return sqlDB.Close()
	}
	return nil
}

// GetTestDB returns a test database instance
func GetTestDB() (*gorm.DB, error) {
	// Use in-memory SQLite for tests
	testDB, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, err
	}

	// Auto-migrate for test database
	if err := testDB.AutoMigrate(&models.Message{}); err != nil {
		return nil, err
	}

	return testDB, nil
}
