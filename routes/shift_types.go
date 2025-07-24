package routes

import (
	"schichtplaner/handlers"

	"github.com/labstack/echo/v4"
)

// RegisterShiftTypeRoutes registriert alle ShiftType-bezogenen API-Routen
func RegisterShiftTypeRoutes(api *echo.Group) {
	// ShiftType endpoints
	api.GET("/shift-types", handlers.GetShiftTypes)
	api.GET("/shift-types/active", handlers.GetActiveShiftTypes)
	api.GET("/shift-types/:id", handlers.GetShiftType)
	api.POST("/shift-types", handlers.CreateShiftType)
	api.PUT("/shift-types/:id", handlers.UpdateShiftType)
	api.DELETE("/shift-types/:id", handlers.DeleteShiftType)
	api.PATCH("/shift-types/:id/toggle", handlers.ToggleShiftTypeActive)
	api.PUT("/shift-types/order", handlers.UpdateShiftTypeOrder)
}
