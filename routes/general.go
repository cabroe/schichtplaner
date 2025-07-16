package routes

import (
	"schichtplaner/handlers"

	"github.com/labstack/echo/v4"
)

// RegisterGeneralRoutes registriert allgemeine API-Routen
func RegisterGeneralRoutes(api *echo.Group) {
	// Message endpoint
	api.GET("/message", handlers.GetMessageHandler)
	// Health endpoint
	api.GET("/health", handlers.HealthCheckHandler)
}
