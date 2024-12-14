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
	}
	for _, dept := range departments {
		database.GetDB().Create(&dept)
	}

	// Test-Schichttypen erstellen
	shiftTypes := []models.ShiftType{
		{Name: "Frühschicht", Description: "06:00-14:00", Duration: "8h", Color: "#FFD700"},
		{Name: "Spätschicht", Description: "14:00-22:00", Duration: "8h", Color: "#4169E1"},
		{Name: "Nachtschicht", Description: "22:00-06:00", Duration: "8h", Color: "#800080"},
	}
	for _, st := range shiftTypes {
		database.GetDB().Create(&st)
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
	}
	for _, employee := range employees {
		database.GetDB().Create(&employee)
	}

	// Test-Schichtwochen erstellen
	shiftWeeks := []models.ShiftWeek{
		{
			StartDate:    time.Now(),
			EndDate:      time.Now().AddDate(0, 0, 7),
			DepartmentID: 1,
		},
		{
			StartDate:    time.Now().AddDate(0, 0, 7),
			EndDate:      time.Now().AddDate(0, 0, 14),
			DepartmentID: 2,
		},
	}
	for _, week := range shiftWeeks {
		database.GetDB().Create(&week)
	}

	log.Println("✨ Testdaten erfolgreich erstellt!")
}
