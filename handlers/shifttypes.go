package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
)

// @Summary Get all shift types
// @Description Fetch all shift types with their relationships
// @Tags shifttypes
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/shifttypes [get]
func HandleAllShiftTypes(c *fiber.Ctx) error {
	var shiftTypes []models.ShiftType
	result := database.GetDB().
		Preload("ShiftDays.User").
		Preload("ShiftDays.ShiftWeek").
		Find(&shiftTypes)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse("Schichttypen erfolgreich abgerufen", shiftTypes))
}

// @Summary Create a shift type
// @Description Create a new shift type with validations
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param shifttype body models.ShiftType true "ShiftType information"
// @Success 201 {object} responses.APIResponse
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/shifttypes [post]
func HandleCreateShiftType(c *fiber.Ctx) error {
	shiftType := new(models.ShiftType)
	if err := c.BodyParser(shiftType); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if shiftType.Name == "" || shiftType.Color == "" {
		return c.Status(400).JSON(responses.ErrorResponse("Name und Farbe sind erforderlich"))
	}

	result := database.GetDB().Create(&shiftType)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	database.GetDB().
		Preload("ShiftDays.User").
		Preload("ShiftDays.ShiftWeek").
		First(&shiftType, shiftType.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Schichttyp erfolgreich erstellt", shiftType))
}

// @Summary Get a single shift type
// @Description Get shift type details by ID with relationships
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "ShiftType ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shifttypes/{id} [get]
func HandleGetOneShiftType(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftType models.ShiftType
	if err := database.GetDB().
		Preload("ShiftDays.User").
		Preload("ShiftDays.ShiftWeek").
		First(&shiftType, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichttyp nicht gefunden"))
	}

	return c.JSON(responses.SuccessResponse("Schichttyp erfolgreich abgerufen", shiftType))
}

// @Summary Update a shift type
// @Description Update shift type information by ID with validations
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "ShiftType ID"
// @Param shifttype body models.ShiftType true "Updated shift type information"
// @Success 200 {object} responses.APIResponse
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/shifttypes/{id} [put]
func HandleUpdateShiftType(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftType models.ShiftType
	if err := database.GetDB().First(&shiftType, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichttyp nicht gefunden"))
	}

	if err := c.BodyParser(&shiftType); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if shiftType.Name == "" || shiftType.Color == "" {
		return c.Status(400).JSON(responses.ErrorResponse("Name und Farbe sind erforderlich"))
	}

	if err := database.GetDB().Save(&shiftType).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	database.GetDB().
		Preload("ShiftDays.User").
		Preload("ShiftDays.ShiftWeek").
		First(&shiftType, id)

	return c.JSON(responses.SuccessResponse("Schichttyp erfolgreich aktualisiert", shiftType))
}

// @Summary Delete a shift type
// @Description Delete shift type by ID
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "ShiftType ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/shifttypes/{id} [delete]
func HandleDeleteShiftType(c *fiber.Ctx) error {
	id := c.Params("id")

	var shiftType models.ShiftType
	if err := database.GetDB().First(&shiftType, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichttyp nicht gefunden"))
	}

	result := database.GetDB().Delete(&shiftType)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse("Schichttyp erfolgreich gelöscht", nil))
}
