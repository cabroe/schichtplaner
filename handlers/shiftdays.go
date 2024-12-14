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
		Preload("Employee", func(db *gorm.DB) *gorm.DB {
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

	result := database.GetDB().Create(&shiftDay)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	database.GetDB().
		Preload("ShiftWeek.Department").
		Preload("ShiftType").
		Preload("Employee").
		First(&shiftDay, shiftDay.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Schichttag erfolgreich erstellt", shiftDay))
}

// @Summary Einzelnen Schichttag abrufen
// @Description Ruft einen spezifischen Schichttag mit allen Details ab
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
		Preload("Employee").
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

	if err := database.GetDB().Save(&shiftDay).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	database.GetDB().
		Preload("ShiftWeek.Department").
		Preload("ShiftType").
		Preload("Employee").
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

	if err := database.GetDB().Delete(&shiftDay).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	return c.JSON(responses.SuccessResponse("Schichttag erfolgreich gelöscht", nil))
}

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

	if shiftDay.EmployeeID == 0 {
		return fmt.Errorf("Mitarbeiter ist erforderlich")
	}

	var employee models.Employee
	if err := database.GetDB().First(&employee, shiftDay.EmployeeID).Error; err != nil {
		return fmt.Errorf("Mitarbeiter nicht gefunden")
	}

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, shiftDay.ShiftWeekID).Error; err != nil {
		return fmt.Errorf("Schichtwoche nicht gefunden")
	}

	if employee.DepartmentID != shiftWeek.DepartmentID {
		return fmt.Errorf("Mitarbeiter muss zur gleichen Abteilung wie die Schichtwoche gehören")
	}

	return nil
}
