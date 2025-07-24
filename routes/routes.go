package routes

import (
	"schichtplaner/handlers"
	"schichtplaner/utils"

	"github.com/labstack/echo/v4"
)

// RegisterAPIRoutes registriert alle API-Routen
func RegisterAPIRoutes(e *echo.Echo) {
	api := e.Group("/api")
	
	// Add authentication middleware to all API routes except public ones
	api.Use(utils.BasicAuthMiddleware())

	// Registriere alle Routen-Gruppen
	RegisterGeneralRoutes(api)
	RegisterUserRoutes(api)
	RegisterShiftRoutes(api)
	RegisterScheduleRoutes(api)
	RegisterShiftTypeRoutes(api)
	RegisterTeamRoutes(api)
	RegisterShiftTemplateRoutes(api)

	// Registriere benutzerdefinierte Error-Handler für API-Endpunkte
	registerErrorHandlers(e)
}

// registerErrorHandlers registriert die benutzerdefinierten Error-Handler
func registerErrorHandlers(e *echo.Echo) {
	// Setze den benutzerdefinierten HTTP-Error-Handler
	e.HTTPErrorHandler = handlers.InternalServerErrorHandler

	// Registriere Catch-all Routen für nicht existierende API-Endpunkte
	// Diese müssen auf der Haupt-Echo-Instanz registriert werden, nicht in der API-Gruppe
	e.GET("/api/*", handlers.NotFoundHandler)
	e.POST("/api/*", handlers.NotFoundHandler)
	e.PUT("/api/*", handlers.NotFoundHandler)
	e.DELETE("/api/*", handlers.NotFoundHandler)
	e.PATCH("/api/*", handlers.NotFoundHandler)
	e.HEAD("/api/*", handlers.NotFoundHandler)
	e.OPTIONS("/api/*", handlers.NotFoundHandler)
}
