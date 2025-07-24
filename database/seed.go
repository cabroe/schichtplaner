package database

import (
	"fmt"
	"log"
	"time"

	"schichtplaner/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
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
	if err := DB.Exec("DELETE FROM teams").Error; err != nil {
		return err
	}
	if err := DB.Exec("DELETE FROM shift_types").Error; err != nil {
		return err
	}

	// Setze Auto-Increment-Zähler zurück
	if err := DB.Exec("DELETE FROM sqlite_sequence WHERE name IN ('users', 'schedules', 'shifts', 'teams', 'shift_types')").Error; err != nil {
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

	// Erstelle Test-Teams (nur wenn sie noch nicht existieren)
	teams := []models.Team{
		{
			Name:        "Entwicklungsteam",
			Description: "Team für Software-Entwicklung und Programmierung",
			Color:       "#3B82F6",
			IsActive:    true,
			SortOrder:   1,
		},
		{
			Name:        "Design-Team",
			Description: "Team für UI/UX Design und Grafik",
			Color:       "#10B981",
			IsActive:    true,
			SortOrder:   2,
		},
		{
			Name:        "Marketing-Team",
			Description: "Team für Marketing und Öffentlichkeitsarbeit",
			Color:       "#F59E0B",
			IsActive:    true,
			SortOrder:   3,
		},
		{
			Name:        "Support-Team",
			Description: "Team für Kundenbetreuung und Support",
			Color:       "#EF4444",
			IsActive:    false, // Inaktives Team
			SortOrder:   4,
		},
	}

	for _, team := range teams {
		// Prüfe, ob Team bereits existiert
		var existingTeam models.Team
		if err := DB.Where("name = ?", team.Name).First(&existingTeam).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// Team existiert nicht, erstelle es
				if err := DB.Create(&team).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
		// Team existiert bereits, überspringe
	}

	// Erstelle Test-Schichttypen
	shiftTypes := []models.ShiftType{
		{
			Name:         "Frühschicht",
			Description:  "Schicht von 6:00 bis 14:00 Uhr",
			Color:        "#3B82F6",
			DefaultStart: time.Date(2024, 1, 1, 6, 0, 0, 0, time.UTC),
			DefaultEnd:   time.Date(2024, 1, 1, 14, 0, 0, 0, time.UTC),
			DefaultBreak: 30,
			IsActive:     true,
			SortOrder:    1,
			MinDuration:  480, // 8 Stunden
			MaxDuration:  600, // 10 Stunden
		},
		{
			Name:         "Spätschicht",
			Description:  "Schicht von 14:00 bis 22:00 Uhr",
			Color:        "#EF4444",
			DefaultStart: time.Date(2024, 1, 1, 14, 0, 0, 0, time.UTC),
			DefaultEnd:   time.Date(2024, 1, 1, 22, 0, 0, 0, time.UTC),
			DefaultBreak: 30,
			IsActive:     true,
			SortOrder:    2,
			MinDuration:  480, // 8 Stunden
			MaxDuration:  600, // 10 Stunden
		},
		{
			Name:         "Nachtschicht",
			Description:  "Schicht von 22:00 bis 6:00 Uhr",
			Color:        "#8B5CF6",
			DefaultStart: time.Date(2024, 1, 1, 22, 0, 0, 0, time.UTC),
			DefaultEnd:   time.Date(2024, 1, 2, 6, 0, 0, 0, time.UTC),
			DefaultBreak: 45,
			IsActive:     true,
			SortOrder:    3,
			MinDuration:  480, // 8 Stunden
			MaxDuration:  600, // 10 Stunden
		},
		{
			Name:         "Teilzeit",
			Description:  "Kürzere Schicht von 4-6 Stunden",
			Color:        "#F59E0B",
			DefaultStart: time.Date(2024, 1, 1, 9, 0, 0, 0, time.UTC),
			DefaultEnd:   time.Date(2024, 1, 1, 15, 0, 0, 0, time.UTC),
			DefaultBreak: 15,
			IsActive:     true,
			SortOrder:    4,
			MinDuration:  240, // 4 Stunden
			MaxDuration:  360, // 6 Stunden
		},
		{
			Name:         "Überstunden",
			Description:  "Längere Schicht für besondere Anlässe",
			Color:        "#DC2626",
			DefaultStart: time.Date(2024, 1, 1, 8, 0, 0, 0, time.UTC),
			DefaultEnd:   time.Date(2024, 1, 1, 18, 0, 0, 0, time.UTC),
			DefaultBreak: 60,
			IsActive:     false, // Inaktiver Schichttyp
			SortOrder:    5,
			MinDuration:  600, // 10 Stunden
			MaxDuration:  720, // 12 Stunden
		},
	}

	for _, shiftType := range shiftTypes {
		// Prüfe, ob Schichttyp bereits existiert
		var existingShiftType models.ShiftType
		if err := DB.Where("name = ?", shiftType.Name).First(&existingShiftType).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// Schichttyp existiert nicht, erstelle ihn
				if err := DB.Create(&shiftType).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
		// Schichttyp existiert bereits, überspringe
	}

	// Lade die erstellten Teams für User-Zuordnung
	var createdTeams []models.Team
	DB.Find(&createdTeams)

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
			// Admin gehört keinem Team an
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
			// Max gehört zum Entwicklungsteam
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
			// Anna gehört zum Design-Team
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
			// Peter gehört zum Marketing-Team
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
			// Lisa gehört keinem Team an (inaktiv)
		},
	}

	for _, user := range users {
		// Prüfe, ob User bereits existiert
		var existingUser models.User
		if err := DB.Where("username = ?", user.Username).First(&existingUser).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// User existiert nicht, erstelle ihn
				if err := DB.Create(&user).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
		// User existiert bereits, überspringe
	}

	// Weise Benutzer Teams zu
	if len(createdTeams) >= 3 {
		var maxUser, annaUser, peterUser models.User
		DB.Where("username = ?", "max.mustermann").First(&maxUser)
		DB.Where("username = ?", "anna.schmidt").First(&annaUser)
		DB.Where("username = ?", "peter.weber").First(&peterUser)

		// Max -> Entwicklungsteam
		maxUser.TeamID = &createdTeams[0].ID
		DB.Save(&maxUser)

		// Anna -> Design-Team
		annaUser.TeamID = &createdTeams[1].ID
		DB.Save(&annaUser)

		// Peter -> Marketing-Team
		peterUser.TeamID = &createdTeams[2].ID
		DB.Save(&peterUser)
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
		// Prüfe, ob Schedule bereits existiert
		var existingSchedule models.Schedule
		if err := DB.Where("name = ?", schedule.Name).First(&existingSchedule).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// Schedule existiert nicht, erstelle ihn
				if err := DB.Create(&schedule).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
		// Schedule existiert bereits, überspringe
	}

	// Erstelle Test-Shifts
	// Lade die erstellten Users, Schedules und Schichttypen
	var createdUsers []models.User
	var createdSchedules []models.Schedule
	var createdShiftTypes []models.ShiftType
	DB.Find(&createdUsers)
	DB.Find(&createdSchedules)
	DB.Find(&createdShiftTypes)

	if len(createdUsers) == 0 || len(createdSchedules) == 0 || len(createdShiftTypes) == 0 {
		log.Println("Keine Users, Schedules oder Schichttypen gefunden für Shift-Erstellung")
		return nil
	}

	// Erstelle Shifts für verschiedene User und Schedules
	shifts := []models.Shift{
		{
			UserID:      createdUsers[1].ID,       // max.mustermann
			ScheduleID:  createdSchedules[0].ID,   // Januar 2024
			ShiftTypeID: &createdShiftTypes[0].ID, // Frühschicht
			StartTime:   time.Date(2024, 1, 15, 6, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 1, 15, 14, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Frühschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[1].ID,       // max.mustermann
			ScheduleID:  createdSchedules[0].ID,   // Januar 2024
			ShiftTypeID: &createdShiftTypes[1].ID, // Spätschicht
			StartTime:   time.Date(2024, 1, 16, 14, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 1, 16, 22, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Spätschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[2].ID,       // anna.schmidt
			ScheduleID:  createdSchedules[0].ID,   // Januar 2024
			ShiftTypeID: &createdShiftTypes[1].ID, // Spätschicht
			StartTime:   time.Date(2024, 1, 15, 14, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 1, 15, 22, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Spätschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[2].ID,       // anna.schmidt
			ScheduleID:  createdSchedules[0].ID,   // Januar 2024
			ShiftTypeID: &createdShiftTypes[0].ID, // Frühschicht
			StartTime:   time.Date(2024, 1, 16, 6, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 1, 16, 14, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Frühschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[3].ID,       // peter.weber
			ScheduleID:  createdSchedules[1].ID,   // Februar 2024
			ShiftTypeID: &createdShiftTypes[0].ID, // Frühschicht
			StartTime:   time.Date(2024, 2, 1, 6, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 2, 1, 14, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Frühschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[3].ID,       // peter.weber
			ScheduleID:  createdSchedules[1].ID,   // Februar 2024
			ShiftTypeID: &createdShiftTypes[1].ID, // Spätschicht
			StartTime:   time.Date(2024, 2, 2, 14, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 2, 2, 22, 0, 0, 0, time.UTC),
			BreakTime:   30,
			Description: "Spätschicht",
			IsActive:    true,
		},
		// Zusätzliche Shifts mit verschiedenen Schichttypen
		{
			UserID:      createdUsers[1].ID,       // max.mustermann
			ScheduleID:  createdSchedules[0].ID,   // Januar 2024
			ShiftTypeID: &createdShiftTypes[2].ID, // Nachtschicht
			StartTime:   time.Date(2024, 1, 20, 22, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 1, 21, 6, 0, 0, 0, time.UTC),
			BreakTime:   45,
			Description: "Nachtschicht",
			IsActive:    true,
		},
		{
			UserID:      createdUsers[2].ID,       // anna.schmidt
			ScheduleID:  createdSchedules[0].ID,   // Januar 2024
			ShiftTypeID: &createdShiftTypes[3].ID, // Teilzeit
			StartTime:   time.Date(2024, 1, 22, 9, 0, 0, 0, time.UTC),
			EndTime:     time.Date(2024, 1, 22, 15, 0, 0, 0, time.UTC),
			BreakTime:   15,
			Description: "Teilzeit",
			IsActive:    true,
		},
	}

	for _, shift := range shifts {
		// Prüfe, ob Shift bereits existiert (basierend auf User, Schedule und StartTime)
		var existingShift models.Shift
		if err := DB.Where("user_id = ? AND schedule_id = ? AND start_time = ?",
			shift.UserID, shift.ScheduleID, shift.StartTime).First(&existingShift).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// Shift existiert nicht, erstelle ihn
				if err := DB.Create(&shift).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
		// Shift existiert bereits, überspringe
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
