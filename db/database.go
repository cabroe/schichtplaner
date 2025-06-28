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
		&models.User{},
		&models.Team{},
		&models.TeamMember{},
		&models.ShiftType{},
	)
}

// SeedData inserts initial data into the database
func SeedData() error {
	// Seed messages
	var messageCount int64
	DB.Model(&models.Message{}).Count(&messageCount)
	
	if messageCount == 0 {
		message := models.Message{
			Content: "Hello, from the golang World!",
		}
		if err := DB.Create(&message).Error; err != nil {
			return err
		}
		log.Println("Seeded initial message data")
	}

	// Seed users
	var userCount int64
	DB.Model(&models.User{}).Count(&userCount)
	
	if userCount == 0 {
		users := []models.User{
			{
				Username: "admin",
				Name:     "Administrator",
				Email:    "admin@schichtplaner.local",
				Color:    "#DC2626",
				Role:     "Administrator",
				IsActive: true,
				IsAdmin:  true,
			},
			{
				Username: "demo_user",
				Name:     "Demo Benutzer",
				Email:    "demo@schichtplaner.local",
				Color:    "#3B82F6",
				Role:     "Mitarbeiter",
				IsActive: true,
				IsAdmin:  false,
			},
		}
		
		for _, user := range users {
			if err := DB.Create(&user).Error; err != nil {
				return err
			}
		}
		log.Println("Seeded initial user data")
	}

	// Seed teams
	var teamCount int64
	DB.Model(&models.Team{}).Count(&teamCount)
	
	if teamCount == 0 {
		teams := []models.Team{
			{
				Name:        "Hauptteam",
				Description: "Das Hauptteam für die Schichtplanung",
				Color:       "#10B981",
				IsActive:    true,
			},
			{
				Name:        "Nachtschicht",
				Description: "Team für die Nachtschichten",
				Color:       "#6366F1",
				IsActive:    true,
			},
		}
		
		for _, team := range teams {
			if err := DB.Create(&team).Error; err != nil {
				return err
			}
		}
		log.Println("Seeded initial team data")
	}

	// Seed shift types
	var shiftTypeCount int64
	DB.Model(&models.ShiftType{}).Count(&shiftTypeCount)
	
	if shiftTypeCount == 0 {
		shiftTypes := []models.ShiftType{
			{
				Name:        "Frühschicht",
				Description: "Frühe Schicht von 06:00 bis 14:00",
				Color:       "#F59E0B",
				Duration:    480, // 8 Stunden
				BreakTime:   30,  // 30 Minuten
				IsActive:    true,
			},
			{
				Name:        "Spätschicht",
				Description: "Späte Schicht von 14:00 bis 22:00",
				Color:       "#EF4444",
				Duration:    480, // 8 Stunden
				BreakTime:   30,  // 30 Minuten
				IsActive:    true,
			},
			{
				Name:        "Nachtschicht",
				Description: "Nachtschicht von 22:00 bis 06:00",
				Color:       "#8B5CF6",
				Duration:    480, // 8 Stunden
				BreakTime:   45,  // 45 Minuten
				IsActive:    true,
			},
		}
		
		for _, shiftType := range shiftTypes {
			if err := DB.Create(&shiftType).Error; err != nil {
				return err
			}
		}
		log.Println("Seeded initial shift type data")
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
	if err := testDB.AutoMigrate(
		&models.Message{},
		&models.User{},
		&models.Team{},
		&models.TeamMember{},
		&models.ShiftType{},
	); err != nil {
		return nil, err
	}

	return testDB, nil
}
