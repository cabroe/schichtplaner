package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
)

// @Summary Systemstatus abrufen
// @Description Prüft ob das System verfügbar ist
// @Tags health
// @Accept */*
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 503 {object} responses.APIResponse
// @Router /api/v1/health [get]
func HandleHealthCheck(c *fiber.Ctx) error {
	if err := database.ValidateConnection(); err != nil {
		return c.Status(503).JSON(responses.ErrorResponse("System nicht verfügbar"))
	}
	return c.JSON(responses.SuccessResponse("OK", nil))
}
