package handlers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

func setupShiftWeekRoutes(app *fiber.App) {
	app.Post("/shiftweeks", HandleCreateShiftWeek)
	app.Get("/shiftweeks", HandleAllShiftWeeks)
}

func TestHandleCreateShiftWeek(t *testing.T) {
	app := database.SetupTestDB(t, &models.ShiftWeek{}, &models.Department{})
	setupShiftWeekRoutes(app)

	// Create prerequisite department
	database.GetDB().Create(&models.Department{Name: "Test Department"})

	shiftWeek := CreateShiftWeekDTO{
		StartDate:    "2024-01-22",
		EndDate:      "2024-01-28",
		DepartmentID: 1,
	}

	payload, _ := json.Marshal(shiftWeek)
	req := httptest.NewRequest("POST", "/shiftweeks", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to test request: %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("expected status 200; got %d", resp.StatusCode)
	}
}

func TestHandleGetAllShiftWeeks(t *testing.T) {
	app := database.SetupTestDB(t, &models.ShiftWeek{}, &models.Department{})
	setupShiftWeekRoutes(app)

	// Create prerequisite department
	database.GetDB().Create(&models.Department{Name: "Test Department"})

	// Create test shift week
	database.GetDB().Create(&models.ShiftWeek{
		StartDate:    parseTime("2024-01-22"),
		EndDate:      parseTime("2024-01-28"),
		DepartmentID: 1,
	})
	req := httptest.NewRequest("GET", "/shiftweeks", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to test request: %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("expected status 200; got %d", resp.StatusCode)
	}
}
