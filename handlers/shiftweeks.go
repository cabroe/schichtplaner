package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

type CreateShiftWeekDTO struct {
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
	DepartmentID uint   `json:"department_id"`
}

// @Summary Get all shift weeks
// @Tags shiftweeks
// @Produce json
// @Success 200 {object} models.APIResponse
// @Router /shiftweeks [get]
func HandleAllShiftWeeks(c *fiber.Ctx) error {
	var shiftWeeks []models.ShiftWeek
	result := database.GetDB().
		Preload("Department").
		Preload("ShiftDays").
		Find(&shiftWeeks)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}
	return c.JSON(models.APIResponse{
		Success: true,
		Data:    shiftWeeks,
	})
}

// @Summary Create shift week
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param shiftweek body CreateShiftWeekDTO true "ShiftWeek Data"
// @Success 200 {object} models.APIResponse
// @Router /shiftweeks [post]
func HandleCreateShiftWeek(c *fiber.Ctx) error {
	shiftWeek := new(models.ShiftWeek)
	if err := c.BodyParser(shiftWeek); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	result := database.GetDB().Create(&shiftWeek)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    shiftWeek,
	})
}
