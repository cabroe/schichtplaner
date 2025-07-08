package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func RegisterEmployeeRoutes(api *echo.Group) {
	employees := api.Group("/employees")
	employees.GET("", getEmployees)
	employees.POST("", createEmployee)
	employees.GET("/:id", getEmployee)
	employees.PUT("/:id", updateEmployee)
	employees.DELETE("/:id", deleteEmployee)
}

func getEmployees(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"employees": []string{},
		"message": "Mitarbeiter API - Liste aller Mitarbeiter",
	})
}

func createEmployee(c echo.Context) error {
	return c.JSON(http.StatusCreated, map[string]string{
		"message": "Mitarbeiter erstellt",
	})
}

func getEmployee(c echo.Context) error {
	id := c.Param("id")
	return c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
		"message": "Mitarbeiter Details",
	})
}

func updateEmployee(c echo.Context) error {
	id := c.Param("id")
	return c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
		"message": "Mitarbeiter aktualisiert",
	})
}

func deleteEmployee(c echo.Context) error {
	id := c.Param("id")
	return c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
		"message": "Mitarbeiter gelöscht",
	})
}
