package handlers

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"

	"schichtplaner/models"

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
	reports := models.GetAllReports()
	return c.JSON(http.StatusOK, reports)
}

func getShiftReports(c echo.Context) error {
	shifts := models.GetAllShifts()

	// Create shift report
	report := models.CreateReport(
		"Schichtplan-Bericht",
		"shifts",
		"Übersicht aller Schichten",
		fmt.Sprintf("Anzahl Schichten: %d", len(shifts)),
	)

	return c.JSON(http.StatusOK, map[string]any{
		"report": report,
		"data":   shifts,
	})
}

func getEmployeeReports(c echo.Context) error {
	employees := models.GetAllEmployees()

	// Create employee report
	report := models.CreateReport(
		"Mitarbeiter-Bericht",
		"employees",
		"Übersicht aller Mitarbeiter",
		fmt.Sprintf("Anzahl Mitarbeiter: %d", len(employees)),
	)

	return c.JSON(http.StatusOK, map[string]any{
		"report": report,
		"data":   employees,
	})
}

func exportReports(c echo.Context) error {
	reportType := c.QueryParam("type")
	if reportType == "" {
		reportType = "shifts"
	}

	c.Response().Header().Set("Content-Type", "text/csv")
	c.Response().Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s_report.csv\"", reportType))

	writer := csv.NewWriter(c.Response().Writer)
	defer writer.Flush()

	switch reportType {
	case "shifts":
		shifts := models.GetAllShifts()
		writer.Write([]string{"ID", "Employee ID", "Start Time", "End Time", "Position", "Notes"})
		for _, shift := range shifts {
			writer.Write([]string{
				strconv.Itoa(shift.ID),
				strconv.Itoa(shift.EmployeeID),
				shift.StartTime.Format("2006-01-02 15:04:05"),
				shift.EndTime.Format("2006-01-02 15:04:05"),
				shift.Position,
				shift.Notes,
			})
		}
	case "employees":
		employees := models.GetAllEmployees()
		writer.Write([]string{"ID", "Name", "Email", "Position", "Created At"})
		for _, employee := range employees {
			writer.Write([]string{
				strconv.Itoa(employee.ID),
				employee.Name,
				employee.Email,
				employee.Position,
				employee.CreatedAt.Format("2006-01-02 15:04:05"),
			})
		}
	default:
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid report type")
	}

	return nil
}
