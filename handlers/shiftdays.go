package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

// @Summary Get all shift days
// @Description Fetch all shift days with related data
// @Tags shiftdays
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
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
		Message: "ShiftDays successfully retrieved",
		Data:    shiftDays,
	})
}

// @Summary Create a shift day
// @Description Create a new shift day with validations
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param shiftday body models.ShiftDay true "ShiftDay Data"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /shiftdays [post]
func HandleCreateShiftDay(c *fiber.Ctx) error {
	shiftDay := new(models.ShiftDay)
	if err := c.BodyParser(shiftDay); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	// Validate ShiftWeek exists
	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, shiftDay.ShiftWeekID).Error; err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftWeek not found",
		})
	}

	// Validate ShiftType exists
	var shiftType models.ShiftType
	if err := database.GetDB().First(&shiftType, shiftDay.ShiftTypeID).Error; err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftType not found",
		})
	}

	// Validate User exists
	var user models.User
	if err := database.GetDB().First(&user, shiftDay.UserID).Error; err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "User not found",
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
		Message: "ShiftDay successfully created",
		Data:    shiftDay,
	})
}

// @Summary Get a single shift day
// @Description Get shift day details by ID
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "ShiftDay ID"
// @Success 200 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
// @Router /shiftdays/{id} [get]
func HandleGetOneShiftDay(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftDay models.ShiftDay
	if err := database.GetDB().
		Preload("ShiftWeek").
		Preload("ShiftType").
		Preload("User").
		First(&shiftDay, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftDay not found",
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftDay successfully retrieved",
		Data:    shiftDay,
	})
}

// @Summary Update a shift day
// @Description Update shift day information by ID
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "ShiftDay ID"
// @Param shiftday body models.ShiftDay true "Updated ShiftDay Data"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
// @Router /shiftdays/{id} [put]
func HandleUpdateShiftDay(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftDay models.ShiftDay
	if err := database.GetDB().First(&shiftDay, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftDay not found",
		})
	}

	if err := c.BodyParser(&shiftDay); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	// Validate ShiftWeek exists
	if err := database.GetDB().First(&models.ShiftWeek{}, shiftDay.ShiftWeekID).Error; err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftWeek not found",
		})
	}

	// Validate ShiftType exists
	if err := database.GetDB().First(&models.ShiftType{}, shiftDay.ShiftTypeID).Error; err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftType not found",
		})
	}

	// Validate User exists
	if err := database.GetDB().First(&models.User{}, shiftDay.UserID).Error; err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "User not found",
		})
	}

	database.GetDB().Save(&shiftDay)
	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftDay successfully updated",
		Data:    shiftDay,
	})
}

// @Summary Delete a shift day
// @Description Delete shift day by ID
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "ShiftDay ID"
// @Success 200 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /shiftdays/{id} [delete]
func HandleDeleteShiftDay(c *fiber.Ctx) error {
	id := c.Params("id")

	result := database.GetDB().Delete(&models.ShiftDay{}, id)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftDay successfully deleted",
	})
}
