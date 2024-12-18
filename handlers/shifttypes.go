package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
)

// @Summary Alle Schichttypen abrufen
// @Description Ruft alle Schichttypen ab
// @Tags shifttypes
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse{data=[]models.ShiftType}
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/shifttypes [get]
func HandleAllShiftTypes(c *fiber.Ctx) error {
	var shiftTypes []models.ShiftType
	result := database.GetDB().Order("name").Find(&shiftTypes)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftTypes))
}

// @Summary Schichttyp erstellen
// @Description Erstellt einen neuen Schichttyp
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param shifttype body models.ShiftType true "Schichttyp-Daten"
// @Success 201 {object} responses.APIResponse{data=models.ShiftType}
// @Failure 400 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/shifttypes [post]
func HandleCreateShiftType(c *fiber.Ctx) error {
	shiftType := new(models.ShiftType)
	if err := c.BodyParser(shiftType); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	result := database.GetDB().Create(&shiftType)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.Status(201).JSON(responses.SuccessResponse(responses.MsgSuccessCreate, shiftType))
}

// @Summary Einzelnen Schichttyp abrufen
// @Description Ruft einen spezifischen Schichttyp anhand seiner ID ab
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "Schichttyp-ID"
// @Success 200 {object} responses.APIResponse{data=models.ShiftType}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shifttypes/{id} [get]
func HandleGetOneShiftType(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftType models.ShiftType

	if err := database.GetDB().First(&shiftType, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftType))
}

// @Summary Schichttyp aktualisieren
// @Description Aktualisiert einen bestehenden Schichttyp
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "Schichttyp-ID"
// @Param shifttype body models.ShiftType true "Aktualisierte Schichttyp-Daten"
// @Success 200 {object} responses.APIResponse{data=models.ShiftType}
// @Failure 400 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/shifttypes/{id} [put]
func HandleUpdateShiftType(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftType models.ShiftType

	if err := database.GetDB().First(&shiftType, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	if err := c.BodyParser(&shiftType); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	if err := database.GetDB().Save(&shiftType).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessUpdate, shiftType))
}

// @Summary Schichttyp löschen
// @Description Löscht einen Schichttyp
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "Schichttyp-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/shifttypes/{id} [delete]
func HandleDeleteShiftType(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftType models.ShiftType

	if err := database.GetDB().First(&shiftType, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	if err := database.GetDB().Delete(&shiftType).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessDelete, nil))
}
