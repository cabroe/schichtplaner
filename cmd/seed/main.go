package main

import (
	"log"

	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

func main() {
	// Connect to database
	if err := database.StartDB(); err != nil {
		log.Fatal(err)
	}
	defer database.CloseDB()

	// Run migrations
	if err := database.AutoMigrate(); err != nil {
		log.Fatal(err)
	}

	// Create test departments
	departments := []models.Department{
		{Name: "IT Department"},
		{Name: "HR Department"},
	}
	for _, dept := range departments {
		database.GetDB().Create(&dept)
	}

	// Create test shift types
	shiftTypes := []models.ShiftType{
		{Name: "Early Shift", Description: "06:00-14:00", Duration: "8h"},
		{Name: "Late Shift", Description: "14:00-22:00", Duration: "8h"},
		{Name: "Night Shift", Description: "22:00-06:00", Duration: "8h"},
	}
	for _, st := range shiftTypes {
		database.GetDB().Create(&st)
	}

	// Create test users
	users := []models.User{
		{
			FirstName:    "John",
			LastName:     "Doe",
			Email:        "john@example.com",
			Password:     "secret123",
			Color:        "#FF0000",
			DepartmentID: 1,
		},
		{
			FirstName:    "Jane",
			LastName:     "Doe",
			Email:        "jane@example.com",
			Password:     "secret123",
			Color:        "#00FF00",
			DepartmentID: 2,
		},
	}
	for _, user := range users {
		database.GetDB().Create(&user)
	}

	log.Println("Database seeded successfully!")
}
