package routes

import (
	"schichtplaner/handlers"

	"github.com/labstack/echo/v4"
)

func RegisterAPIRoutes(e *echo.Echo) {
	api := e.Group("/api")

	// Message endpoint
	api.GET("/message", handlers.GetMessageHandler)

	// User endpoints
	api.GET("/users", handlers.GetUsers)
	api.GET("/users/active", handlers.GetActiveUsers)
	api.GET("/users/:id", handlers.GetUser)
	api.POST("/users", handlers.CreateUser)
	api.PUT("/users/:id", handlers.UpdateUser)
	api.DELETE("/users/:id", handlers.DeleteUser)

	// Shift endpoints
	api.GET("/shifts", handlers.GetShifts)
	api.GET("/shifts/:id", handlers.GetShift)
	api.POST("/shifts", handlers.CreateShift)
	api.PUT("/shifts/:id", handlers.UpdateShift)
	api.DELETE("/shifts/:id", handlers.DeleteShift)
	api.GET("/users/:user_id/shifts", handlers.GetShiftsByUser)

	// Schedule endpoints
	api.GET("/schedules", handlers.GetSchedules)
	api.GET("/schedules/active", handlers.GetActiveSchedules)
	api.GET("/schedules/:id", handlers.GetSchedule)
	api.POST("/schedules", handlers.CreateSchedule)
	api.PUT("/schedules/:id", handlers.UpdateSchedule)
	api.DELETE("/schedules/:id", handlers.DeleteSchedule)
}
