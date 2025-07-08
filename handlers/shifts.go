package handlers

import (
	"net/http"
	"strconv"

	"schichtplaner/models"

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
	shifts := models.GetAllShifts()
	return c.JSON(http.StatusOK, shifts)
}

func createShift(c echo.Context) error {
	req := new(models.ShiftCreateRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	
	if err := c.Validate(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	
	shift, err := models.CreateShift(req)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	
	return c.JSON(http.StatusCreated, shift)
}

func getShift(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid shift ID")
	}
	
	shift, err := models.GetShiftByID(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err.Error())
	}
	
	return c.JSON(http.StatusOK, shift)
}

func updateShift(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid shift ID")
	}
	
	req := new(models.ShiftUpdateRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	
	if err := c.Validate(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	
	shift, err := models.UpdateShift(id, req)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err.Error())
	}
	
	return c.JSON(http.StatusOK, shift)
}

func deleteShift(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid shift ID")
	}
	
	if err := models.DeleteShift(id); err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err.Error())
	}
	
	return c.NoContent(http.StatusNoContent)
}
