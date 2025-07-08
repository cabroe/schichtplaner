package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func RegisterReportRoutes(api *echo.Group) {
	reports := api.Group("/reports")
	reports.GET("", getReports)
	reports.GET("/shifts", getShiftReports)
	reports.GET("/employees", getEmployeeReports)
	reports.GET("/export", exportReports)
}

func getReports(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"reports": []string{},
		"message": "Berichte API - Übersicht aller Berichte",
	})
}

func getShiftReports(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"report_type": "shifts",
		"message": "Schichtplan-Berichte",
	})
}

func getEmployeeReports(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"report_type": "employees",
		"message": "Mitarbeiter-Berichte",
	})
}

func exportReports(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Berichte exportiert",
		"format": "csv",
	})
}
