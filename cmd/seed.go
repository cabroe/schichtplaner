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
		{Name: "IT Abteilung", Color: "#FF5733"},
		{Name: "HR Abteilung", Color: "#33FF57"},
		{Name: "Produktion", Color: "#5733FF"},
		{Name: "Vertrieb", Color: "#33FFFF"},
		{Name: "Support", Color: "#FF33FF"},
	}
	for _, dept := range departments {
		database.GetDB().Create(&dept)
	}

	// Test-Mitarbeiter erstellen
	employees := []models.Employee{
		{
			FirstName:    "Max",
			LastName:     "Mustermann",
			Email:        "max@example.com",
			Password:     "geheim123",
			Color:        "#FF0000",
			DepartmentID: 1,
		},
		{
			FirstName:    "Erika",
			LastName:     "Musterfrau",
			Email:        "erika@example.com",
			Password:     "geheim123",
			Color:        "#00FF00",
			DepartmentID: 2,
		},
		{
			FirstName:    "Peter",
			LastName:     "Schmidt",
			Email:        "peter@example.com",
			Password:     "geheim123",
			Color:        "#0000FF",
			DepartmentID: 3,
		},
		{
			FirstName:    "Anna",
			LastName:     "Weber",
			Email:        "anna@example.com",
			Password:     "geheim123",
			Color:        "#FFFF00",
			DepartmentID: 1,
		},
		{
			FirstName:    "Thomas",
			LastName:     "Müller",
			Email:        "thomas@example.com",
			Password:     "geheim123",
			Color:        "#FF00FF",
			DepartmentID: 2,
		},
	}
	for _, employee := range employees {
		database.GetDB().Create(&employee)
	}

	// Test-Schichttypen erstellen
	shiftTypes := []models.ShiftType{
		{Name: "Frühschicht", Description: "06:00-14:00", Duration: "8h", Color: "#FFD700"},
		{Name: "Spätschicht", Description: "14:00-22:00", Duration: "8h", Color: "#4169E1"},
		{Name: "Nachtschicht", Description: "22:00-06:00", Duration: "8h", Color: "#800080"},
		{Name: "Bereitschaft", Description: "24h", Duration: "24h", Color: "#32CD32"},
		{Name: "Rufbereitschaft", Description: "Abruf", Duration: "12h", Color: "#FF69B4"},
	}
	for _, st := range shiftTypes {
		database.GetDB().Create(&st)
	}

	// Test-Schichtwochen erstellen
	startDate := time.Now().AddDate(0, 0, -7) // Eine Woche in der Vergangenheit
	shiftWeeks := []models.ShiftWeek{
		{
			StartDate:    startDate,
			EndDate:      startDate.AddDate(0, 0, 7),
			DepartmentID: 1,
		},
		{
			StartDate:    startDate.AddDate(0, 0, 7),
			EndDate:      startDate.AddDate(0, 0, 14),
			DepartmentID: 1,
		},
		{
			StartDate:    startDate.AddDate(0, 0, 14),
			EndDate:      startDate.AddDate(0, 0, 21),
			DepartmentID: 1,
		},
		{
			StartDate:    startDate,
			EndDate:      startDate.AddDate(0, 0, 7),
			DepartmentID: 2,
		},
		{
			StartDate:    startDate.AddDate(0, 0, 7),
			EndDate:      startDate.AddDate(0, 0, 14),
			DepartmentID: 2,
		},
	}

	// Schichtwochen erstellen und Schichttage hinzufügen
	for _, week := range shiftWeeks {
		database.GetDB().Create(&week)

		// Für jeden Tag der Woche Schichten erstellen
		for i := 0; i < 7; i++ {
			shiftDay := models.ShiftDay{
				Date:        week.StartDate.AddDate(0, 0, i),
				ShiftTypeID: uint((i % 3) + 1), // Wechsel zwischen Schichttypen 1-3
				EmployeeID:  uint((i % 3) + 1), // Wechsel zwischen Mitarbeitern 1-3
				ShiftWeekID: week.ID,
			}
			database.GetDB().Create(&shiftDay)
		}
	}

	log.Println("✨ Testdaten erfolgreich erstellt!")
}
