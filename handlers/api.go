package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func RegisterAPIRoutes(api *echo.Group) {
	api.GET("/message", getMessage)
}

func getMessage(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Hello, from the golang World!"})
}
