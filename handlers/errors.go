package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// NotFoundHandler behandelt 404-Fehler für API-Endpunkte
func NotFoundHandler(c echo.Context) error {
	return c.JSON(http.StatusNotFound, map[string]interface{}{
		"error":   "API-Endpunkt nicht gefunden",
		"message": "Der angeforderte Endpunkt existiert nicht",
		"path":    c.Request().URL.Path,
		"method":  c.Request().Method,
		"status":  http.StatusNotFound,
	})
}

// MethodNotAllowedHandler behandelt 405-Fehler für API-Endpunkte
func MethodNotAllowedHandler(c echo.Context) error {
	return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
		"error":           "HTTP-Methode nicht erlaubt",
		"message":         "Die verwendete HTTP-Methode ist für diesen Endpunkt nicht erlaubt",
		"path":            c.Request().URL.Path,
		"method":          c.Request().Method,
		"allowed_methods": c.Response().Header().Get("Allow"),
		"status":          http.StatusMethodNotAllowed,
	})
}

// InternalServerErrorHandler behandelt 500-Fehler für API-Endpunkte
func InternalServerErrorHandler(err error, c echo.Context) {
	code := http.StatusInternalServerError
	if he, ok := err.(*echo.HTTPError); ok {
		code = he.Code
	}

	c.JSON(code, map[string]interface{}{
		"error":   "Interner Server-Fehler",
		"message": "Ein unerwarteter Fehler ist aufgetreten",
		"path":    c.Request().URL.Path,
		"method":  c.Request().Method,
		"status":  code,
	})
}
