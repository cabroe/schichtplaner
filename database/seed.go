package database

import (
	"fmt"
	"log"
	"time"

	"schichtplaner/models"

	"golang.org/x/crypto/bcrypt"
)

// ResetDatabase löscht alle Daten aus der Datenbank
func ResetDatabase() error {
	log.Println("Setze Datenbank zurück...")

	// Prüfe, ob DB verfügbar ist
	if DB == nil {
		return fmt.Errorf("datenbank ist nicht initialisiert")
	}

	// Lösche alle Daten aus allen Tabellen
	if err := DB.Exec("DELETE FROM shifts").Error; err != nil {
		return err
	}
	if err := DB.Exec("DELETE FROM schedules").Error; err != nil {
		return err
	}
	if err := DB.Exec("DELETE FROM users").Error; err != nil {
		return err
	}

	// Setze Auto-Increment-Zähler zurück
	if err := DB.Exec("DELETE FROM sqlite_sequence WHERE name IN ('users', 'schedules', 'shifts')").Error; err != nil {
		return err
	}

	log.Println("Datenbank erfolgreich zurückgesetzt")
	return nil
}

// SeedDatabase füllt die Datenbank mit Testdaten
func SeedDatabase() error {
	log.Println("Fülle Datenbank mit Seed-Daten...")

	// Prüfe, ob DB verfügbar ist
	if DB == nil {
		return fmt.Errorf("datenbank ist nicht initialisiert")
	}

	// Hash für Standard-Passwort
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("fehler beim hashen des passworts: %v", err)
	}

	// Erstelle Test-Users
	users := []models.User{
		{
			Username:      "admin",
			Email:         "admin@schichtplaner.de",
			Password:      string(hashedPassword),
			AccountNumber: "ADM001",
			Name:          "Admin User",
			Color:         "#ff0000",
			Role:          "admin",
			IsActive:      true,
			IsAdmin:       true,
		},
		{
			Username:      "max.mustermann",
			Email:         "max@schichtplaner.de",
			Password:      string(hashedPassword),
			AccountNumber: "EMP001",
			Name:          "Max Mustermann",
			Color:         "#00ff00",
			Role:          "user",
			IsActive:      true,
			IsAdmin:       false,
		},
		{
			Username:      "anna.schmidt",
			Email:         "anna@schichtplaner.de",
			Password:      string(hashedPassword),
			AccountNumber: "EMP002",
			Name:          "Anna Schmidt",
			Color:         "#0000ff",
			Role:          "user",
			IsActive:      true,
			IsAdmin:       false,
		},
		{
			Username:      "peter.weber",
			Email:         "peter@schichtplaner.de",
			Password:      string(hashedPassword),
			AccountNumber: "EMP003",
			Name:          "Peter Weber",
			Color:         "#ffff00",
			Role:          "user",
			IsActive:      true,
			IsAdmin:       false,
		},
		{
			Username:      "lisa.mueller",
			Email:         "lisa@schichtplaner.de",
			Password:      string(hashedPassword),
			AccountNumber: "EMP004",
			Name:          "Lisa Müller",
			Color:         "#ff00ff",
			Role:          "user",
			IsActive:      false, // Inaktiver User
			IsAdmin:       false,
		},
	}

	for _, user := range users {
		if err := DB.Create(&user).Error; err != nil {
			return err
		}
	}

	// Erstelle Test-Schedules
	schedules := []models.Schedule{
		{
			Name:        "Januar 2024",
			Description: "Schichtplan für Januar 2024",
			StartDate:   time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
			EndDate:     time.Date(2024, 1, 31, 23, 59, 59, 0, time.UTC),
			IsActive:    true,
		},
		{
			Name:        "Februar 2024",
			Description: "Schichtplan für Februar 2024",
			StartDate:   time.Date(2024, 2, 1, 0, 0, 0, 0, time.UTC),
			EndDate:     time.Date(2024, 2, 29, 23, 59, 59, 0, time.UTC),
			IsActive:    true,
		},
		{
			Name:        "März 2024",
			Description: "Schichtplan für März 2024",
			StartDate:   time.Date(2024, 3, 1, 0, 0, 0, 0, time.UTC),
			EndDate:     time.Date(2024, 3, 31, 23, 59, 59, 0, time.UTC),
			IsActive:    false, // Inaktiver Schedule
		},
	}

	for _, schedule := range schedules {
		if err := DB.Create(&schedule).Error; err != nil {
			return err
		}
	}

	// Erstelle Test-Shifts
	// Lade die erstellten Users und Schedules
	var createdUsers []models.User
	var createdSchedules []models.Schedule
	DB.Find(&createdUsers)
	DB.Find(&createdSchedules)

	if len(createdUsers) == 0 || len(createdSchedules) == 0 {
		log.Println("Keine Users oder Schedules gefunden für Shift-Erstellung")
		return nil
	}

	// Erstelle Shifts für verschiedene User und Schedules
	shifts := []models.Shift{
		{
			UserID:      createdUsers[1].ID,     // max.mustermann
			ScheduleID:  createdSchedules[0].ID, // Januar 2024
			StartTime:   time.Date(2024, 1, 15, 6, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 1, 15, 14, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Frühschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[1].ID,     // max.mustermann
			ScheduleID:  createdSchedules[0].ID, // Januar 2024
			StartTime:   time.Date(2024, 1, 16, 14, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 1, 16, 22, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Spätschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[2].ID,     // anna.schmidt
			ScheduleID:  createdSchedules[0].ID, // Januar 2024
			StartTime:   time.Date(2024, 1, 15, 14, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 1, 15, 22, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Spätschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[2].ID,     // anna.schmidt
			ScheduleID:  createdSchedules[0].ID, // Januar 2024
			StartTime:   time.Date(2024, 1, 16, 6, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 1, 16, 14, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Frühschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[3].ID,     // peter.weber
			ScheduleID:  createdSchedules[1].ID, // Februar 2024
			StartTime:   time.Date(2024, 2, 1, 6, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 2, 1, 14, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Frühschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[3].ID,     // peter.weber
			ScheduleID:  createdSchedules[1].ID, // Februar 2024
			StartTime:   time.Date(2024, 2, 2, 14, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 2, 2, 22, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Spätschicht",
			IsActive:    true,
		},
	}

	for _, shift := range shifts {
		if err := DB.Create(&shift).Error; err != nil {
			return err
		}
	}

	log.Println("Seed-Daten erfolgreich eingefügt")
	return nil
}

// ResetAndSeedDatabase kombiniert Reset und Seed
func ResetAndSeedDatabase() error {
	if err := ResetDatabase(); err != nil {
		return err
	}
	return SeedDatabase()
}
