package api

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// RegisterHandlers registriert alle API-Routen
func RegisterHandlers(e *echo.Echo) {
	// Setup the API Group
	api := e.Group("/api")

	// Basic API endpoint
	api.GET("/message", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"message": "Hello, from the golang World!"})
	})
}
