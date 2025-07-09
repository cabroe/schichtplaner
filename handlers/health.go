package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func RegisterHealthRoutes(api *echo.Group) {
	api.GET("/health", getHealth)
}

func getHealth(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]any{
		"status":  "ok",
		"service": "schichtplaner",
	})
}
