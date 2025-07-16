package routes

import (
	"schichtplaner/handlers"

	"github.com/labstack/echo/v4"
)

// RegisterShiftRoutes registriert alle Shift-bezogenen API-Routen
func RegisterShiftRoutes(api *echo.Group) {
	// Shift endpoints
	api.GET("/shifts", handlers.GetShifts)
	api.GET("/shifts/:id", handlers.GetShift)
	api.POST("/shifts", handlers.CreateShift)
	api.PUT("/shifts/:id", handlers.UpdateShift)
	api.DELETE("/shifts/:id", handlers.DeleteShift)
	api.GET("/users/:user_id/shifts", handlers.GetShiftsByUser)
}
