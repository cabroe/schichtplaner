package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

type CreateShiftDayDTO struct {
	Date        string `json:"date"`
	ShiftWeekID uint   `json:"shift_week_id"`
	ShiftTypeID uint   `json:"shift_type_id"`
	UserID      uint   `json:"user_id"`
}

// @Summary Get all shift days
// @Tags shiftdays
// @Produce json
// @Success 200 {object} models.APIResponse
// @Router /shiftdays [get]
func HandleAllShiftDays(c *fiber.Ctx) error {
	var shiftDays []models.ShiftDay
	result := database.GetDB().
		Preload("ShiftWeek").
		Preload("ShiftType").
		Preload("User").
		Find(&shiftDays)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}
	return c.JSON(models.APIResponse{
		Success: true,
		Data:    shiftDays,
	})
}

// @Summary Create shift day
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param shiftday body CreateShiftDayDTO true "ShiftDay Data"
// @Success 200 {object} models.APIResponse
// @Router /shiftdays [post]
func HandleCreateShiftDay(c *fiber.Ctx) error {
	shiftDay := new(models.ShiftDay)
	if err := c.BodyParser(shiftDay); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	result := database.GetDB().Create(&shiftDay)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    shiftDay,
	})
}
