package routes

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func RegisterAPIRoutes(e *echo.Echo) {
	api := e.Group("/api")
	api.GET("/message", getMessageHandler)
}

func getMessageHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Hello, from the golang World!"})
}
