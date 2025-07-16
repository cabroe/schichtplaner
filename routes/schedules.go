package routes

import (
	"schichtplaner/handlers"

	"github.com/labstack/echo/v4"
)

// RegisterScheduleRoutes registriert alle Schedule-bezogenen API-Routen
func RegisterScheduleRoutes(api *echo.Group) {
	// Schedule endpoints
	api.GET("/schedules", handlers.GetSchedules)
	api.GET("/schedules/active", handlers.GetActiveSchedules)
	api.GET("/schedules/:id", handlers.GetSchedule)
	api.POST("/schedules", handlers.CreateSchedule)
	api.PUT("/schedules/:id", handlers.UpdateSchedule)
	api.DELETE("/schedules/:id", handlers.DeleteSchedule)
}
