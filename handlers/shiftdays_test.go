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

func setupShiftDayRoutes(app *fiber.App) {
	app.Post("/shiftdays", HandleCreateShiftDay)
	app.Get("/shiftdays", HandleAllShiftDays)
}

func TestHandleCreateShiftDay(t *testing.T) {
	app := database.SetupTestDB(t,
		&models.ShiftDay{},
		&models.ShiftWeek{},
		&models.ShiftType{},
		&models.User{},
	)
	setupShiftDayRoutes(app)

	// Create prerequisites
	database.GetDB().Create(&models.ShiftWeek{
		StartDate: parseTime("2024-01-22"),
		EndDate:   parseTime("2024-01-28"),
	})
	database.GetDB().Create(&models.ShiftType{Name: "Early"})
	database.GetDB().Create(&models.User{Name: "Test User", Email: "test@example.com"})

	shiftDay := CreateShiftDayDTO{
		Date:        "2024-01-22",
		ShiftWeekID: 1,
		ShiftTypeID: 1,
		UserID:      1,
	}

	payload, _ := json.Marshal(shiftDay)
	req := httptest.NewRequest("POST", "/shiftdays", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to test request: %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("expected status 200; got %d", resp.StatusCode)
	}

	var result models.APIResponse
	json.NewDecoder(resp.Body).Decode(&result)
	if !result.Success {
		t.Errorf("expected success true; got false")
	}
}

func TestHandleGetAllShiftDays(t *testing.T) {
	app := database.SetupTestDB(t,
		&models.ShiftDay{},
		&models.ShiftWeek{},
		&models.ShiftType{},
		&models.User{},
	)
	setupShiftDayRoutes(app)

	// Create prerequisites and test shift day
	database.GetDB().Create(&models.ShiftWeek{
		StartDate: parseTime("2024-01-22"),
		EndDate:   parseTime("2024-01-28"),
	})
	database.GetDB().Create(&models.ShiftType{Name: "Early"})
	database.GetDB().Create(&models.User{Name: "Test User", Email: "test@example.com"})
	database.GetDB().Create(&models.ShiftDay{
		Date:        parseTime("2024-01-22"),
		ShiftWeekID: 1,
		ShiftTypeID: 1,
		UserID:      1,
	})

	req := httptest.NewRequest("GET", "/shiftdays", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to test request: %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("expected status 200; got %d", resp.StatusCode)
	}

	var result models.APIResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	dataJSON, err := json.Marshal(result.Data)
	if err != nil {
		t.Fatalf("failed to marshal data: %v", err)
	}

	var shiftDays []models.ShiftDay
	if err := json.Unmarshal(dataJSON, &shiftDays); err != nil {
		t.Fatalf("failed to unmarshal shift days: %v", err)
	}

	if len(shiftDays) != 1 {
		t.Errorf("expected 1 shift day; got %d", len(shiftDays))
	}
}
