package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
)

// @Summary Get all shift weeks
// @Description Fetch all shift weeks with related data
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse
// @Failure 500 {object} models.APIResponse
// @Router /shiftweeks [get]
func HandleAllShiftWeeks(c *fiber.Ctx) error {
	var shiftWeeks []models.ShiftWeek
	result := database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.User").
		Find(&shiftWeeks)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}
	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftWeeks successfully retrieved",
		Data:    shiftWeeks,
	})
}

// @Summary Create a shift week
// @Description Create a new shift week with validations
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param shiftweek body models.ShiftWeek true "ShiftWeek Data"
// @Success 201 {object} models.APIResponse
// @Failure 400 {object} models.APIResponse
// @Router /shiftweeks [post]
func HandleCreateShiftWeek(c *fiber.Ctx) error {
	shiftWeek := new(models.ShiftWeek)
	if err := c.BodyParser(shiftWeek); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	// Validate required fields
	if shiftWeek.DepartmentID == 0 {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Department ID is required",
		})
	}

	if shiftWeek.StartDate.IsZero() || shiftWeek.EndDate.IsZero() {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Start date and end date are required",
		})
	}

	// Validate Department exists
	var department models.Department
	if err := database.GetDB().First(&department, shiftWeek.DepartmentID).Error; err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Department not found",
		})
	}

	// Validate end date is after start date
	if shiftWeek.EndDate.Before(shiftWeek.StartDate) {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "End date must be after start date",
		})
	}

	result := database.GetDB().Create(&shiftWeek)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	// Reload with relationships
	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.User").
		First(&shiftWeek, shiftWeek.ID)

	return c.Status(201).JSON(models.APIResponse{
		Success: true,
		Message: "ShiftWeek successfully created",
		Data:    shiftWeek,
	})
}

// @Summary Get a single shift week
// @Description Get shift week details by ID
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "ShiftWeek ID"
// @Success 200 {object} models.APIResponse
// @Failure 404 {object} models.APIResponse
// @Router /shiftweeks/{id} [get]
func HandleGetOneShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.User").
		First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftWeek not found",
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftWeek successfully retrieved",
		Data:    shiftWeek,
	})
}

// @Summary Update a shift week
// @Description Update shift week information by ID
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "ShiftWeek ID"
// @Param shiftweek body models.ShiftWeek true "Updated ShiftWeek Data"
// @Success 200 {object} models.APIResponse
// @Failure 400,404 {object} models.APIResponse
// @Router /shiftweeks/{id} [put]
func HandleUpdateShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftWeek not found",
		})
	}

	if err := c.BodyParser(&shiftWeek); err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Invalid input",
		})
	}

	// Validate required fields
	if shiftWeek.DepartmentID == 0 {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Department ID is required",
		})
	}

	// Validate Department exists
	if err := database.GetDB().First(&models.Department{}, shiftWeek.DepartmentID).Error; err != nil {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Department not found",
		})
	}

	// Validate dates
	if shiftWeek.StartDate.IsZero() || shiftWeek.EndDate.IsZero() {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "Start date and end date are required",
		})
	}

	if shiftWeek.EndDate.Before(shiftWeek.StartDate) {
		return c.Status(400).JSON(models.APIResponse{
			Success: false,
			Error:   "End date must be after start date",
		})
	}

	if err := database.GetDB().Save(&shiftWeek).Error; err != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
	}

	// Reload with relationships
	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.User").
		First(&shiftWeek, id)

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftWeek successfully updated",
		Data:    shiftWeek,
	})
}

// @Summary Delete a shift week
// @Description Delete shift week by ID
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "ShiftWeek ID"
// @Success 200 {object} models.APIResponse
// @Failure 404,500 {object} models.APIResponse
// @Router /shiftweeks/{id} [delete]
func HandleDeleteShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(models.APIResponse{
			Success: false,
			Error:   "ShiftWeek not found",
		})
	}

	result := database.GetDB().Delete(&shiftWeek)
	if result.Error != nil {
		return c.Status(500).JSON(models.APIResponse{
			Success: false,
			Error:   result.Error.Error(),
		})
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Message: "ShiftWeek successfully deleted",
	})
}
