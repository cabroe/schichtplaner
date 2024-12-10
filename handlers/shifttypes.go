package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

// @Summary Get all shift types
// @Description Fetch all shift types
// @Tags shifttypes
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /shifttypes [get]
func HandleAllShiftTypes(c *fiber.Ctx) error {
	var shiftTypes []models.ShiftType
	result := database.GetDB().Find(&shiftTypes)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}
	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftTypes successfully retrieved",
		Data:    shiftTypes,
	})
}

// @Summary Create a shift type
// @Description Create a new shift type
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param shifttype body models.ShiftType true "ShiftType information"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /shifttypes [post]
func HandleCreateShiftType(c *fiber.Ctx) error {
	shiftType := new(models.ShiftType)
	if err := c.BodyParser(shiftType); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	result := database.GetDB().Create(&shiftType)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftType successfully created",
		Data:    shiftType,
	})
}

// @Summary Get a single shift type
// @Description Get shift type details by ID
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "ShiftType ID"
// @Success 200 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
// @Router /shifttypes/{id} [get]
func HandleGetOneShiftType(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftType models.ShiftType
	if err := database.GetDB().First(&shiftType, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftType not found",
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftType successfully retrieved",
		Data:    shiftType,
	})
}

// @Summary Update a shift type
// @Description Update shift type information by ID
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "ShiftType ID"
// @Param shifttype body models.ShiftType true "Updated shift type information"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
// @Router /shifttypes/{id} [put]
func HandleUpdateShiftType(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftType models.ShiftType
	if err := database.GetDB().First(&shiftType, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftType not found",
		})
	}

	if err := c.BodyParser(&shiftType); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	database.GetDB().Save(&shiftType)
	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftType successfully updated",
		Data:    shiftType,
	})
}

// @Summary Delete a shift type
// @Description Delete shift type by ID
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "ShiftType ID"
// @Success 200 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /shifttypes/{id} [delete]
func HandleDeleteShiftType(c *fiber.Ctx) error {
	id := c.Params("id")

	result := database.GetDB().Delete(&models.ShiftType{}, id)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftType successfully deleted",
	})
}
