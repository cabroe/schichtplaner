package api

import (
	"net/http"
	"strconv"

	"github.com/danhawkins/go-vite-react-example/db"
	"github.com/danhawkins/go-vite-react-example/models"
	"github.com/labstack/echo/v4"
)

// getAllShiftTypes returns all shift types from the database
func getAllShiftTypes(c echo.Context) error {
	var shiftTypes []models.ShiftType
	
	result := db.DB.Preload("Team").Preload("CreatedByUser").Find(&shiftTypes)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch shift types"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"shiftTypes": shiftTypes,
		"count":      len(shiftTypes),
	})
}

// getShiftTypeByID returns a specific shift type by ID
func getShiftTypeByID(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid shift type ID"})
	}

	var shiftType models.ShiftType
	result := db.DB.Preload("Team").Preload("CreatedByUser").First(&shiftType, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Shift type not found"})
	}

	return c.JSON(http.StatusOK, shiftType)
}

// createShiftType creates a new shift type
func createShiftType(c echo.Context) error {
	var shiftType models.ShiftType
	if err := c.Bind(&shiftType); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	result := db.DB.Create(&shiftType)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create shift type"})
	}

	return c.JSON(http.StatusCreated, shiftType)
}

// updateShiftType updates an existing shift type
func updateShiftType(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid shift type ID"})
	}

	var shiftType models.ShiftType
	result := db.DB.First(&shiftType, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Shift type not found"})
	}

	if err := c.Bind(&shiftType); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	result = db.DB.Save(&shiftType)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update shift type"})
	}

	return c.JSON(http.StatusOK, shiftType)
}

// deleteShiftType deletes a shift type by ID
func deleteShiftType(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid shift type ID"})
	}

	result := db.DB.Delete(&models.ShiftType{}, id)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete shift type"})
	}

	if result.RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Shift type not found"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Shift type deleted successfully"})
}
