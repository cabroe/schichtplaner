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
// @Success 200 {object} responses.APIResponse{data=[]models.ShiftDay}
// @Failure 500 {object} responses.APIResponse
// @Router /api/v1/shiftdays [get]
func HandleAllShiftDays(c *fiber.Ctx) error {
	var shiftDays []models.ShiftDay
	result := database.GetDB().
		Preload("ShiftWeek", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, calendar_week, year, department_id, status").
				Order("year DESC, calendar_week DESC")
		}).
		Preload("ShiftType", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, name, description, color").
				Order("name")
		}).
		Preload("Employee", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, first_name, last_name, email, color, department_id").
				Order("last_name, first_name")
		}).
		Preload("ShiftWeek.Department").
		Order("date DESC").
		Find(&shiftDays)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}
	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftDays))
}

// @Summary Schichttag erstellen
// @Description Erstellt einen neuen Schichttag mit Validierungen
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param shiftday body models.ShiftDay true "Schichttag-Daten"
// @Success 201 {object} responses.APIResponse{data=models.ShiftDay}
// @Failure 400 {object} responses.APIResponse
// @Router /api/v1/shiftdays [post]
func HandleCreateShiftDay(c *fiber.Ctx) error {
	shiftDay := new(models.ShiftDay)
	if err := c.BodyParser(shiftDay); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
	}

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, shiftDay.ShiftWeekID).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse("Schichtwoche nicht gefunden"))
	}

	if shiftWeek.Status != models.StatusDraft {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrDraftOnly))
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

	return c.Status(201).JSON(responses.SuccessResponse(responses.MsgSuccessCreate, shiftDay))
}

// @Summary Einzelnen Schichttag abrufen
// @Description Ruft einen spezifischen Schichttag mit allen Details ab
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "Schichttag-ID"
// @Success 200 {object} responses.APIResponse{data=models.ShiftDay}
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
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftDay))
}

// @Summary Schichttag aktualisieren
// @Description Aktualisiert einen bestehenden Schichttag
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "Schichttag-ID"
// @Param shiftday body models.ShiftDay true "Aktualisierte Schichttag-Daten"
// @Success 200 {object} responses.APIResponse{data=models.ShiftDay}
// @Failure 400,404 {object} responses.APIResponse
// @Router /api/v1/shiftdays/{id} [put]
func HandleUpdateShiftDay(c *fiber.Ctx) error {
	id := c.Params("id")
	var shiftDay models.ShiftDay

	if err := database.GetDB().
		Preload("ShiftWeek").
		First(&shiftDay, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	if !shiftDay.CanBeModified() {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrDraftOnly))
	}

	if err := c.BodyParser(&shiftDay); err != nil {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrInvalidInput))
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

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessUpdate, shiftDay))
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

	if err := database.GetDB().
		Preload("ShiftWeek").
		First(&shiftDay, id).Error; err != nil {
		return c.Status(404).JSON(responses.ErrorResponse(responses.ErrNotFound))
	}

	if !shiftDay.CanBeModified() {
		return c.Status(400).JSON(responses.ErrorResponse(responses.ErrDraftOnly))
	}

	if err := database.GetDB().Delete(&shiftDay).Error; err != nil {
		return c.Status(500).JSON(responses.ErrorResponse(err.Error()))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessDelete, nil))
}

// @Summary Schichttage nach Woche abrufen
// @Description Ruft alle Schichttage einer bestimmten Woche ab
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "Schichtwoche-ID"
// @Success 200 {object} responses.APIResponse{data=[]models.ShiftDay}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shiftdays/week/{id} [get]
func HandleGetShiftDaysByWeek(c *fiber.Ctx) error {
	weekID := c.Params("id")
	var shiftDays []models.ShiftDay

	result := database.GetDB().
		Where("shift_week_id = ?", weekID).
		Preload("ShiftType").
		Preload("Employee").
		Order("date").
		Find(&shiftDays)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftDays))
}

// @Summary Schichttage eines Mitarbeiters abrufen
// @Description Ruft alle Schichttage eines bestimmten Mitarbeiters ab
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "Mitarbeiter-ID"
// @Success 200 {object} responses.APIResponse{data=[]models.ShiftDay}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shiftdays/employee/{id} [get]
func HandleGetEmployeeShiftDays(c *fiber.Ctx) error {
	employeeID := c.Params("id")
	var shiftDays []models.ShiftDay

	result := database.GetDB().
		Where("employee_id = ?", employeeID).
		Preload("ShiftWeek").
		Preload("ShiftType").
		Order("date DESC").
		Find(&shiftDays)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftDays))
}

// @Summary Schichttage einer Abteilung abrufen
// @Description Ruft alle Schichttage einer bestimmten Abteilung ab
// @Tags shiftdays
// @Accept json
// @Produce json
// @Param id path int true "Abteilungs-ID"
// @Success 200 {object} responses.APIResponse{data=[]models.ShiftDay}
// @Failure 404 {object} responses.APIResponse
// @Router /api/v1/shiftdays/department/{id} [get]
func HandleGetDepartmentShiftDays(c *fiber.Ctx) error {
	departmentID := c.Params("id")
	var shiftDays []models.ShiftDay

	result := database.GetDB().
		Joins("JOIN shift_weeks ON shift_days.shift_week_id = shift_weeks.id").
		Where("shift_weeks.department_id = ?", departmentID).
		Preload("ShiftWeek").
		Preload("ShiftType").
		Preload("Employee").
		Order("date DESC").
		Find(&shiftDays)

	if result.Error != nil {
		return c.Status(500).JSON(responses.ErrorResponse(result.Error.Error()))
	}

	return c.JSON(responses.SuccessResponse(responses.MsgSuccessGet, shiftDays))
}

func validateShiftDay(shiftDay *models.ShiftDay) error {
	if shiftDay.Date.IsZero() {
		return fmt.Errorf("datum ist erforderlich")
	}

	if shiftDay.ShiftWeekID == nil {
		return fmt.Errorf("schichtwoche ist erforderlich")
	}

	if shiftDay.ShiftTypeID == 0 {
		return fmt.Errorf("schichttyp ist erforderlich")
	}

	var shiftWeek models.ShiftWeek
	if err := database.GetDB().First(&shiftWeek, shiftDay.ShiftWeekID).Error; err != nil {
		return fmt.Errorf("schichtwoche nicht gefunden")
	}

	year, week := shiftDay.Date.ISOWeek()
	if year != shiftWeek.Year || week != shiftWeek.CalendarWeek {
		return fmt.Errorf("datum liegt außerhalb der schichtwoche")
	}

	if shiftDay.EmployeeID != nil {
		var employee models.Employee
		if err := database.GetDB().First(&employee, shiftDay.EmployeeID).Error; err != nil {
			return fmt.Errorf("mitarbeiter nicht gefunden")
		}

		if !shiftDay.ValidateEmployeeDepartment(&employee, &shiftWeek) {
			return fmt.Errorf("mitarbeiter muss zur gleichen abteilung wie die schichtwoche gehören")
		}

		if shiftDay.HasConflict(database.GetDB()) {
			return fmt.Errorf("mitarbeiter hat bereits eine schicht an diesem tag")
		}
	}

	return nil
}
