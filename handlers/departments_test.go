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

func setupDepartmentRoutes(app *fiber.App) {
	app.Post("/departments", HandleCreateDepartment)
	app.Get("/departments", HandleAllDepartments)
}

func TestHandleCreateDepartment(t *testing.T) {
	app := database.SetupTestDB(t, &models.Department{})
	setupDepartmentRoutes(app)

	department := CreateDepartmentDTO{
		Name: "Test Department",
	}

	payload, _ := json.Marshal(department)
	req := httptest.NewRequest("POST", "/departments", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to test request: %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("expected status 200; got %d", resp.StatusCode)
	}
}

func TestHandleGetAllDepartments(t *testing.T) {
	app := database.SetupTestDB(t, &models.Department{})
	setupDepartmentRoutes(app)

	database.GetDB().Create(&models.Department{
		Name: "Test Department",
	})

	req := httptest.NewRequest("GET", "/departments", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("failed to test request: %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("expected status 200; got %d", resp.StatusCode)
	}
}
