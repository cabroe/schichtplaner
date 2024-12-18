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
// @Description Ruft alle Abteilungen mit zugehörigen Mitarbeitern, Beschreibungen und Schichtwochen ab
// @Tags departments
// @Accept json
// @Produce json
// @Success 200 {object} responses.APIResponse{data=[]models.Department}
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/departments [get]
func HandleAllDepartments(c *fiber.Ctx) error {
	var departments []models.Department
	result := database.GetDB().
		Preload("Employees", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, first_name, last_name, email, color, department_id, is_admin").
				Order("last_name, first_name")
		}).
		Preload("ShiftWeeks", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, calendar_week, year, department_id, status").
				Order("year DESC, calendar_week DESC")
		}).
		Order("name").
		Find(&departments)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, departments))
}

// @Summary Abteilung erstellen
// @Description Erstellt eine neue Abteilung mit Name, Farbe, Beschreibung und weiteren Daten
// @Tags departments
// @Accept json
// @Produce json
// @Param department body models.Department true "Abteilungsdaten inkl. Beschreibung"
// @Success 201 {object} responses.APIResponse{data=models.Department}
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/departments [post]
func HandleCreateDepartment(c *fiber.Ctx) error {
	department := new(models.Department)
	if err := c.BodyParser(department); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	if err := validateDepartment(department); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	result := database.GetDB().Create(&department)
	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	database.GetDB().
		Preload("Employees").
		Preload("ShiftWeeks").
		First(&department, department.ID)

	return c.Status(201).JSON(responses.SuccessResponse(responses.MsgSuccessCreate, department))
}

// @Summary Einzelne Abteilung abrufen
// @Description Ruft eine spezifische Abteilung mit allen Details inkl. Beschreibung ab
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
		Preload("Employees").
		Preload("ShiftWeeks.ShiftDays.ShiftType").
		First(&department, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, department))
}

// @Summary Abteilung aktualisieren
// @Description Aktualisiert eine bestehende Abteilung inkl. Name, Farbe und Beschreibung
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Abteilungs-ID"
// @Param department body models.Department true "Aktualisierte Abteilungsdaten inkl. Beschreibung"
// @Success 200 {object} responses.APIResponse{data=models.Department}
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/departments/{id} [put]
func HandleUpdateDepartment(c *fiber.Ctx) error {
	id := c.Params("id")
	var department models.Department

	if err := database.GetDB().First(&department, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	if err := c.BodyParser(&department); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	if err := validateDepartment(&department); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(err.Error()))
	}

	if err := database.GetDB().Save(&department).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	database.GetDB().
		Preload("Employees").
		Preload("ShiftWeeks").
		First(&department, id)

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessUpdate, department))
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

	if err := database.GetDB().
		Preload("Employees").
		Preload("ShiftWeeks").
		First(&department, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	tx := database.GetDB().Begin()

	if err := tx.Model(&models.Employee{}).Where("department_id = ?", id).Update("department_id", nil).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	if err := tx.Where("department_id = ?", id).Delete(&models.ShiftWeek{}).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	if err := tx.Delete(&department).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	tx.Commit()

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessDelete, nil))
}

// @Summary Abteilungsstatistiken abrufen
// @Description Ruft statistische Daten einer Abteilung ab
// @Tags departments
// @Accept json
// @Produce json
// @Param id path int true "Abteilungs-ID"
// @Success 200 {object} responses.APIResponse{data=map[string]interface{}}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/departments/{id}/stats [get]
func HandleDepartmentStats(c *fiber.Ctx) error {
	id := c.Params("id")
	var department models.Department

	result := database.GetDB().
		Preload("ShiftWeeks").
		Preload("Employees").
		First(&department, id)

	if result.Error != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	stats := map[string]interface{}{
		"employeeCount":    len(department.Employees),
		"shiftWeekCount":   len(department.ShiftWeeks),
		"activeShiftWeeks": countActiveShiftWeeks(department.ShiftWeeks),
	}

	return c.JSON(responses.SuccessResponse("Statistiken erfolgreich abgerufen", stats))
}

func validateDepartment(department *models.Department) error {
	if department.Name == "" {
		return fmt.Errorf("name ist erforderlich")
	}
	if department.Color == "" {
		return fmt.Errorf("farbe ist erforderlich")
	}
	if len(department.Name) < 2 {
		return fmt.Errorf("name muss mindestens 2 Zeichen lang sein")
	}
	if len(department.Name) > 50 {
		return fmt.Errorf("name darf maximal 50 Zeichen lang sein")
	}
	return nil
}

func countActiveShiftWeeks(weeks []models.ShiftWeek) int {
	count := 0
	for _, week := range weeks {
		if week.Status == models.StatusPublished {
			count++
		}
	}
	return count
}
