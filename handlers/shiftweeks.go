package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
)

// @Summary Get all shift weeks
// @Description Fetch all shift weeks with related data
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /shiftweeks [get]
func HandleAllShiftWeeks(c *fiber.Ctx) error {
	var shiftWeeks []models.ShiftWeek
	result := database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.User").
		Find(&shiftWeeks)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse("Schichtwochen erfolgreich abgerufen", shiftWeeks))
}

// @Summary Create a shift week
// @Description Create a new shift week with validations
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param shiftweek body models.ShiftWeek true "ShiftWeek Data"
// @Success 201 {object} responses.APIResponse
// @Failure 400 {object} responses.APIResponse
// @Router /shiftweeks [post]
func HandleCreateShiftWeek(c *fiber.Ctx) error {
	shiftWeek := new(models.ShiftWeek)
	if err := c.BodyParser(shiftWeek); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if shiftWeek.DepartmentID == 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Abteilung ist erforderlich"))
	}

	if shiftWeek.StartDate.IsZero() || shiftWeek.EndDate.IsZero() {
		return c.Status(400).JSON(responses.ErrorResponse("Start- und Enddatum sind erforderlich"))
	}

	var department models.Department
	if err := database.GetDB().First(&department, shiftWeek.DepartmentID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Abteilung nicht gefunden"))
	}

	if shiftWeek.EndDate.Before(shiftWeek.StartDate) {
		return c.Status(400).JSON(responses.ErrorResponse("Enddatum muss nach dem Startdatum liegen"))
	}

	result := database.GetDB().Create(&shiftWeek)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.User").
		First(&shiftWeek, shiftWeek.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Schichtwoche erfolgreich erstellt", shiftWeek))
}

// @Summary Get a single shift week
// @Description Get shift week details by ID
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "ShiftWeek ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Router /shiftweeks/{id} [get]
func HandleGetOneShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.User").
		First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	return c.JSON(responses.SuccessResponse("Schichtwoche erfolgreich abgerufen", shiftWeek))
}

// @Summary Update a shift week
// @Description Update shift week information by ID
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "ShiftWeek ID"
// @Param shiftweek body models.ShiftWeek true "Updated ShiftWeek Data"
// @Success 200 {object} responses.APIResponse
// @Failure 400,404 {object} responses.APIResponse
// @Router /shiftweeks/{id} [put]
func HandleUpdateShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	if err := c.BodyParser(&shiftWeek); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if shiftWeek.DepartmentID == 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Abteilung ist erforderlich"))
	}

	if err := database.GetDB().First(&models.Department{}, shiftWeek.DepartmentID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Abteilung nicht gefunden"))
	}

	if shiftWeek.StartDate.IsZero() || shiftWeek.EndDate.IsZero() {
		return c.Status(400).JSON(responses.ErrorResponse("Start- und Enddatum sind erforderlich"))
	}

	if shiftWeek.EndDate.Before(shiftWeek.StartDate) {
		return c.Status(400).JSON(responses.ErrorResponse("Enddatum muss nach dem Startdatum liegen"))
	}

	if err := database.GetDB().Save(&shiftWeek).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	database.GetDB().
		Preload("Department").
		Preload("ShiftDays.ShiftType").
		Preload("ShiftDays.User").
		First(&shiftWeek, id)

	return c.JSON(responses.SuccessResponse("Schichtwoche erfolgreich aktualisiert", shiftWeek))
}

// @Summary Delete a shift week
// @Description Delete shift week by ID
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "ShiftWeek ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /shiftweeks/{id} [delete]
func HandleDeleteShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	result := database.GetDB().Delete(&shiftWeek)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse("Schichtwoche erfolgreich gelöscht", nil))
}
