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
	Version   string `json:"version"`
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
	dbStatus := "online"
	systemStatus := "gesund"

	// Prüfe Datenbankverbindung
	if err := database.ValidateConnection(); err != nil {
		dbStatus = "offline"
		systemStatus = "ungesund"
		return c.Status(503).JSON(responses.ErrorResponse("System ist nicht verfügbar"))
	}

	healthData := HealthData{
		Status:    systemStatus,
		Database:  dbStatus,
		Timestamp: time.Now().Format(time.RFC3339),
		Version:   "1.0.0",
	}

	return c.JSON(responses.SuccessResponse("System läuft einwandfrei", healthData))
}
