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

func setupShiftTypeRoutes(app *fiber.App) {
	app.Post("/shifttypes", HandleCreateShiftType)
	app.Get("/shifttypes", HandleAllShiftTypes)
}

func TestHandleCreateShiftType(t *testing.T) {
	app := database.SetupTestDB(t, &models.ShiftType{})
	setupShiftTypeRoutes(app)

	shiftType := CreateShiftTypeDTO{
		Name:        "Early Shift",
		Description: "Morning shift from 6am to 2pm",
		Duration:    "8h",
	}

	payload, _ := json.Marshal(shiftType)
	req := httptest.NewRequest("POST", "/shifttypes", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to test request: %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("expected status 200; got %d", resp.StatusCode)
	}
}

func TestHandleGetAllShiftTypes(t *testing.T) {
	app := database.SetupTestDB(t, &models.ShiftType{})
	setupShiftTypeRoutes(app)

	database.GetDB().Create(&models.ShiftType{
		Name:        "Early Shift",
		Description: "Morning shift from 6am to 2pm",
		Duration:    "8h",
	})

	req := httptest.NewRequest("GET", "/shifttypes", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to test request: %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("expected status 200; got %d", resp.StatusCode)
	}
}
