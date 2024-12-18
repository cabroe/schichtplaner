package main

import (
	"log"
	"time"

	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

func main() {
	if err := database.StartDB(); err != nil {
		log.Fatal(err)
	}
	defer database.CloseDB()

	if err := database.AutoMigrate(); err != nil {
		log.Fatal(err)
	}

	// Test-Abteilungen erstellen
	departments := []models.Department{
		{Name: "IT Abteilung", Description: "Entwicklung und Wartung der IT-Systeme", Color: "#0000FF"},
		{Name: "HR Abteilung", Description: "Personalverwaltung und -entwicklung", Color: "#FF0000"},
		{Name: "Produktion", Description: "Herstellung und Qualitätskontrolle", Color: "#00FF00"},
		{Name: "Vertrieb", Description: "Kundenbetreuung und Verkauf", Color: "#FFD700"},
		{Name: "Support", Description: "Technischer Kundensupport", Color: "#FF00FF"},
	}
	for _, dept := range departments {
		database.GetDB().Create(&dept)
	}

	// Test-Mitarbeiter erstellen
	employees := []models.Employee{
		// IT Abteilung (ID: 1)
		{FirstName: "Max", LastName: "Mustermann", Email: "max@example.com", Password: "geheim123", Color: "#FF4500", DepartmentID: 1, IsAdmin: true},
		{FirstName: "Lisa", LastName: "Schmidt", Email: "lisa@example.com", Password: "geheim123", Color: "#32CD32", DepartmentID: 1},
		{FirstName: "Tim", LastName: "Meyer", Email: "tim@example.com", Password: "geheim123", Color: "#800080", DepartmentID: 1},
		{FirstName: "Sarah", LastName: "Weber", Email: "sarah@example.com", Password: "geheim123", Color: "#20B2AA", DepartmentID: 1},

		// HR Abteilung (ID: 2)
		{FirstName: "Erika", LastName: "Musterfrau", Email: "erika@example.com", Password: "geheim123", Color: "#4B0082", DepartmentID: 2, IsAdmin: true},
		{FirstName: "Thomas", LastName: "Müller", Email: "thomas@example.com", Password: "geheim123", Color: "#FF00FF", DepartmentID: 2},
		{FirstName: "Anna", LastName: "Bauer", Email: "anna@example.com", Password: "geheim123", Color: "#FFD700", DepartmentID: 2},
		{FirstName: "Michael", LastName: "Koch", Email: "michael@example.com", Password: "geheim123", Color: "#00FFFF", DepartmentID: 2},

		// Produktion (ID: 3)
		{FirstName: "Peter", LastName: "Wagner", Email: "peter@example.com", Password: "geheim123", Color: "#7B68EE", DepartmentID: 3},
		{FirstName: "Julia", LastName: "Hoffmann", Email: "julia@example.com", Password: "geheim123", Color: "#8B4513", DepartmentID: 3},
		{FirstName: "Martin", LastName: "Schulz", Email: "martin@example.com", Password: "geheim123", Color: "#FF1493", DepartmentID: 3},
		{FirstName: "Laura", LastName: "Fischer", Email: "laura@example.com", Password: "geheim123", Color: "#FFA500", DepartmentID: 3},

		// Vertrieb (ID: 4)
		{FirstName: "Stefan", LastName: "Becker", Email: "stefan@example.com", Password: "geheim123", Color: "#000080", DepartmentID: 4},
		{FirstName: "Nina", LastName: "Klein", Email: "nina@example.com", Password: "geheim123", Color: "#48D1CC", DepartmentID: 4},
		{FirstName: "Felix", LastName: "Richter", Email: "felix@example.com", Password: "geheim123", Color: "#FF69B4", DepartmentID: 4},
		{FirstName: "Carola", LastName: "Wolf", Email: "carola@example.com", Password: "geheim123", Color: "#FFFF00", DepartmentID: 4},

		// Support (ID: 5)
		{FirstName: "David", LastName: "Schäfer", Email: "david@example.com", Password: "geheim123", Color: "#008000", DepartmentID: 5},
		{FirstName: "Sandra", LastName: "König", Email: "sandra@example.com", Password: "geheim123", Color: "#00FF00", DepartmentID: 5},
		{FirstName: "Markus", LastName: "Lang", Email: "markus@example.com", Password: "geheim123", Color: "#0000FF", DepartmentID: 5},
		{FirstName: "Petra", LastName: "Krause", Email: "petra@example.com", Password: "geheim123", Color: "#20B2AA", DepartmentID: 5},
	}
	for _, employee := range employees {
		database.GetDB().Create(&employee)
	}

	// Test-Schichttypen erstellen
	shiftTypes := []models.ShiftType{
		{Name: "Frühschicht", Description: "06:00-14:00", Duration: "8h", Color: "#FFD700"},
		{Name: "Spätschicht", Description: "14:00-22:00", Duration: "8h", Color: "#4B0082"},
		{Name: "Nachtschicht", Description: "22:00-06:00", Duration: "8h", Color: "#800080"},
		{Name: "Bereitschaft", Description: "24h", Duration: "24h", Color: "#32CD32"},
		{Name: "Rufbereitschaft", Description: "Abruf", Duration: "12h", Color: "#FF69B4"},
	}
	for _, st := range shiftTypes {
		database.GetDB().Create(&st)
	}

	// Test-Schichtwochen erstellen
	startDate := time.Now().AddDate(0, 0, -7)
	shiftWeeks := []models.ShiftWeek{
		{
			StartDate:    startDate,
			EndDate:      startDate.AddDate(0, 0, 7),
			DepartmentID: 1,
			Status:       models.StatusPublished,
			Notes:        "Aktuelle Woche",
		},
		{
			StartDate:    startDate.AddDate(0, 0, 7),
			EndDate:      startDate.AddDate(0, 0, 14),
			DepartmentID: 1,
			Status:       models.StatusDraft,
			Notes:        "Nächste Woche in Planung",
		},
		{
			StartDate:    startDate.AddDate(0, 0, 14),
			EndDate:      startDate.AddDate(0, 0, 21),
			DepartmentID: 1,
			Status:       models.StatusDraft,
			Notes:        "Übernächste Woche",
		},
		{
			StartDate:    startDate,
			EndDate:      startDate.AddDate(0, 0, 7),
			DepartmentID: 2,
			Status:       models.StatusArchived,
			Notes:        "Archivierte Woche",
		},
		{
			StartDate:    startDate.AddDate(0, 0, 7),
			EndDate:      startDate.AddDate(0, 0, 14),
			DepartmentID: 2,
			Status:       models.StatusPublished,
			Notes:        "Aktuelle Woche HR",
		},
	}

	for _, week := range shiftWeeks {
		database.GetDB().Create(&week)

		for i := 0; i < 7; i++ {
			shiftDay := models.ShiftDay{
				Date:        week.StartDate.AddDate(0, 0, i),
				ShiftTypeID: uint((i % 3) + 1),
				EmployeeID:  uint((i % 3) + 1),
				ShiftWeekID: week.ID,
			}
			database.GetDB().Create(&shiftDay)
		}
	}

	log.Println("✨ Testdaten erfolgreich erstellt!")
}
