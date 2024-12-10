package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
)

// @Summary Get all shift days
// @Description Fetch all shift days with related data
// @Tags shiftdays
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /shiftdays [get]
func HandleAllShiftDays(c *fiber.Ctx) error {
	var shiftDays []models.ShiftDay
	result := database.GetDB().
		Preload("ShiftWeek.Department").
		Preload("ShiftType").
		Preload("User.Department").
		Find(&shiftDays)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse("Schichttage erfolgreich abgerufen", shiftDays))
}

// @Summary Create a shift day
// @Description Create a new shift day with validations
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param shiftday body models.ShiftDay true "ShiftDay Data"
// @Success 201 {object} responses.APIResponse
// @Failure 400 {object} responses.APIResponse
// @Router /shiftdays [post]
func HandleCreateShiftDay(c *fiber.Ctx) error {
	shiftDay := new(models.ShiftDay)
	if err := c.BodyParser(shiftDay); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if shiftDay.Date.IsZero() {
		return c.Status(400).JSON(responses.ErrorResponse("Datum ist erforderlich"))
	}

	if shiftDay.ShiftWeekID == 0 || shiftDay.ShiftTypeID == 0 || shiftDay.UserID == 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Schichtwoche, Schichttyp und Benutzer sind erforderlich"))
	}

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, shiftDay.ShiftWeekID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	if shiftDay.Date.Before(shiftWeek.StartDate) || shiftDay.Date.After(shiftWeek.EndDate) {
		return c.Status(400).JSON(responses.ErrorResponse("Datum muss innerhalb der Schichtwoche liegen"))
	}

	if err := database.GetDB().First(&models.ShiftType{}, shiftDay.ShiftTypeID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Schichttyp nicht gefunden"))
	}

	var user models.User
	if err := database.GetDB().Preload("Department").First(&user, shiftDay.UserID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer nicht gefunden"))
	}

	if user.DepartmentID != shiftWeek.DepartmentID {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer muss zur gleichen Abteilung wie die Schichtwoche gehören"))
	}

	var existingShift models.ShiftDay
	if err := database.GetDB().Where("date = ? AND user_id = ?", shiftDay.Date, shiftDay.UserID).First(&existingShift).Error; err == nil {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer hat bereits eine Schicht an diesem Tag"))
	}

	result := database.GetDB().Create(&shiftDay)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	database.GetDB().
		Preload("ShiftWeek.Department").
		Preload("ShiftType").
		Preload("User.Department").
		First(&shiftDay, shiftDay.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Schichttag erfolgreich erstellt", shiftDay))
}

// @Summary Get a single shift day
// @Description Get shift day details by ID
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "ShiftDay ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Router /shiftdays/{id} [get]
func HandleGetOneShiftDay(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftDay models.ShiftDay
	if err := database.GetDB().
		Preload("ShiftWeek.Department").
		Preload("ShiftType").
		Preload("User.Department").
		First(&shiftDay, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichttag nicht gefunden"))
	}

	return c.JSON(responses.SuccessResponse("Schichttag erfolgreich abgerufen", shiftDay))
}

// @Summary Update a shift day
// @Description Update shift day information by ID
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "ShiftDay ID"
// @Param shiftday body models.ShiftDay true "Updated ShiftDay Data"
// @Success 200 {object} responses.APIResponse
// @Failure 400,404 {object} responses.APIResponse
// @Router /shiftdays/{id} [put]
func HandleUpdateShiftDay(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftDay models.ShiftDay
	if err := database.GetDB().First(&shiftDay, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichttag nicht gefunden"))
	}

	if err := c.BodyParser(&shiftDay); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if shiftDay.Date.IsZero() {
		return c.Status(400).JSON(responses.ErrorResponse("Datum ist erforderlich"))
	}

	if shiftDay.ShiftWeekID == 0 || shiftDay.ShiftTypeID == 0 || shiftDay.UserID == 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Schichtwoche, Schichttyp und Benutzer sind erforderlich"))
	}

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, shiftDay.ShiftWeekID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	if shiftDay.Date.Before(shiftWeek.StartDate) || shiftDay.Date.After(shiftWeek.EndDate) {
		return c.Status(400).JSON(responses.ErrorResponse("Datum muss innerhalb der Schichtwoche liegen"))
	}

	if err := database.GetDB().First(&models.ShiftType{}, shiftDay.ShiftTypeID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Schichttyp nicht gefunden"))
	}

	var user models.User
	if err := database.GetDB().Preload("Department").First(&user, shiftDay.UserID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer nicht gefunden"))
	}

	if user.DepartmentID != shiftWeek.DepartmentID {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer muss zur gleichen Abteilung wie die Schichtwoche gehören"))
	}

	var existingShift models.ShiftDay
	if err := database.GetDB().Where("date = ? AND user_id = ? AND id != ?", shiftDay.Date, shiftDay.UserID, id).First(&existingShift).Error; err == nil {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer hat bereits eine Schicht an diesem Tag"))
	}

	if err := database.GetDB().Save(&shiftDay).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	database.GetDB().
		Preload("ShiftWeek.Department").
		Preload("ShiftType").
		Preload("User.Department").
		First(&shiftDay, id)

	return c.JSON(responses.SuccessResponse("Schichttag erfolgreich aktualisiert", shiftDay))
}

// @Summary Delete a shift day
// @Description Delete shift day by ID
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "ShiftDay ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /shiftdays/{id} [delete]
func HandleDeleteShiftDay(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftDay models.ShiftDay
	if err := database.GetDB().First(&shiftDay, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichttag nicht gefunden"))
	}

	result := database.GetDB().Delete(&shiftDay)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse("Schichttag erfolgreich gelöscht", nil))
}
