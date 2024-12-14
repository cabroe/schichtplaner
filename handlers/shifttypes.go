package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
	"gorm.io/gorm"
)

// @Summary Alle Schichttypen abrufen
// @Description Ruft alle Schichttypen mit ihren Beziehungen ab
// @Tags shifttypes
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/shifttypes [get]
func HandleAllShiftTypes(c *fiber.Ctx) error {
	var shiftTypes []models.ShiftType
	result := database.GetDB().
		Preload("ShiftDays", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, date, shift_type_id, user_id, shift_week_id")
		}).
		Preload("ShiftDays.User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, first_name, last_name, email, color, department_id")
		}).
		Find(&shiftTypes)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse("Schichttypen erfolgreich abgerufen", shiftTypes))
}

// @Summary Schichttyp erstellen
// @Description Erstellt einen neuen Schichttyp mit Validierungen
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param shifttype body models.ShiftType true "Schichttyp-Daten"
// @Success 201 {object} responses.APIResponse
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/shifttypes [post]
func HandleCreateShiftType(c *fiber.Ctx) error {
	shiftType := new(models.ShiftType)
	if err := c.BodyParser(shiftType); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if err := validateShiftType(shiftType); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	result := database.GetDB().Create(&shiftType)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	// Lade die Beziehungen nach der Erstellung
	database.GetDB().
		Preload("ShiftDays.User").
		First(&shiftType, shiftType.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Schichttyp erfolgreich erstellt", shiftType))
}

// @Summary Einzelnen Schichttyp abrufen
// @Description Ruft einen spezifischen Schichttyp ab
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "Schichttyp-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shifttypes/{id} [get]
func HandleGetOneShiftType(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftType models.ShiftType

	result := database.GetDB().
		Preload("ShiftDays.User").
		First(&shiftType, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichttyp nicht gefunden"))
	}

	return c.JSON(responses.SuccessResponse("Schichttyp erfolgreich abgerufen", shiftType))
}

// @Summary Schichttyp aktualisieren
// @Description Aktualisiert einen bestehenden Schichttyp
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "Schichttyp-ID"
// @Param shifttype body models.ShiftType true "Aktualisierte Schichttyp-Daten"
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

	if err := validateShiftType(&shiftType); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	if err := database.GetDB().Save(&shiftType).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	// Lade aktualisierte Beziehungen
	database.GetDB().
		Preload("ShiftDays.User").
		First(&shiftType, id)

	return c.JSON(responses.SuccessResponse("Schichttyp erfolgreich aktualisiert", shiftType))
}

// @Summary Schichttyp löschen
// @Description Löscht einen Schichttyp
// @Tags shifttypes
// @Accept json
// @Produce json
// @Param id path int true "Schichttyp-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/shifttypes/{id} [delete]
func HandleDeleteShiftType(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftType models.ShiftType

	if err := database.GetDB().First(&shiftType, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichttyp nicht gefunden"))
	}

	// Prüfe ob noch Schichttage mit diesem Typ existieren
	var shiftDayCount int64
	database.GetDB().Model(&models.ShiftDay{}).Where("shift_type_id = ?", id).Count(&shiftDayCount)
	if shiftDayCount > 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Schichttyp kann nicht gelöscht werden, da noch Schichttage zugeordnet sind"))
	}

	result := database.GetDB().Delete(&shiftType)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse("Schichttyp erfolgreich gelöscht", nil))
}

// Hilfsfunktion zur Validierung eines Schichttyps
func validateShiftType(shiftType *models.ShiftType) error {
	if shiftType.Name == "" {
		return fmt.Errorf("Name ist erforderlich")
	}
	if shiftType.Description == "" {
		return fmt.Errorf("Beschreibung ist erforderlich")
	}
	if shiftType.Duration == "" {
		return fmt.Errorf("Dauer ist erforderlich")
	}
	if shiftType.Color == "" {
		return fmt.Errorf("Farbe ist erforderlich")
	}
	return nil
}
