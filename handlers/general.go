package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// HealthCheckHandler gibt den Status der Anwendung zurück
func HealthCheckHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}
