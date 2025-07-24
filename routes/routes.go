package routes

import (
	"github.com/labstack/echo/v4"
)

// RegisterAPIRoutes registriert alle API-Routen
func RegisterAPIRoutes(e *echo.Echo) {
	api := e.Group("/api")

	// Registriere alle Routen-Gruppen
	RegisterGeneralRoutes(api)
	RegisterUserRoutes(api)
	RegisterShiftRoutes(api)
	RegisterScheduleRoutes(api)
	RegisterShiftTypeRoutes(api)
	RegisterTeamRoutes(api)
}
