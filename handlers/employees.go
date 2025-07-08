package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/models"

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
	// Parse pagination parameters
	limit, err := strconv.Atoi(c.QueryParam("limit"))
	if err != nil || limit == 0 {
		limit = 10 // Default limit
	}
	
	offset, err := strconv.Atoi(c.QueryParam("offset"))
	if err != nil || offset < 0 {
		offset = 0 // Default offset
	}
	
	// Check if pagination is requested
	if c.QueryParam("limit") != "" || c.QueryParam("offset") != "" {
		// Return paginated response
		result, err := models.GetEmployeesPaginated(limit, offset)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
		}
		return c.JSON(http.StatusOK, result)
	}
	
	// Return all employees (backwards compatibility)
	employees := models.GetAllEmployees()
	return c.JSON(http.StatusOK, employees)
}

func createEmployee(c echo.Context) error {
	req := new(models.EmployeeCreateRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	
	if err := c.Validate(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	
	employee := models.CreateEmployee(req)
	return c.JSON(http.StatusCreated, employee)
}

func getEmployee(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid employee ID")
	}
	
	employee, err := models.GetEmployeeByID(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err.Error())
	}
	
	return c.JSON(http.StatusOK, employee)
}

func updateEmployee(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid employee ID")
	}
	
	req := new(models.EmployeeUpdateRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	
	if err := c.Validate(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	
	employee, err := models.UpdateEmployee(id, req)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err.Error())
	}
	
	return c.JSON(http.StatusOK, employee)
}

func deleteEmployee(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid employee ID")
	}
	
	if err := models.DeleteEmployee(id); err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err.Error())
	}
	
	return c.NoContent(http.StatusNoContent)
}
