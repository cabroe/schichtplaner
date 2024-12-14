package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
	"gorm.io/gorm"
)

// @Summary Alle Schichtwochen abrufen
// @Description Ruft alle Schichtwochen mit relevanten Beziehungen ab
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/shiftweeks [get]
func HandleAllShiftWeeks(c *fiber.Ctx) error {
	var shiftWeeks []models.ShiftWeek
	result := database.GetDB().
		Preload("Department", func(db *gorm.DB) *gorm.DB {
			return db.Select("id")
		}).
		Preload("ShiftDays", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, date, shift_type_id, employee_id, shift_week_id")
		}).
		Preload("ShiftDays.ShiftType", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, description, duration, color")
		}).
		Preload("ShiftDays.Employee", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, first_name, last_name, email, color, department_id")
		}).
		Find(&shiftWeeks)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse("Schichtwochen erfolgreich abgerufen", shiftWeeks))
}

// @Summary Schichtwoche erstellen
// @Description Erstellt eine neue Schichtwoche mit Validierungen
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param shiftweek body models.ShiftWeek true "Schichtwoche-Daten"
// @Success 201 {object} responses.APIResponse
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/shiftweeks [post]
func HandleCreateShiftWeek(c *fiber.Ctx) error {
	shiftWeek := new(models.ShiftWeek)
	if err := c.BodyParser(shiftWeek); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if err := validateShiftWeek(shiftWeek); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	result := database.GetDB().Create(&shiftWeek)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	database.GetDB().
		Preload("Department", func(db *gorm.DB) *gorm.DB {
			return db.Select("id")
		}).
		First(&shiftWeek, shiftWeek.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Schichtwoche erfolgreich erstellt", shiftWeek))
}

// @Summary Einzelne Schichtwoche abrufen
// @Description Ruft eine spezifische Schichtwoche ab
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/{id} [get]
func HandleGetOneShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftWeek models.ShiftWeek

	result := database.GetDB().
		Preload("Department", func(db *gorm.DB) *gorm.DB {
			return db.Select("id")
		}).
		First(&shiftWeek, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	return c.JSON(responses.SuccessResponse("Schichtwoche erfolgreich abgerufen", shiftWeek))
}

// @Summary Schichtwoche aktualisieren
// @Description Aktualisiert eine bestehende Schichtwoche
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Param shiftweek body models.ShiftWeek true "Aktualisierte Schichtwoche-Daten"
// @Success 200 {object} responses.APIResponse
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/{id} [put]
func HandleUpdateShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftWeek models.ShiftWeek

	if err := database.GetDB().First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	if err := c.BodyParser(&shiftWeek); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if err := validateShiftWeek(&shiftWeek); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	if err := database.GetDB().Save(&shiftWeek).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	database.GetDB().
		Preload("Department", func(db *gorm.DB) *gorm.DB {
			return db.Select("id")
		}).
		First(&shiftWeek, id)

	return c.JSON(responses.SuccessResponse("Schichtwoche erfolgreich aktualisiert", shiftWeek))
}

// @Summary Schichtwoche löschen
// @Description Löscht eine Schichtwoche
// @Tags shiftweeks
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/shiftweeks/{id} [delete]
func HandleDeleteShiftWeek(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftWeek models.ShiftWeek

	if err := database.GetDB().First(&shiftWeek, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	var shiftDayCount int64
	database.GetDB().Model(&models.ShiftDay{}).Where("shift_week_id = ?", id).Count(&shiftDayCount)
	if shiftDayCount > 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Schichtwoche kann nicht gelöscht werden, da noch Schichttage zugeordnet sind"))
	}

	result := database.GetDB().Delete(&shiftWeek)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse("Schichtwoche erfolgreich gelöscht", nil))
}

func validateShiftWeek(shiftWeek *models.ShiftWeek) error {
	if shiftWeek.StartDate.IsZero() || shiftWeek.EndDate.IsZero() {
		return fmt.Errorf("Start- und Enddatum sind erforderlich")
	}
	if shiftWeek.EndDate.Before(shiftWeek.StartDate) {
		return fmt.Errorf("Enddatum muss nach dem Startdatum liegen")
	}
	if shiftWeek.DepartmentID == 0 {
		return fmt.Errorf("Abteilung ist erforderlich")
	}

	var department models.Department
	if err := database.GetDB().First(&department, shiftWeek.DepartmentID).Error; err != nil {
		return fmt.Errorf("Abteilung nicht gefunden")
	}

	return nil
}
