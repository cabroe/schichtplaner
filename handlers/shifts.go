package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func RegisterShiftRoutes(api *echo.Group) {
	shifts := api.Group("/shifts")
	shifts.GET("", getShifts)
	shifts.POST("", createShift)
	shifts.GET("/:id", getShift)
	shifts.PUT("/:id", updateShift)
	shifts.DELETE("/:id", deleteShift)
}

func getShifts(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"shifts": []string{},
		"message": "Schichtplan API - Liste aller Schichten",
	})
}

func createShift(c echo.Context) error {
	return c.JSON(http.StatusCreated, map[string]string{
		"message": "Schicht erstellt",
	})
}

func getShift(c echo.Context) error {
	id := c.Param("id")
	return c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
		"message": "Schicht Details",
	})
}

func updateShift(c echo.Context) error {
	id := c.Param("id")
	return c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
		"message": "Schicht aktualisiert",
	})
}

func deleteShift(c echo.Context) error {
	id := c.Param("id")
	return c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
		"message": "Schicht gelöscht",
	})
}
