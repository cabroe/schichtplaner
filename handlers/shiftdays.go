package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
	"gorm.io/gorm"
)

// @Summary Alle Schichttage abrufen
// @Description Ruft alle Schichttage mit relevanten Beziehungen ab
// @Tags shiftdays
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/shiftdays [get]
func HandleAllShiftDays(c *fiber.Ctx) error {
	var shiftDays []models.ShiftDay
	result := database.GetDB().
		Preload("ShiftWeek", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, start_date, end_date, department_id")
		}).
		Preload("ShiftType", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, description, duration, color")
		}).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, first_name, last_name, email, color, department_id")
		}).
		Preload("ShiftWeek.Department").
		Find(&shiftDays)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse("Schichttage erfolgreich abgerufen", shiftDays))
}

// @Summary Schichttag erstellen
// @Description Erstellt einen neuen Schichttag mit Validierungen
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param shiftday body models.ShiftDay true "Schichttag-Daten"
// @Success 201 {object} responses.APIResponse
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/shiftdays [post]
func HandleCreateShiftDay(c *fiber.Ctx) error {
	shiftDay := new(models.ShiftDay)
	if err := c.BodyParser(shiftDay); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if err := validateShiftDay(shiftDay); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	// Prüfe Benutzer-Abteilung und Schichtwoche-Abteilung
	var user models.User
	var shiftWeek models.ShiftWeek

	if err := database.GetDB().First(&user, shiftDay.UserID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer nicht gefunden"))
	}

	if err := database.GetDB().First(&shiftWeek, shiftDay.ShiftWeekID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	if user.DepartmentID != shiftWeek.DepartmentID {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer muss zur gleichen Abteilung wie die Schichtwoche gehören"))
	}

	result := database.GetDB().Create(&shiftDay)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	// Lade die Beziehungen nach der Erstellung
	database.GetDB().
		Preload("ShiftWeek.Department").
		Preload("ShiftType").
		Preload("User").
		First(&shiftDay, shiftDay.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Schichttag erfolgreich erstellt", shiftDay))
}

// @Summary Einzelnen Schichttag abrufen
// @Description Ruft einen spezifischen Schichttag ab
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "Schichttag-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shiftdays/{id} [get]
func HandleGetOneShiftDay(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftDay models.ShiftDay

	result := database.GetDB().
		Preload("ShiftWeek.Department").
		Preload("ShiftType").
		Preload("User").
		First(&shiftDay, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichttag nicht gefunden"))
	}

	return c.JSON(responses.SuccessResponse("Schichttag erfolgreich abgerufen", shiftDay))
}

// @Summary Schichttag aktualisieren
// @Description Aktualisiert einen bestehenden Schichttag
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "Schichttag-ID"
// @Param shiftday body models.ShiftDay true "Aktualisierte Schichttag-Daten"
// @Success 200 {object} responses.APIResponse
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/shiftdays/{id} [put]
func HandleUpdateShiftDay(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftDay models.ShiftDay

	if err := database.GetDB().First(&shiftDay, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichttag nicht gefunden"))
	}

	if err := c.BodyParser(&shiftDay); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if err := validateShiftDay(&shiftDay); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	// Prüfe Benutzer-Abteilung und Schichtwoche-Abteilung
	var user models.User
	var shiftWeek models.ShiftWeek

	if err := database.GetDB().First(&user, shiftDay.UserID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer nicht gefunden"))
	}

	if err := database.GetDB().First(&shiftWeek, shiftDay.ShiftWeekID).Error; err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	if user.DepartmentID != shiftWeek.DepartmentID {
		return c.Status(400).JSON(responses.ErrorResponse("Benutzer muss zur gleichen Abteilung wie die Schichtwoche gehören"))
	}

	if err := database.GetDB().Save(&shiftDay).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	// Lade aktualisierte Beziehungen
	database.GetDB().
		Preload("ShiftWeek.Department").
		Preload("ShiftType").
		Preload("User").
		First(&shiftDay, id)

	return c.JSON(responses.SuccessResponse("Schichttag erfolgreich aktualisiert", shiftDay))
}

// @Summary Schichttag löschen
// @Description Löscht einen Schichttag
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "Schichttag-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/shiftdays/{id} [delete]
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

// Hilfsfunktion zur Validierung eines Schichttags
func validateShiftDay(shiftDay *models.ShiftDay) error {
	if shiftDay.Date.IsZero() {
		return fmt.Errorf("Datum ist erforderlich")
	}

	if shiftDay.ShiftWeekID == 0 {
		return fmt.Errorf("Schichtwoche ist erforderlich")
	}

	if shiftDay.ShiftTypeID == 0 {
		return fmt.Errorf("Schichttyp ist erforderlich")
	}

	if shiftDay.UserID == 0 {
		return fmt.Errorf("Benutzer ist erforderlich")
	}

	// Prüfe ob der Tag in der Schichtwoche liegt
	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, shiftDay.ShiftWeekID).Error; err != nil {
		return fmt.Errorf("Schichtwoche nicht gefunden")
	}

	if shiftDay.Date.Before(shiftWeek.StartDate) || shiftDay.Date.After(shiftWeek.EndDate) {
		return fmt.Errorf("Datum muss innerhalb der Schichtwoche liegen")
	}

	// Prüfe ob der Benutzer bereits eine Schicht an diesem Tag hat
	var existingShift models.ShiftDay
	if err := database.GetDB().
		Where("date = ? AND user_id = ? AND id != ?",
			shiftDay.Date, shiftDay.UserID, shiftDay.ID).
		First(&existingShift).Error; err == nil {
		return fmt.Errorf("Benutzer hat bereits eine Schicht an diesem Tag")
	}

	return nil
}
