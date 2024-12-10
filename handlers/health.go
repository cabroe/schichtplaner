package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
)

type HealthResponse struct {
	Status    string `json:"status"`
	Database  string `json:"database"`
	Timestamp string `json:"timestamp"`
}

// @Summary Show the status of server.
// @Description get the status of server and its components.
// @Tags health
// @Accept */*
// @Produce json
// @Success 200 {object} HealthResponse
// @Failure 503 {object} HealthResponse
// @Router /health [get]
func HandleHealthCheck(c *fiber.Ctx) error {
	// Check database connection
	sqlDB, err := database.GetDB().DB()
	dbStatus := "up"
	if err != nil || sqlDB.Ping() != nil {
		dbStatus = "down"
		return c.Status(503).JSON(HealthResponse{
			Status:    "unhealthy",
			Database:  dbStatus,
			Timestamp: time.Now().Format(time.RFC3339),
		})
	}

	return c.JSON(HealthResponse{
		Status:    "healthy",
		Database:  dbStatus,
		Timestamp: time.Now().Format(time.RFC3339),
	})
}
