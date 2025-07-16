package database

import (
	"log"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"schichtplaner/models"
)

var DB *gorm.DB

// InitDatabase initialisiert die SQLite-Datenbank
func InitDatabase() {
	var err error

	// Erstelle den database-Ordner, falls er nicht existiert
	if err := os.MkdirAll("database", 0755); err != nil {
		log.Fatal("Fehler beim Erstellen des database-Ordners:", err)
	}

	// Konfiguriere GORM Logger
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	// Verbinde zur SQLite-Datenbank
	DB, err = gorm.Open(sqlite.Open("database/schichtplaner.db"), gormConfig)
	if err != nil {
		log.Fatal("Fehler beim Verbinden zur Datenbank:", err)
	}

	log.Println("Datenbank erfolgreich verbunden")

	// Auto-Migration für alle Modelle
	if err := DB.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{}); err != nil {
		log.Fatal("Fehler bei der Datenbank-Migration:", err)
	}

	log.Println("Datenbank-Migration abgeschlossen")
}

// CloseDatabase schließt die Datenbankverbindung
func CloseDatabase() {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			log.Println("Fehler beim Schließen der Datenbank:", err)
			return
		}
		sqlDB.Close()
		log.Println("Datenbankverbindung geschlossen")
	}
}
