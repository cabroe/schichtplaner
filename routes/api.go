package routes

import (
	"schichtplaner/handlers"

	"github.com/labstack/echo/v4"
)

func RegisterAPIRoutes(e *echo.Echo) {
	api := e.Group("/api")
	api.GET("/message", handlers.GetMessageHandler)
}
