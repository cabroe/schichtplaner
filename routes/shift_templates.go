package routes

import (
	"schichtplaner/handlers"

	"github.com/labstack/echo/v4"
)

// RegisterShiftTemplateRoutes registriert alle ShiftTemplate-bezogenen API-Routen
func RegisterShiftTemplateRoutes(api *echo.Group) {
	// ShiftTemplate endpoints
	api.GET("/shift-templates", handlers.GetShiftTemplates)
	api.GET("/shift-templates/active", handlers.GetActiveShiftTemplates)
	api.GET("/shift-templates/:id", handlers.GetShiftTemplate)
	api.POST("/shift-templates", handlers.CreateShiftTemplate)
	api.PUT("/shift-templates/:id", handlers.UpdateShiftTemplate)
	api.DELETE("/shift-templates/:id", handlers.DeleteShiftTemplate)
	api.PATCH("/shift-templates/:id/toggle", handlers.ToggleShiftTemplateActive)
	api.PUT("/shift-templates/order", handlers.UpdateShiftTemplateOrder)
}
