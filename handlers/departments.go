package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/ptmmeiningen/schichtplaner/database"
	"github.com/ptmmeiningen/schichtplaner/models"
	"github.com/ptmmeiningen/schichtplaner/pkg/responses"
	"gorm.io/gorm"
)

// @Summary Alle Abteilungen abrufen
// @Description Ruft alle Abteilungen mit zugehörigen Benutzern und Schichtwochen ab
// @Tags departments
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse{data=[]models.Department}
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/departments [get]
func HandleAllDepartments(c *fiber.Ctx) error {
	var departments []models.Department
	result := database.GetDB().
		Preload("Users", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, first_name, last_name, email, color, department_id, is_admin")
		}).
		Preload("ShiftWeeks", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, start_date, end_date, department_id")
		}).
		Preload("ShiftWeeks.ShiftDays", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, date, shift_type_id, user_id, shift_week_id")
		}).
		Find(&departments)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse("Abteilungen erfolgreich abgerufen", departments))
}

// @Summary Einzelne Abteilung abrufen
// @Description Ruft eine spezifische Abteilung mit allen Details ab
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Abteilungs-ID"
// @Success 200 {object} responses.APIResponse{data=models.Department}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/departments/{id} [get]
func HandleGetOneDepartment(c *fiber.Ctx) error {
	id := c.Params("id")
	var department models.Department

	result := database.GetDB().
		Preload("Users", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, first_name, last_name, email, color, department_id, is_admin")
		}).
		Preload("ShiftWeeks", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, start_date, end_date, department_id")
		}).
		Preload("ShiftWeeks.ShiftDays.ShiftType").
		Preload("ShiftWeeks.ShiftDays.User").
		First(&department, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Abteilung nicht gefunden"))
	}
	return c.JSON(responses.SuccessResponse("Abteilung erfolgreich abgerufen", department))
}

// @Summary Neue Abteilung erstellen
// @Description Erstellt eine neue Abteilung mit den angegebenen Daten
// @Tags departments
// @Accept json
// @Produce json
// @Param department body models.Department true "Abteilungsdaten"
// @Success 201 {object} responses.APIResponse{data=models.Department}
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/departments [post]
func HandleCreateDepartment(c *fiber.Ctx) error {
	department := new(models.Department)
	if err := c.BodyParser(department); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if err := validateDepartment(department); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	result := database.GetDB().Create(&department)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	// Lade die erstellte Abteilung mit allen Beziehungen
	database.GetDB().
		Preload("Users").
		Preload("ShiftWeeks").
		First(&department, department.ID)

	return c.Status(201).JSON(responses.SuccessResponse("Abteilung erfolgreich erstellt", department))
}

// @Summary Abteilung aktualisieren
// @Description Aktualisiert eine bestehende Abteilung
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Abteilungs-ID"
// @Param department body models.Department true "Aktualisierte Abteilungsdaten"
// @Success 200 {object} responses.APIResponse{data=models.Department}
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/departments/{id} [put]
func HandleUpdateDepartment(c *fiber.Ctx) error {
	id := c.Params("id")
	var department models.Department

	if err := database.GetDB().First(&department, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Abteilung nicht gefunden"))
	}

	if err := c.BodyParser(&department); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse("Ungültige Eingabe"))
	}

	if err := validateDepartment(&department); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	if err := database.GetDB().Save(&department).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	// Lade aktualisierte Beziehungen
	database.GetDB().
		Preload("Users").
		Preload("ShiftWeeks").
		First(&department, id)

	return c.JSON(responses.SuccessResponse("Abteilung erfolgreich aktualisiert", department))
}

// @Summary Abteilung löschen
// @Description Löscht eine Abteilung und ihre Beziehungen
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Abteilungs-ID"
// @Success 200 {object} responses.APIResponse
// @Failure 404,500 {object} responses.APIResponse
// @Router /api/v1/departments/{id} [delete]
func HandleDeleteDepartment(c *fiber.Ctx) error {
	id := c.Params("id")
	var department models.Department

	if err := database.GetDB().First(&department, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Abteilung nicht gefunden"))
	}

	// Prüfe ob noch Benutzer oder Schichtwochen zugeordnet sind
	var userCount int64
	database.GetDB().Model(&models.User{}).Where("department_id = ?", id).Count(&userCount)
	if userCount > 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Abteilung kann nicht gelöscht werden, da noch Benutzer zugeordnet sind"))
	}

	var shiftWeekCount int64
	database.GetDB().Model(&models.ShiftWeek{}).Where("department_id = ?", id).Count(&shiftWeekCount)
	if shiftWeekCount > 0 {
		return c.Status(400).JSON(responses.ErrorResponse("Abteilung kann nicht gelöscht werden, da noch Schichtwochen zugeordnet sind"))
	}

	result := database.GetDB().Delete(&department)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse("Abteilung erfolgreich gelöscht", nil))
}

// Hilfsfunktion zur Validierung einer Abteilung
func validateDepartment(department *models.Department) error {
	if department.Name == "" {
		return fmt.Errorf("Name ist erforderlich")
	}
	if department.Color == "" {
		return fmt.Errorf("Farbe ist erforderlich")
	}
	return nil
}
