package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

type CreateShiftTypeDTO struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Duration    string `json:"duration"`
}

// @Summary Get all shift types
// @Tags shifttypes
// @Produce json
// @Success 200 {object} models.APIResponse
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
		Data:    shiftTypes,
	})
}

// @Summary Create shift type
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param shifttype body CreateShiftTypeDTO true "ShiftType Data"
// @Success 200 {object} models.APIResponse
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
			Error:   result.Error.Error(),
			Success: false,
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    shiftType,
	})
}
