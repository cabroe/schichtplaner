package routes

import (
	"schichtplaner/handlers"

	"github.com/labstack/echo/v4"
)

// RegisterUserRoutes registriert alle User-bezogenen API-Routen
func RegisterUserRoutes(api *echo.Group) {
	// User endpoints
	api.GET("/users", handlers.GetUsers)
	api.GET("/users/active", handlers.GetActiveUsers)
	api.GET("/users/:id", handlers.GetUser)
	api.POST("/users", handlers.CreateUser)
	api.PUT("/users/:id", handlers.UpdateUser)
	api.DELETE("/users/:id", handlers.DeleteUser)
}
