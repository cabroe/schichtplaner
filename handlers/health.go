package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
)

type HealthData struct {
	Status    string `json:"status"`
	Database  string `json:"database"`
	Timestamp string `json:"timestamp"`
}

// @Summary Zeigt den Status des Servers
// @Description Gibt den Status des Servers und seiner Komponenten zurück
// @Tags health
// @Accept */*
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 503 {object} responses.APIResponse
// @Router /health [get]
func HandleHealthCheck(c *fiber.Ctx) error {
	sqlDB, err := database.GetDB().DB()
	dbStatus := "online"

	healthData := HealthData{
		Status:    "gesund",
		Database:  dbStatus,
		Timestamp: time.Now().Format(time.RFC3339),
	}

	if err != nil || sqlDB.Ping() != nil {
		healthData.Status = "ungesund"
		healthData.Database = "offline"
		return c.Status(503).JSON(responses.ErrorResponse("System ist nicht verfügbar"))
	}

	return c.JSON(responses.SuccessResponse("System läuft einwandfrei", healthData))
}
